'use client'

/**
 * @description
 * <RichTextField> — Lexical editor re-wrap for the v2 admin shell.
 * Custom toolbar (B/I/U, headings, lists, quote, code, link, image)
 * surrounds a stock Lexical RichTextPlugin. Serializes to/from
 * Lexical's standard JSON shape so values round-trip with Payload's
 * existing rich-text columns.
 *
 * @notes
 * - Risk per PRD §Risk register: "Lexical re-wrap fidelity". Mitigation
 *   is to use Lexical's published nodes 1:1 — not to fork or rewrite
 *   them. Only the surrounding chrome is bespoke here.
 * - Image embeds reuse <UploadField>'s lazy MediaPickerModal.
 * - Link URLs go through a simple prompt for now; the relationship-
 *   based picker hooks in via #17 in a follow-on.
 */

import * as React from 'react'

import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import {
  ListItemNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
} from '@lexical/rich-text'
import { CodeNode } from '@lexical/code'
import { mergeRegister } from '@lexical/utils'
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  type EditorState,
  type LexicalEditor,
  type SerializedEditorState,
} from 'lexical'
import { $setBlocksType } from '@lexical/selection'

import { useEditFormField, type FieldValidator } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type RichTextFieldProps = FieldCommonProps & {
  /** Optional opener for an image picker; receives an onSelect callback. */
  pickImage?: (onSelect: (url: string, alt: string) => void) => void
}

const required: FieldValidator = (v) => {
  if (!v || typeof v !== 'object') return 'Required'
  // Lexical empty document is { root: { children: [{ type: 'paragraph', children: [] }] } }
  // Treat as required if there are no text children at all.
  const root = (v as { root?: { children?: unknown[] } }).root
  const children = root?.children ?? []
  const hasText = JSON.stringify(children).includes('"text"')
  return hasText ? null : 'Required'
}

const baseTheme = {
  paragraph: 'rt-paragraph',
  heading: {
    h1: 'rt-h1',
    h2: 'rt-h2',
    h3: 'rt-h3',
  },
  text: {
    bold: 'rt-bold',
    italic: 'rt-italic',
    underline: 'rt-underline',
    strikethrough: 'rt-strike',
    code: 'rt-code',
  },
  list: {
    ul: 'rt-ul',
    ol: 'rt-ol',
    listitem: 'rt-li',
  },
  link: 'rt-link',
  quote: 'rt-quote',
  code: 'rt-code-block',
}

const NODES = [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, CodeNode]

const ToolbarButton: React.FC<{
  onMouseDown: (e: React.MouseEvent) => void
  active?: boolean
  disabled?: boolean
  ariaLabel: string
  children: React.ReactNode
}> = ({ onMouseDown, active, disabled, ariaLabel, children }) => (
  <button
    type="button"
    aria-label={ariaLabel}
    aria-pressed={active}
    disabled={disabled}
    onMouseDown={(e) => {
      e.preventDefault()
      onMouseDown(e)
    }}
    style={{
      minWidth: 28,
      height: 28,
      padding: '0 6px',
      border: '1px solid transparent',
      borderRadius: 3,
      background: active ? 'var(--surface-sunken)' : 'transparent',
      color: 'var(--text-primary)',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
  >
    {children}
  </button>
)

const Toolbar: React.FC<{ pickImage?: RichTextFieldProps['pickImage'] }> = ({ pickImage }) => {
  const [editor] = useLexicalComposerContext()
  const [bold, setBold] = React.useState(false)
  const [italic, setItalic] = React.useState(false)
  const [underline, setUnderline] = React.useState(false)
  const [canUndo, setCanUndo] = React.useState(false)
  const [canRedo, setCanRedo] = React.useState(false)

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const sel = $getSelection()
          if (!$isRangeSelection(sel)) return
          setBold(sel.hasFormat('bold'))
          setItalic(sel.hasFormat('italic'))
          setUnderline(sel.hasFormat('underline'))
        })
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor])

  const setBlock = (level: 1 | 2 | 3) => {
    editor.update(() => {
      const sel = $getSelection()
      if ($isRangeSelection(sel)) {
        $setBlocksType(sel, () => $createHeadingNode(`h${level}`))
      }
    })
  }

  const setQuote = () => {
    editor.update(() => {
      const sel = $getSelection()
      if ($isRangeSelection(sel)) {
        $setBlocksType(sel, () => $createQuoteNode())
      }
    })
  }

  const insertLink = () => {
    const href = window.prompt('Link URL')
    if (!href) return
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, href)
  }

  const insertImage = () => {
    if (!pickImage) return
    pickImage((url, alt) => {
      editor.update(() => {
        const sel = $getSelection()
        if (!$isRangeSelection(sel)) return
        // Without a custom ImageNode, store the image as a Markdown-
        // style fallback until the visual page builder swaps in a real
        // ImageNode in the follow-on.
        sel.insertText(`![${alt || 'image'}](${url})`)
      })
    })
  }

  return (
    <div
      role="toolbar"
      aria-label="Rich text formatting"
      data-testid="richtext-toolbar"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        padding: 6,
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--surface-elevated)',
      }}
    >
      <ToolbarButton
        ariaLabel="Bold"
        active={bold}
        onMouseDown={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Italic"
        active={italic}
        onMouseDown={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Underline"
        active={underline}
        onMouseDown={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
      >
        <u>U</u>
      </ToolbarButton>
      <span aria-hidden style={{ width: 1, background: 'var(--border-default)', margin: '0 4px' }} />
      <ToolbarButton ariaLabel="Heading 1" onMouseDown={() => setBlock(1)}>
        H1
      </ToolbarButton>
      <ToolbarButton ariaLabel="Heading 2" onMouseDown={() => setBlock(2)}>
        H2
      </ToolbarButton>
      <ToolbarButton ariaLabel="Heading 3" onMouseDown={() => setBlock(3)}>
        H3
      </ToolbarButton>
      <ToolbarButton ariaLabel="Quote" onMouseDown={setQuote}>
        &ldquo;
      </ToolbarButton>
      <span aria-hidden style={{ width: 1, background: 'var(--border-default)', margin: '0 4px' }} />
      <ToolbarButton
        ariaLabel="Bulleted list"
        onMouseDown={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        •
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Numbered list"
        onMouseDown={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        1.
      </ToolbarButton>
      <span aria-hidden style={{ width: 1, background: 'var(--border-default)', margin: '0 4px' }} />
      <ToolbarButton ariaLabel="Insert link" onMouseDown={insertLink}>
        🔗
      </ToolbarButton>
      {pickImage && (
        <ToolbarButton ariaLabel="Insert image" onMouseDown={insertImage}>
          🖼
        </ToolbarButton>
      )}
      <span aria-hidden style={{ width: 1, background: 'var(--border-default)', margin: '0 4px' }} />
      <ToolbarButton
        ariaLabel="Undo"
        disabled={!canUndo}
        onMouseDown={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        ariaLabel="Redo"
        disabled={!canRedo}
        onMouseDown={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        ↷
      </ToolbarButton>
    </div>
  )
}

const ReadOnlyPlugin: React.FC<{ readOnly: boolean }> = ({ readOnly }) => {
  const [editor] = useLexicalComposerContext()
  React.useEffect(() => {
    editor.setEditable(!readOnly)
  }, [editor, readOnly])
  return null
}

export const RichTextField: React.FC<RichTextFieldProps> = ({
  name,
  label,
  description,
  required: isRequired,
  lock = 'unlocked',
  readOnly,
  pickImage,
}) => {
  const { value, error, dirty, setValue } = useEditFormField(
    name,
    isRequired ? required : undefined,
  )
  const isReadOnly = readOnly || lock === 'locked-by-other'

  const initialConfig = React.useMemo(
    () => ({
      namespace: `richtext-${name}`,
      theme: baseTheme,
      nodes: NODES,
      onError(err: Error) {
        // eslint-disable-next-line no-console
        console.error('[RichTextField]', err)
      },
      editorState:
        value && typeof value === 'object'
          ? (editor: LexicalEditor) => {
              try {
                editor.setEditorState(
                  editor.parseEditorState(value as SerializedEditorState),
                )
              } catch {
                editor.update(() => {
                  $getRoot().clear()
                })
              }
            }
          : undefined,
      editable: !isReadOnly,
    }),
    // intentionally not re-creating per render; value re-load is handled by the stored state inside the editor
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
  )

  const handleChange = (editorState: EditorState) => {
    const json = editorState.toJSON()
    setValue(json)
  }

  return (
    <FieldShell
      name={name}
      label={label}
      description={description}
      required={isRequired}
      lock={lock}
      error={error}
      dirty={dirty}
    >
      <div
        data-testid={`richtext-${name}`}
        style={{
          border: `1px solid ${error ? 'var(--workflow-revision)' : 'var(--border-default)'}`,
          borderRadius: 4,
          background: isReadOnly ? 'var(--surface-sunken)' : 'var(--surface-page)',
        }}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <ReadOnlyPlugin readOnly={isReadOnly} />
          <Toolbar pickImage={pickImage} />
          <div style={{ position: 'relative' }}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  id={name}
                  aria-label={label ?? name}
                  data-testid={`richtext-${name}-editor`}
                  style={{
                    minHeight: 120,
                    padding: 12,
                    fontSize: 14,
                    lineHeight: 1.5,
                    outline: 'none',
                  }}
                />
              }
              placeholder={
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    color: 'var(--text-muted)',
                    fontSize: 14,
                    pointerEvents: 'none',
                  }}
                >
                  Type here…
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin onChange={handleChange} />
        </LexicalComposer>
      </div>
    </FieldShell>
  )
}

export default RichTextField

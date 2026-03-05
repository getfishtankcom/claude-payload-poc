/**
 * @description
 * Blockquote question component for displaying numbered comment questions
 * on document detail pages. Shows a bordered box with question number heading
 * and rich text body.
 *
 * Key features:
 * - Bordered box with light background
 * - "Question N" heading (e.g., "Question 1")
 * - Static display — no expand/collapse, no form input
 * - Full width on mobile with reduced horizontal padding
 *
 * @dependencies
 * - RichText: For rendering rich text question content
 *
 * @notes
 * - Server component — no interactivity
 * - Questions are display-only (comments are submitted via separate form)
 */
import { RichText } from '@/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type BlockquoteQuestionProps = {
  /** Question number (1-indexed) */
  questionNumber: number
  /** Rich text question content */
  questionText: SerializedEditorState | Record<string, unknown> | null | undefined
  className?: string
}

export function BlockquoteQuestion({
  questionNumber,
  questionText,
  className = '',
}: BlockquoteQuestionProps) {
  return (
    <div
      className={`rounded-sm border border-gray-300 bg-gray-50 px-4 py-4 sm:px-6 ${className}`.trim()}
      data-testid={`blockquote-question-${questionNumber}`}
    >
      <h4 className="text-sm font-bold uppercase tracking-wide text-primary">
        Question {questionNumber}
      </h4>

      {questionText && (
        <RichText
          content={questionText}
          className="mt-2 text-base text-text-primary [&_p]:leading-relaxed"
        />
      )}
    </div>
  )
}

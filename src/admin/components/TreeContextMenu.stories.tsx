/**
 * @description
 * Storybook stories for the TreeContextMenu component (Epic 23, task 23.4).
 * Shows context menu with various node types, roles, and states.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { TreeContextMenu } from './TreeContextMenu'

const noop = () => {}

const meta = {
  title: 'Admin/TreeContextMenu',
  component: TreeContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    x: 100,
    y: 100,
    userRole: 'admin',
    userId: 'user-1',
    onClose: noop,
    onInsert: noop,
    onOpenInNewTab: noop,
    onDuplicate: noop,
    onRename: noop,
    onMoveTo: noop,
    onCopy: noop,
    onLockToggle: noop,
    onDelete: noop,
  },
} satisfies Meta<typeof TreeContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const FolderNode: Story = {
  args: {
    node: {
      id: 'folder-1',
      title: 'Boards',
      slug: 'boards-folder',
      contentType: 'folder',
      workflowState: 'published',
      lockedBy: null,
      hasChildren: true,
      sortOrder: 0,
      parent: 'root-1',
      board: null,
    },
    nodeDepth: 1,
  },
}

export const PageNode: Story = {
  args: {
    node: {
      id: 'page-1',
      title: 'About AcSB',
      slug: 'acsb-about',
      contentType: 'page',
      workflowState: 'draft',
      lockedBy: null,
      hasChildren: false,
      sortOrder: 0,
      parent: 'acsb-page',
      board: 'board-1',
    },
    nodeDepth: 3,
  },
}

export const LockedByOther: Story = {
  args: {
    node: {
      id: 'page-2',
      title: 'PSAB',
      slug: 'board-psab',
      contentType: 'page',
      workflowState: 'published',
      lockedBy: 'user-2',
      hasChildren: false,
      sortOrder: 1,
      parent: 'boards-folder',
      board: 'board-2',
    },
    nodeDepth: 2,
    userId: 'user-1',
  },
}

export const AuthorRole: Story = {
  args: {
    node: {
      id: 'news-1',
      title: 'New Standards Published',
      slug: 'news-standards',
      contentType: 'news',
      workflowState: 'published',
      lockedBy: null,
      hasChildren: false,
      sortOrder: 0,
      parent: 'news-folder',
      board: null,
    },
    nodeDepth: 2,
    userRole: 'author',
  },
}

export const DepthLimit: Story = {
  name: 'At Depth 5 (No Insert)',
  args: {
    node: {
      id: 'deep-1',
      title: 'Deep Page',
      slug: 'deep-page',
      contentType: 'page',
      workflowState: 'draft',
      lockedBy: null,
      hasChildren: false,
      sortOrder: 0,
      parent: 'parent-4',
      board: null,
    },
    nodeDepth: 5,
  },
}

export const ProjectsFolder: Story = {
  name: 'Projects Folder (Insert Project only)',
  args: {
    node: {
      id: 'proj-folder',
      title: 'Projects',
      slug: 'projects-folder',
      contentType: 'folder',
      workflowState: 'published',
      lockedBy: null,
      hasChildren: true,
      sortOrder: 2,
      parent: 'root-1',
      board: null,
    },
    nodeDepth: 1,
  },
}

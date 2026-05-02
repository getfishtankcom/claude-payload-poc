'use client'

/**
 * @description
 * Wrapper that mounts `<TreeSpine>` with the sample dataset. Used as
 * the `leftRail` slot in `<AdminShell>` until a live tree loader ships.
 */

import * as React from 'react'

import { SAMPLE_TREE, SAMPLE_VALID_CHILDREN } from './sample-data'
import { TreeSpine } from './TreeSpine'

export const TreeSpineDefault: React.FC = () => (
  <TreeSpine nodes={SAMPLE_TREE} validChildren={SAMPLE_VALID_CHILDREN} />
)

export default TreeSpineDefault

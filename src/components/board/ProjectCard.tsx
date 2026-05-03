/**
 * @description
 * Project card component for Active Projects listing and Board Detail pages.
 * Displays project title, badges, description, stage indicator, and action buttons.
 *
 * Key features:
 * - Title renders as linked heading to project detail page
 * - Type badges row (Exposure Draft, Survey, etc.)
 * - Description text (truncated with line-clamp)
 * - Stage indicator: "Stage N: [Stage Name]"
 * - Action buttons from project timeline CTAs
 *
 * @dependencies
 * - Badge component for type badges
 * - next/link for project detail navigation
 *
 * @notes
 * - Server component (no interactivity)
 * - Board slug needed for constructing detail URL: /active-projects/[board]/[project-slug]
 */
import React from 'react'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/Badge'

type ProjectBadge = {
  badge_type?: string | null
  id?: string | null
}

type ProjectCTA = {
  label: string
  url: string
}

export type ProjectCardData = {
  id: string | number
  title: string
  slug: string
  description?: string | null
  boardSlug: string
  badges?: ProjectBadge[] | null
  currentStage?: number | null
  currentStageName?: string | null
  ctas?: ProjectCTA[]
}

type ProjectCardProps = {
  project: ProjectCardData
  className?: string
}

/** Map badge type string to Badge component variant */
function badgeTypeToVariant(type: string): 'standard' | 'consultation' | 'news' | 'webinar' | 'resource' | 'meeting' | 'guidance' {
  const mapping: Record<string, 'standard' | 'consultation' | 'news' | 'webinar' | 'resource' | 'meeting' | 'guidance'> = {
    'Exposure Draft': 'standard',
    'Public Comment': 'consultation',
    'Survey': 'webinar',
    'Research': 'resource',
    'Re-exposure Draft': 'guidance',
  }
  return mapping[type] || 'standard'
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const detailUrl = `/active-projects/${project.boardSlug}/${project.slug}`

  return (
    <article
      className={`rounded-md border border-gray-200 bg-white p-5 ${className}`.trim()}
      data-testid="project-card"
    >
      {/* Title */}
      <h3 className="text-lg font-semibold">
        <Link
          href={detailUrl}
          className="text-primary hover:underline"
        >
          {project.title}
        </Link>
      </h3>

      {/* Badges row */}
      {project.badges && project.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.badges.map((badge, i) => (
            badge.badge_type && (
              <Badge key={badge.id || i} variant={badgeTypeToVariant(badge.badge_type)}>
                {badge.badge_type}
              </Badge>
            )
          ))}
        </div>
      )}

      {/* Description */}
      {project.description && (
        <p className="mt-3 text-sm text-text-primary line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Stage indicator */}
      {project.currentStage && project.currentStageName && (
        <div className="mt-3 flex items-center gap-2" data-testid="stage-indicator">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {project.currentStage}
          </span>
          <span className="text-sm font-medium text-text-heading">
            Stage {project.currentStage}: {project.currentStageName}
          </span>
        </div>
      )}

      {/* Action buttons */}
      {project.ctas && project.ctas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.ctas.map((cta, i) => (
            <a
              key={i}
              href={cta.url}
              className="inline-flex items-center rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              target={cta.url.startsWith('http') ? '_blank' : undefined}
              rel={cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {cta.label}
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

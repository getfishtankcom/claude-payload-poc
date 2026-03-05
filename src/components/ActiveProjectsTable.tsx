/**
 * @description
 * Active projects table for standards overview pages (Template 5).
 * Two-column table: "Project Name" (purple link) and "Description".
 * Mobile: 2-column table becomes stacked cards.
 *
 * Key features:
 * - Purple linked project names
 * - Responsive: table on desktop, stacked cards on mobile
 * - Alternating row backgrounds for readability
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Props come from standards-sections.activeProjects collection
 * - Empty state returns null (parent handles empty messaging)
 */

export type ActiveProject = {
  name: string
  href: string
  description: string
}

export type ActiveProjectsTableProps = {
  /** Array of active projects to display */
  projects: ActiveProject[]
}

export function ActiveProjectsTable({ projects }: ActiveProjectsTableProps) {
  if (!projects || projects.length === 0) {
    return (
      <p className="py-4 text-sm italic text-text-muted" data-testid="active-projects-empty">
        No active projects at this time.
      </p>
    )
  }

  return (
    <div data-testid="active-projects-table">
      {/* Desktop table */}
      <table className="hidden md:table w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-3 pr-6 text-left text-sm font-bold text-text-primary">
              Project Name
            </th>
            <th className="py-3 text-left text-sm font-bold text-text-primary">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr
              key={project.href}
              className={`border-b border-gray-200 ${
                index % 2 === 1 ? 'bg-row-alt' : ''
              }`}
            >
              <td className="py-3 pr-6 align-top">
                <a
                  href={project.href}
                  className="text-sm font-medium text-link hover:underline"
                >
                  {project.name}
                </a>
              </td>
              <td className="py-3 text-sm text-text-primary">{project.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4">
        {projects.map((project) => (
          <div
            key={project.href}
            className="rounded-sm border border-gray-200 p-4"
          >
            <a
              href={project.href}
              className="mb-2 block text-sm font-medium text-link hover:underline"
            >
              {project.name}
            </a>
            <p className="text-sm text-text-primary">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

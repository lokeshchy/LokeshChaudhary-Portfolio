import type { Skill } from '@/types'

interface SkillsGridProps {
  skills: Skill[]
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const groupedByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="max-w-content w-full mx-auto px-4 py-12">
      {Object.entries(groupedByCategory).map(([category, categorySkills]) => (
        <div key={category} className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6">{category}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-background border border-border rounded-card p-4 text-center shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1"
              >
                {skill.icon && (
                  <div className="text-3xl mb-2">{skill.icon}</div>
                )}
                <p className="text-sm font-medium text-foreground">
                  {skill.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

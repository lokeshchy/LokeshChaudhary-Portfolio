'use client'

import { format } from 'date-fns'
import type { Experience } from '@/types'

interface ExperienceTimelineProps {
  experiences: Experience[]
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="max-w-content w-full mx-auto px-4 py-12">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-12">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative pl-20">
              {/* Timeline dot */}
              <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-soft" />

              <div className="bg-background border border-border rounded-card p-6 shadow-soft hover:shadow-soft-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {exp.role}
                    </h3>
                    <p className="text-lg text-muted mb-2">
                      {exp.organization}
                      {exp.location && (
                        <span className="text-muted"> • {exp.location}</span>
                      )}
                    </p>
                    <span className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                      {exp.type}
                    </span>
                  </div>
                  <div className="text-muted text-sm mt-2 md:mt-0">
                    {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                    {exp.endDate
                      ? format(new Date(exp.endDate), 'MMM yyyy')
                      : 'Present'}
                  </div>
                </div>

                {exp.description && exp.description.length > 0 && (
                  <ul className="list-disc list-inside space-y-2 text-muted">
                    {exp.description.map((point, pointIdx) => (
                      <li key={pointIdx}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

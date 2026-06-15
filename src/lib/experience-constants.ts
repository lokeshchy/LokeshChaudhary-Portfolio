/** Experience entry types shown in CMS dropdowns. */
export const EXPERIENCE_TYPES = ['Work', 'Research', 'Internship', 'Volunteer'] as const;

/** Work mode options — extend this list to add new modes in the CMS. */
export const WORK_MODES = ['Onsite', 'Hybrid', 'Remote'] as const;

export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];
export type WorkMode = (typeof WORK_MODES)[number];

export function parseWorkMode(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  const mode = String(value).trim();
  return mode || null;
}

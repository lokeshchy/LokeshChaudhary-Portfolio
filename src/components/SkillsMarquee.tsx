import type { CSSProperties } from 'react';
import type { SkillItem } from '@/lib/data';
import { HomeSkillIcon } from '@/lib/skill-icons';

function SkillChip({ skill, hidden, compact }: { skill: SkillItem; hidden?: boolean; compact?: boolean }) {
  return (
    <div
      className={`skill-chip shrink-0 ${compact ? 'text-[0.7rem] py-[0.2rem] px-[0.55rem]' : ''}`}
      aria-hidden={hidden || undefined}
    >
      <span className={`flex items-center justify-center shrink-0 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}>
        <HomeSkillIcon name={skill.name} icon={skill.icon} />
      </span>
      <span>{skill.name}</span>
    </div>
  );
}

export function SkillsMarquee({
  skills,
  ariaLabel = 'Skills',
  reverse = false,
  compact = false,
}: {
  skills: SkillItem[];
  ariaLabel?: string;
  reverse?: boolean;
  compact?: boolean;
}) {
  const items = [...skills].sort((a, b) => a.order - b.order);
  if (!items.length) return null;

  const duration = Math.max(28, items.length * 5);

  return (
    <div className="skills-marquee" aria-label={ariaLabel}>
      <div
        className={`skills-marquee-track ${reverse ? 'skills-marquee-track-reverse' : ''}`}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        {items.map((s) => (
          <SkillChip key={s.id} skill={s} compact={compact} />
        ))}
        {items.map((s) => (
          <SkillChip key={`dup-${s.id}`} skill={s} hidden compact={compact} />
        ))}
      </div>
    </div>
  );
}

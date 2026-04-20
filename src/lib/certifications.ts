import type { CertificationItem } from '@/types';

export function normalizeCertifications(raw: unknown): CertificationItem[] {
  if (raw == null) return [];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed as CertificationItem[];
    } catch {
      return raw.trim() ? [raw.trim()] : [];
    }
    return [];
  }
  if (!Array.isArray(raw)) return [];
  return raw as CertificationItem[];
}

export function certificationsToAdminText(items: CertificationItem[]): string {
  if (!items.length) return '';
  if (items.every((x) => typeof x === 'string')) {
    return (items as string[]).join('\n');
  }
  return JSON.stringify(items, null, 2);
}

export function parseCertificationsAdminText(text: string): CertificationItem[] {
  const t = text.trim();
  if (!t) return [];
  if (t.startsWith('[')) {
    const parsed = JSON.parse(t) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error('Certifications must be a JSON array');
    }
    return parsed as CertificationItem[];
  }
  return t.split('\n').filter(Boolean);
}

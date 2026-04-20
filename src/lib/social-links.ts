/** Build href for footer / contact from settings socialLinks entries. */
export function socialLinkHref(key: string, value: string): string {
  const v = value.trim();
  if (!v) return '#';
  if (key === 'email') return v.startsWith('mailto:') ? v : `mailto:${v}`;
  if (key === 'phone' || key === 'tel') {
    if (v.startsWith('tel:')) return v;
    const digits = v.replace(/[^\d+]/g, '');
    return `tel:${digits}`;
  }
  return v;
}

export function socialLinkLabel(key: string): string {
  const map: Record<string, string> = {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    email: 'Email',
    phone: 'Phone',
    tel: 'Phone',
  };
  return map[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

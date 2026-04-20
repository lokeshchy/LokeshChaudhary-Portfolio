import { redirect } from 'next/navigation';

/** Singular URL typo / old link → plural route (then About). */
export default function CertificationAliasPage() {
  redirect('/certifications');
}

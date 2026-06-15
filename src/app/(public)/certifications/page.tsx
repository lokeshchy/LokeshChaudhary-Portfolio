import { redirect } from 'next/navigation';

/** Legacy route — certifications live on the Resume (About) page. */
export default function CertificationsPage() {
  redirect('/about#certifications');
}

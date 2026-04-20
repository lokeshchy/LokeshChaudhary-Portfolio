import { CertificationList } from '@/components/CertificationList';
import { getPageBySlug } from '@/lib/data';
import { normalizeCertifications } from '@/lib/certifications';

export const metadata = {
  title: 'Certifications',
  description: 'Certificates and professional development',
};

export const dynamic = 'force-dynamic';

/** Same certification entries and images as on About (single CMS source: About page). */
export default async function CertificationsPage() {
  const page = await getPageBySlug('about');
  const content = page?.content as Record<string, unknown> | undefined;
  const certifications = normalizeCertifications(content?.certifications);

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Certifications</h1>

      {certifications.length > 0 ? (
        <CertificationList items={certifications} />
      ) : (
        <p className="text-muted">No certifications yet.</p>
      )}

    </div>
  );
}

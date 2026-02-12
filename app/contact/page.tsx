import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/settings'

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-content w-full mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Contact
          </h1>
          <p className="text-lg text-muted mb-12">
            Get in touch with me.
          </p>

          <div className="bg-background border border-border rounded-card p-8 shadow-soft max-w-2xl">
            <div className="space-y-6">
              {settings.socialLinks.email && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Email
                  </h3>
                  <a
                    href={`mailto:${settings.socialLinks.email}`}
                    className="text-primary hover:underline"
                  >
                    {settings.socialLinks.email}
                  </a>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Social Links
                </h3>
                <div className="flex flex-wrap gap-4">
                  {settings.socialLinks.github && (
                    <a
                      href={settings.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {settings.socialLinks.linkedin && (
                    <a
                      href={settings.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  {settings.socialLinks.twitter && (
                    <a
                      href={settings.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

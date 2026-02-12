import { getSettings } from '@/lib/settings'

export default async function Footer() {
  const settings = await getSettings()

  return (
    <footer className="bg-muted/10 border-t border-border mt-20">
      <div className="max-w-content w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted text-sm mb-4 md:mb-0">
            {settings.footerText}
          </p>
          <div className="flex items-center space-x-6">
            {settings.socialLinks.github && (
              <a
                href={settings.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            )}
            {settings.socialLinks.linkedin && (
              <a
                href={settings.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            )}
            {settings.socialLinks.twitter && (
              <a
                href={settings.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-foreground transition-colors"
              >
                Twitter
              </a>
            )}
            {settings.socialLinks.email && (
              <a
                href={`mailto:${settings.socialLinks.email}`}
                className="text-muted hover:text-foreground transition-colors"
              >
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

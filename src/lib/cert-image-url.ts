function isGoogleDriveFileUrl(u: string): boolean {
  return /drive\.google\.com\/file\/d\//.test(u) || /drive\.google\.com\/open\?[^#]*id=/.test(u);
}

/**
 * For opening the original share link in a new tab (unchanged HTTPS).
 */
export function certificationImageDisplayUrl(url: string | undefined | null): string | undefined {
  if (!url?.trim()) return undefined;
  return url.trim();
}

/**
 * Value for <img src>. Google Drive share URLs are proxied so images load reliably
 * when the file is set to &quot;Anyone with the link&quot;.
 */
export function certificationImageImgSrc(url: string | undefined | null): string | undefined {
  if (!url?.trim()) return undefined;
  const u = url.trim();
  if (isGoogleDriveFileUrl(u)) {
    return `/api/cert-image?url=${encodeURIComponent(u)}`;
  }
  return u;
}

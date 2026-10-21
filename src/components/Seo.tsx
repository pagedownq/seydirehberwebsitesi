import { Helmet } from 'react-helmet-async';

// Sitenin kanonik adresi: seydirehber.com.tr → www.seydirehber.com.tr'ye yönleniyor.
export const SITE_URL = 'https://www.seydirehber.com.tr';
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

type SeoProps = {
  title: string;
  description?: string;
  /** Kanonik yol, ör. "/about". Verilmezse kanonik etiket eklenmez. */
  path?: string;
  /** Admin/esnaf panelleri ve 404 arama motorlarında görünmesin. */
  noindex?: boolean;
  /** application/ld+json olarak eklenecek yapılandırılmış veri. */
  jsonLd?: object[];
};

/**
 * Sayfa başına başlık, açıklama, kanonik adres, robots ve yapılandırılmış veri.
 * Paylaşım (Open Graph / Twitter) etiketleri index.html'de statik; önizleme botları JavaScript çalıştırmaz.
 */
export function Seo({ title, description, path, noindex = false, jsonLd = [] }: SeoProps) {
  const url = path != null ? `${SITE_URL}${path}` : undefined;
  return (
    <Helmet>
      <html lang="tr" />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      {url && <link rel="canonical" href={url} />}

      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

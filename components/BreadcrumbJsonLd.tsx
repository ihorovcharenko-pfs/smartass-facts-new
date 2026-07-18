// Server-renderable BreadcrumbList structured data (schema.org). Mirrors the
// visible breadcrumb trail so Google can show breadcrumbs in search results.
// The last item is the current page and carries no URL, per Google's docs.

type Crumb = { name: string; url?: string }

export default function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.url && { item: c.url }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      // <-escape so fact text containing "<" can't break out of the tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}

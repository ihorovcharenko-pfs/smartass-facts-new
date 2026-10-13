// Server-rendered FAQPage + Article structured data for a single fact page.
// States the verdict explicitly so AI crawlers and search engines can quote it.

type Props = {
  url: string
  statement: string
  explanation: string | null
  isReal: boolean | null
}

export default function FactJsonLd({ url, statement, explanation, isReal }: Props) {
  if (isReal === null) return null

  const verdict = isReal ? 'True' : 'Fake'
  const answer =
    `${verdict}. ` +
    (isReal ? 'This is a verified fact. ' : 'This claim is fake. ') +
    (explanation ? explanation : '')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Is it true that ${statement}`,
            acceptedAnswer: { '@type': 'Answer', text: answer.trim() },
          },
        ],
      },
      {
        '@type': 'Article',
        headline: statement.slice(0, 110),
        url,
        mainEntityOfPage: url,
        author: { '@type': 'Person', name: 'Gigi Smarts', url: 'https://smartassfacts.com/about/gigi-smarts/' },
        publisher: { '@type': 'Organization', name: 'SmartAss Facts', url: 'https://smartassfacts.com' },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}

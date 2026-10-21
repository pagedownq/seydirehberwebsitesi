import type { PolicyDocument } from '../content/policies';
import { POLICY_UPDATED_AT } from '../content/policies';

interface PolicyArticleProps {
  doc: PolicyDocument;
  /** Tek sayfada birden çok metin varken başlık seviyesi (Politikalar sayfasında h2). */
  headingLevel?: 1 | 2;
}

// content/policies.ts içindeki metni düz, okunur bir makale olarak çizer.
const PolicyArticle = ({ doc, headingLevel = 1 }: PolicyArticleProps) => {
  const Title = headingLevel === 1 ? 'h1' : 'h2';
  const Heading = headingLevel === 1 ? 'h2' : 'h3';

  return (
    <article id={doc.id} className="scroll-mt-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
      <header className="mb-8 pb-6 border-b border-slate-100">
        <Title className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{doc.title}</Title>
        <p className="mt-2 text-slate-500">{doc.summary}</p>
        <p className="mt-3 text-sm font-semibold text-emerald-700">Son güncelleme: {POLICY_UPDATED_AT}</p>
      </header>

      <div className="space-y-4 text-slate-700 leading-relaxed">
        {doc.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div className="mt-8 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <Heading className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{section.heading}</Heading>
            <div className="space-y-3 text-slate-700 leading-relaxed">
              {section.paragraphs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 pl-5 list-disc marker:text-emerald-500">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {section.after?.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
};

export default PolicyArticle;

import { DEFAULT_WIKI_ENTRIES } from '@/lib/wikiData';
import WikiEntryClient from './WikiEntryClient';

export function generateStaticParams() {
  return DEFAULT_WIKI_ENTRIES.map((entry) => ({
    slug: entry.slug,
  }));
}

export const dynamicParams = false;

export default async function WikiEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WikiEntryClient slug={slug} />;
}

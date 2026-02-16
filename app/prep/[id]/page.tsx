import ClientPrepPage from './ClientPrepPage';

export function generateStaticParams() {
  return [
    { id: 'prep-abc123' },
    { id: 'prep-def456' },
    { id: 'prep-ghi789' },
  ];
}

export default function Page() {
  return <ClientPrepPage />;
}

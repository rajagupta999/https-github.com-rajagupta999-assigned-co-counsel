import ClientPortal from './ClientPortal';

export function generateStaticParams() {
  return [
    { id: 'client-martinez' },
    { id: 'client-chen' },
    { id: 'client-davis' },
    { id: 'demo' },
  ];
}

export default function Page() {
  return <ClientPortal />;
}

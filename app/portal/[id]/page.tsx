import PortalContent from './PortalContent';

export async function generateStaticParams() {
  return [
    { id: 'client-martinez' },
    { id: 'client-chen' },
    { id: 'client-davis' },
  ];
}

export default function ClientPortalPage({ params }: { params: { id: string } }) {
  return <PortalContent params={params} />;
}

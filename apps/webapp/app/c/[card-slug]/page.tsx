import { notFound } from "next/navigation";
import { CardView } from "@/components/card-view";
import { getPublicCard } from "@/lib/template-store";

export default async function PublicCardPage({ params }: { params: Promise<{ "card-slug": string }> }) {
  const { "card-slug": slug } = await params;
  const card = await getPublicCard(slug);

  if (!card) notFound();

  return <CardView card={card} />;
}

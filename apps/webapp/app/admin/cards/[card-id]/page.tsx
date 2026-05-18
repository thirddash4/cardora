import { notFound } from "next/navigation";
import { CardEditor } from "@/components/card-editor";
import { getCardById } from "@/lib/template-store";

export default async function CardEditPage({ params }: { params: Promise<{ "card-id": string }> }) {
  const { "card-id": id } = await params;
  const card = await getCardById(id);

  if (!card) notFound();

  return <CardEditor initialCard={card} hasDatabase={Boolean(process.env.DATABASE_URL)} />;
}

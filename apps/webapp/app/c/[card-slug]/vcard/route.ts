import { NextResponse, type NextRequest } from "next/server";
import { getPublicCard } from "@/lib/template-store";
import { buildVCard, vcardFileName } from "@/lib/vcard";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ "card-slug": string }> },
) {
  const { "card-slug": slug } = await params;
  const card = await getPublicCard(slug);

  if (!card) {
    return new NextResponse("Not found", { status: 404 });
  }

  const origin = request.nextUrl.origin;
  const body = buildVCard(card, origin);
  const filename = vcardFileName(card);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

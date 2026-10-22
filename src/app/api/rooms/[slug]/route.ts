import { useCases } from "@/infrastructure/container";
import { respond } from "@/infrastructure/http/route";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const locale = new URL(request.url).searchParams.get("locale") ?? "";
  return respond(() => useCases.getRoom(params.slug, locale));
}

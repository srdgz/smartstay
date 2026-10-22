import { useCases } from "@/infrastructure/container";
import { respond } from "@/infrastructure/http/route";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  return respond(() => useCases.getRoomReviews(params.id));
}

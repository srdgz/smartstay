import { useCases } from "@/infrastructure/container";
import { requireUserId } from "@/infrastructure/auth/session";
import { respond } from "@/infrastructure/http/route";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale") ?? "";
  return respond(async () => useCases.getUserBookings(await requireUserId(), locale));
}

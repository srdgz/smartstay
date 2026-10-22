import { useCases } from "@/infrastructure/container";
import { requireUserId } from "@/infrastructure/auth/session";
import { respond } from "@/infrastructure/http/route";

export const dynamic = "force-dynamic";

export async function GET() {
  return respond(async () => useCases.getUser(await requireUserId()));
}

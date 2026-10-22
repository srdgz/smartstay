import { useCases } from "@/infrastructure/container";
import { respond } from "@/infrastructure/http/route";

export const dynamic = "force-dynamic";

export async function GET() {
  return respond(() => useCases.getRooms());
}

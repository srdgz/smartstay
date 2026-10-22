import { useCases } from "@/infrastructure/container";
import { respond } from "@/infrastructure/http/route";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  return respond(() =>
    useCases.getRooms(params.get("locale") ?? "", {
      checkinDate: params.get("checkin") ?? undefined,
      checkoutDate: params.get("checkout") ?? undefined,
    })
  );
}

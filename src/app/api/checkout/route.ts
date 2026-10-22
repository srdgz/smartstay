import { useCases } from "@/infrastructure/container";
import { requireUserId } from "@/infrastructure/auth/session";
import { readJson, respond } from "@/infrastructure/http/route";

export async function POST(request: Request) {
  return respond(async () => {
    const userId = await requireUserId();
    const body = await readJson(request);
    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    const { sessionId } = await useCases.startCheckout({
      userId,
      roomSlug: String(body.roomSlug ?? ""),
      checkinDate: String(body.checkinDate ?? ""),
      checkoutDate: String(body.checkoutDate ?? ""),
      adults: Number(body.adults),
      children: Number(body.children ?? 0),
      origin,
    });

    return { id: sessionId };
  });
}

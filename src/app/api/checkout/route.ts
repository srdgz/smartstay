import { toContentLocale } from "@/domain/locale";
import { useCases } from "@/infrastructure/container";
import { requireUserId } from "@/infrastructure/auth/session";
import { readJson, respond } from "@/infrastructure/http/route";

export async function POST(request: Request) {
  return respond(async () => {
    const userId = await requireUserId();
    const body = await readJson(request);
    const locale = toContentLocale(body.locale);
    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    const { sessionId, url } = await useCases.startCheckout({
      userId,
      roomSlug: String(body.roomSlug ?? ""),
      checkinDate: String(body.checkinDate ?? ""),
      checkoutDate: String(body.checkoutDate ?? ""),
      adults: Number(body.adults),
      children: Number(body.children ?? 0),
      currency: String(body.currency ?? ""),
      locale,
      successUrl: `${origin}/${locale}/users/${userId}`,
    });

    return { id: sessionId, url };
  });
}

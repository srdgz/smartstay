import { useCases } from "@/infrastructure/container";
import { requireUserId } from "@/infrastructure/auth/session";
import { readJson, respond } from "@/infrastructure/http/route";

export async function POST(request: Request) {
  return respond(async () => {
    const userId = await requireUserId();
    const body = await readJson(request);

    return useCases.submitReview({
      userId,
      roomId: String(body.roomId ?? ""),
      rating: Number(body.rating),
      text: String(body.text ?? ""),
    });
  });
}

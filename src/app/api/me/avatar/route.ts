import { ValidationError } from "@/domain/errors";
import { assertAvatarSize } from "@/domain/user/avatar";
import { requireUserId } from "@/infrastructure/auth/session";
import { useCases } from "@/infrastructure/container";
import { respond } from "@/infrastructure/http/route";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  return respond(async () => {
    const userId = await requireUserId();

    const form = await request.formData().catch(() => null);
    const file = form?.get("avatar");
    if (!(file instanceof File)) {
      throw new ValidationError("Please choose an image.", "avatarRequired");
    }

    assertAvatarSize(file.size);
    const bytes = new Uint8Array(await file.arrayBuffer());

    return useCases.uploadAvatar({ userId, bytes });
  });
}

export async function DELETE() {
  return respond(async () => useCases.removeAvatar(await requireUserId()));
}

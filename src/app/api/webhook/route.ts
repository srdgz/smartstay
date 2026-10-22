import { useCases } from "@/infrastructure/container";
import { respond } from "@/infrastructure/http/route";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  return respond(async () => {
    const result = await useCases.completeBooking(payload, signature);
    return result.handled ? "Booking successful" : "Event received";
  });
}

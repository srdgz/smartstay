import { getRoomReviews } from "@/libs/apis";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const roomId = params.id;
  try {
    const rommReviews = await getRoomReviews(roomId);
    return NextResponse.json(rommReviews, {
      status: 200,
      statusText: "Succesful",
    });
  } catch (error: any) {
    console.log("Getting review failed", error);
    return new NextResponse("Unable to fetch", { status: 400 });
  }
}

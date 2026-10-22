import {
  checkReviewExists,
  createReview,
  getUserData,
  updateReview,
} from "@/libs/apis";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("You must be logged in.", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const data = await getUserData(userId);
    return NextResponse.json(data, { status: 200, statusText: "Succesful" });
  } catch (error) {
    return new NextResponse("We could not load your profile.", { status: 500 });
  }
}

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("You must be logged in.", { status: 401 });
  }
  const { roomId, reviewText, ratingValue } = await req.json();
  if (!roomId || !reviewText || !ratingValue) {
    return new NextResponse("Please provide a rating and a review text.", {
      status: 400,
    });
  }
  const userId = session.user.id;

  try {
    const alreadyExists = await checkReviewExists(userId, roomId);
    let data;
    if (alreadyExists) {
      data = await updateReview({
        reviewId: alreadyExists._id,
        reviewText,
        userRating: ratingValue,
      });
    } else {
      data = await createReview({
        hotelRoomId: roomId,
        reviewText,
        userId,
        userRating: ratingValue,
      });
    }
    return NextResponse.json(data, { status: 200, statusText: "OK" });
  } catch (error: any) {
    console.log("Error updating", error);
    return new NextResponse("We could not save your review. Please try again.", {
      status: 500,
    });
  }
}

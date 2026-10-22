import { getServerSession } from "next-auth";

import { UnauthorizedError } from "@/domain/errors";

import { authOptions } from "./authOptions";

export const requireUserId = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) throw new UnauthorizedError("You must be logged in.");
  return userId;
};

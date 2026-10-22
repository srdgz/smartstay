import { NotFoundError } from "@/domain/errors";
import type { UserRepository } from "@/domain/user/UserRepository";

export const makeGetUser =
  ({ users }: { users: UserRepository }) =>
  async (userId: string) => {
    const user = await users.findById(userId);
    if (!user) throw new NotFoundError("We could not find your profile.", "userNotFound");
    return user;
  };

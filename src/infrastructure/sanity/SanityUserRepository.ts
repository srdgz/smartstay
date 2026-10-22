import type { SanityClient } from "next-sanity";

import type { User } from "@/domain/user/User";
import type { UserRepository } from "@/domain/user/UserRepository";

import { toUser, type SanityUserDoc } from "./mappers";
import { userByIdQuery } from "./queries";

export class SanityUserRepository implements UserRepository {
  constructor(private readonly client: SanityClient) {}

  async findById(userId: string): Promise<User | null> {
    const doc = await this.client.fetch<SanityUserDoc | null>(
      userByIdQuery,
      { userId },
      { cache: "no-cache" }
    );
    return doc ? toUser(doc) : null;
  }
}

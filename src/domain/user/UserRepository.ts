import type { User } from "./User";

export interface UserRepository {
  findById(userId: string): Promise<User | null>;
  updateImage(userId: string, imageUrl: string | null): Promise<void>;
}

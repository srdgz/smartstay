import type { ContentLocale } from "../locale";
import type { Room } from "./Room";

export interface RoomRepository {
  findFeatured(locale: ContentLocale): Promise<Room | null>;
  findAll(locale: ContentLocale): Promise<Room[]>;
  findBySlug(slug: string, locale: ContentLocale): Promise<Room | null>;
}

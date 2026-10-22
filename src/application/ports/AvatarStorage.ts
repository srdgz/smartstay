import type { AvatarType } from "@/domain/user/avatar";

export type AvatarUpload = {
  bytes: Uint8Array;
  contentType: AvatarType;
  filename: string;
};

export interface AvatarStorage {
  upload(upload: AvatarUpload): Promise<{ url: string }>;
}

import { signUpHandler } from "next-auth-sanity";
import type { SanityClient } from "next-sanity";

import { sanityClient } from "@/infrastructure/sanity/client";

export const POST = signUpHandler(sanityClient as SanityClient);

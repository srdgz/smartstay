import { signUpHandler } from "next-auth-sanity";
import sanityClient from "@/libs/sanity";
import { SanityClient } from "@sanity/client";

const castToSanityClient = (client: any): SanityClient => client;

const sanitizedClient = castToSanityClient(sanityClient);

export const POST = signUpHandler(sanitizedClient);

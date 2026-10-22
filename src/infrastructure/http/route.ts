import { NextResponse } from "next/server";

import { DomainError } from "@/domain/errors";

import { bodyFor, statusFor } from "./errorResponse";

export const respond = async (action: () => Promise<unknown>) => {
  try {
    return NextResponse.json(await action());
  } catch (error) {
    if (!(error instanceof DomainError)) console.error(error);
    return NextResponse.json(bodyFor(error), { status: statusFor(error) });
  }
};

export const readJson = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

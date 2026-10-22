import {
  ConflictError,
  DomainError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/domain/errors";

export const statusFor = (error: unknown) => {
  if (error instanceof ValidationError) return 400;
  if (error instanceof UnauthorizedError) return 401;
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ConflictError) return 409;
  return 500;
};

export const messageFor = (error: unknown) => {
  if (error instanceof DomainError) return error.message;
  return "Something went wrong. Please try again.";
};

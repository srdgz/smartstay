export type ErrorParams = Record<string, string | number>;

export class DomainError extends Error {
  constructor(
    message: string,
    readonly code: string = "generic",
    readonly params: ErrorParams = {}
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {}

export class UnauthorizedError extends DomainError {}

export class NotFoundError extends DomainError {}

export class ConflictError extends DomainError {}

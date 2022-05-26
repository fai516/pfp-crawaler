import { CustomError } from "ts-custom-error";

// Reserve for any default http error
export class HttpError extends CustomError {
  constructor(message?: string) {
    super(message);
  }
}

// Any invalidation from static check
export class ValidationError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}

// Any unsupported chain id error goes here.
export class UnsupportedError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}

// Any mongodb-related error
export class MongodbError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}

export class UnauthorizedError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}

export class AuthenticationError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}

export class JwtExpiredError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}

export class RecaptchaError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}

// Any ineligible to vote from an address
export class IneligibleError extends CustomError {
  public constructor(message?: string) {
    super(message);
  }
}

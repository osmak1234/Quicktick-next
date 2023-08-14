export enum ErrorType {
  UnknownError = "UnknownError",
  BadRequest = "BadRequest",
  Unauthorized = "Unauthorized",
  Forbidden = "Forbidden",
  NotFound = "NotFound",
  InternalServerError = "InternalServerError",
}

class APIError extends Error {
  constructor(public type: ErrorType, public message: string = "") {
    super(message);
    this.name = "APIError";
  }
}

export async function handle_error(response: Response) {
  if (!response.ok) {
    const responseBody = await response.text();

    switch (response.status) {
      case 400:
        throw new APIError(ErrorType.BadRequest, responseBody);
      case 401:
        throw new APIError(ErrorType.Unauthorized, responseBody);
      case 403:
        throw new APIError(ErrorType.Forbidden, responseBody);
      case 404:
        throw new APIError(ErrorType.NotFound, responseBody);
      case 500:
        throw new APIError(ErrorType.InternalServerError, responseBody);
      default:
        throw new APIError(ErrorType.UnknownError, responseBody);
    }
  }
}

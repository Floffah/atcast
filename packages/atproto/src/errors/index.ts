export enum APIError {
    InvalidHandle = "InvalidHandle",
}

export const APIErrorMessages: Record<APIError, string> = {
    [APIError.InvalidHandle]: "Invalid handle",
};

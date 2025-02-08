interface RetryOptions {
    retries: number;
    allowError: (error: Error) => boolean;
    signal?: AbortSignal;
}

export async function retry<Response>(
    fn: () => Response | Promise<Response>,
    options: RetryOptions,
): Promise<Response> {
    let retries = options.retries;
    let lastError: Error | undefined = undefined;

    while (retries > 0) {
        if (options.signal?.aborted) {
            throw new Error("Aborted");
        }

        try {
            return await fn();
        } catch (error: any) {
            if (!options.allowError(error)) {
                throw error;
            }
            lastError = error;
            retries--;
        }
    }

    throw lastError;
}

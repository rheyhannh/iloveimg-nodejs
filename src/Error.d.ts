import { AxiosError } from 'axios';

/**
 * Represents an error caused by an `ILoveApi` response with a status code `>= 400`.
 * @class ILoveApiError
 * @extends AxiosError
 */
export class ILoveApiError extends AxiosError {
	status: number;

	/**
	 * Creates an instance of `ILoveApiError`.
	 * @param message - Error message.
	 * @param status - HTTP status code of the response.
	 * @param error - Error thrown by Axios.
	 */
	constructor(message: string, status: number, error: AxiosError);
}

/**
 * Represents a network-related error, such as timeouts or DNS failures.
 * @class NetworkError
 * @extends AxiosError
 */
export class NetworkError extends AxiosError {
	/**
	 * Creates an instance of `NetworkError`.
	 * @param message - Error message.
	 * @param error - Error thrown by Axios.
	 */
	constructor(message: string, error: AxiosError);
}

/**
 * Classifies an error into either `ILoveApiError`, `NetworkError`, or a generic `Error`.
 *
 * - If the error originates from an API response (status `>= 400`), it is classified as `ILoveApiError`.
 * - If the error occurs due to network-related issues (e.g., timeout, no response), it is classified as `NetworkError`.
 * - Otherwise, the original error is rethrown.
 *
 * @param error - The error object to classify.
 * @throws `ILoveApiError` | `NetworkError` | `Error` - The classified error.
 */
export function classifyError(error: AxiosError | Error): void;

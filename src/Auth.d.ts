import { AxiosInstance } from 'axios';
import { SelfSignedTokenOptionsInfered } from './schema/Auth';

/**
 * The `Auth` class manages authentication with the `ILoveApi` server, providing methods
 * to issue, verify, and refresh JWT authentication tokens. It supports both server-issued
 * tokens and locally generated self-signed tokens when a secret key is provided.
 *
 * @class Auth
 * @see https://github.com/rheyhannh/iloveimg-nodejs
 * @example
 * ```js
 * import { Auth } from '@rheyhannh/iloveimg-nodejs';
 * const auth = new Auth('publicKey', 'secretKey');
 *
 * const token = await auth.getToken(); // JWT
 * const payload = auth.verifyToken(); // JWT Payload
 *
 * // Use the token when making requests to the `ILoveApi` server.
 * // Include it in the `Authorization` header with the 'Bearer' prefix.
 * ```
 */
declare class Auth {
	private static readonly TIME_DELAY: number;
	private token?: string;
	private readonly #publicKey: string;
	private readonly #secretKey?: string;
	private #axiosInstance: AxiosInstance;
	private #tokenOptions: SelfSignedTokenOptionsInfered;

	/**
	 * Creates an instance that issuing, verify and refresh the JWT used to `ILoveApi` server.
	 * @param publicKey Projects public key used for authentication, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param secretKey Projects secret key used for local token generation, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param params Additional parameters.
	 * @throws `Error` If publicKey is not provided or invalid.
	 * @example
	 * ```js
	 * import { Auth } from '@rheyhannh/iloveimg-nodejs';
	 *
	 * const auth = new Auth('publicKey', 'secretKey');
	 *
	 * const token = await auth.getToken(); // JWT
	 * const payload = auth.verifyToken(); // JWT Payload
	 *
	 * // You can make request to `ILoveApi` server using the token.
	 * // Make sure to add token to `Authorization` header with 'Bearer' prefix.
	 * ```
	 * @see {@link https://www.iloveapi.com/docs/api-reference#authentication ILoveApi Authentication Docs}
	 */
	constructor(
		publicKey: string,
		secretKey?: string,
		params?: Partial<SelfSignedTokenOptionsInfered>
	);

	/**
	 * Retrieves a valid authentication token, either from cache, local generation, or from `ILoveApi` server.
	 * When `secretKey` provided it will generate `self-signed` authentication token, otherwise authentication token will retrieved from `ILoveApi` server.
	 * @returns A promise resolving to a valid JWT token.
	 * @throws `ILoveApiError` | `NetworkError` | `Error` If authentication token cannot be retrieved.
	 * @see {@link https://www.iloveapi.com/docs/api-reference#authentication ILoveApi Authentication Docs}
	 */
	getToken(): Promise<string>;

	/**
	 * Verifies if the current (cached) token is valid and not expired.
	 * If invalid, it resets the current token.
	 * @returns The decoded JWT payload if exist and valid, otherwise undefined.
	 */
	verifyToken(): JWTPayloadProps | undefined;
}

export default Auth;

/**
 * Defines the properties of the self-signed JWT payload.
 */
export interface JWTPayloadProps {
	iss: string;
	iat: number;
	nbf: number;
	exp: number;
	jti: string;
	file_encryption_key?: string;
}

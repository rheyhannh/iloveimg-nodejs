import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import config from './config/global.js';
import { classifyError } from './Error.js';
import * as Schema from './schema/Auth.js';

const { ILOVEIMG_API_URL, ILOVEIMG_API_URL_PROTOCOL, ILOVEIMG_API_VERSION } =
	config;

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
class Auth {
	// There are times between responses that servers demands
	// a little delay or it does not accept
	static TIME_DELAY = 30;

	/**
	 * Authentication token used to `ILoveApi` server.
	 * @private Internal usage only.
	 */
	token = /** @type {string | undefined} */ (undefined);
	/**
	 * Projects public key.
	 * @private Internal usage only.
	 */
	#publicKey;
	/**
	 * Projects secret key.
	 * @private Internal usage only.
	 */
	#secretKey;
	/**
	 * `AxiosInstance` to make requests to the server.
	 * @private Internal usage only.
	 */
	#axiosInstance;
	/**
	 * Self signed token options.
	 * @private Internal usage only.
	 */
	#tokenOptions;

	/**
	 * Creates an instance that issuing, verify and refresh the JWT used to `ILoveApi` server.
	 *
	 * @constructor
	 * @param {string} publicKey Projects public key used for authentication, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param {string} [secretKey=''] Projects secret key used for local token generation, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param {Schema.SelfSignedTokenOptionsInfered} [params={}] Additional parameters.
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
	constructor(publicKey, secretKey = '', params = {}) {
		if (!publicKey || typeof publicKey !== 'string') {
			throw new Error('publicKey is required and must be a string.');
		}
		if (secretKey && typeof secretKey !== 'string') {
			throw new Error('secretKey must be a string.');
		}
		this.#axiosInstance = axios.create({
			baseURL: `${ILOVEIMG_API_URL_PROTOCOL}://${ILOVEIMG_API_URL}/${ILOVEIMG_API_VERSION}`,
			headers: { 'Content-Type': 'application/json;charset=UTF-8' }
		});
		this.#publicKey = publicKey;
		this.#secretKey = secretKey;
		this.#tokenOptions = Schema.SelfSignedTokenOptions.parse(params);
	}

	/**
	 * Retrieves a valid authentication token, either from cache, local generation, or from `ILoveApi` server.
	 * When `secretKey` provided it will generate `self-signed` authentication token, otherwise authentication token will retrieved from `ILoveApi` server.
	 * @returns {Promise<string>} A promise resolving to a valid JWT token.
	 * @throws {ILoveApiError | NetworkError | Error} If authentication token cannot be retrieved.
	 * @see {@link https://www.iloveapi.com/docs/api-reference#authentication ILoveApi Authentication Docs}
	 */
	async getToken() {
		this.verifyToken();
		// Use cached token if there is a valid token.
		if (this.token) {
			return this.token;
		}

		// If there are secret key, token can be generated locally
		let tokenPromise = this.#secretKey
			? this.#getTokenLocally()
			: this.#getTokenFromServer();

		// Cache token.
		this.token = await tokenPromise;
		return this.token;
	}

	/**
	 * Verifies if the current (cached) token is valid and not expired.
	 * If invalid, it resets the current token.
	 * @returns {JWTPayloadProps | undefined} The decoded JWT payload if exist and valid, otherwise undefined.
	 */
	verifyToken() {
		if (this.token) {
			try {
				const decoded = jsonwebtoken.decode(this.token);
				// When there is secret key, signature and expiration date can be validated.
				if (this.#secretKey) {
					jsonwebtoken.verify(this.token, this.#secretKey);
				}
				// Otherwise, only expiration date can be validated.
				else {
					// Use seconds as unit instead of milliseconds
					const timeNow = Math.floor(Date.now() / 1000);
					const isExpired = timeNow > Number(decoded.exp);

					// Reset cached token on expired.
					if (isExpired) throw new Error('Token is expired.');
				}

				return decoded;
			} catch {
				// Reset cached token when caught an error while verifying.
				this.token = undefined;
				return this.token;
			}
		}

		return this.token;
	}

	/**
	 * Requests authentication token from `ILoveApi` server.
	 * @returns {Promise<string>} Authentication token received from `ILoveApi` server.
	 * @throws {ILoveApiError | NetworkError | Error} If authentication token cannot be retrieved.
	 * @see {@link https://www.iloveapi.com/docs/api-reference#authentication ILoveApi Authentication Docs on Request signed token from our authentication server}
	 */
	async #getTokenFromServer() {
		try {
			const response = await this.#axiosInstance.post('/auth', {
				public_key: this.#publicKey
			});
			if (!response.data.token) {
				throw new Error('Auth token cannot be retrieved');
			}

			this.token = response.data.token;
			return this.token;
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * Generates `self-signed` authentication token locally using the secret key.
	 * @returns {Promise<string>} Self-signed authentication token.
	 * @see {@link https://www.iloveapi.com/docs/api-reference#authentication ILoveApi Authentication Docs on Self-signed token}
	 */
	async #getTokenLocally() {
		// Use seconds as unit instead of milliseconds
		const timeNow = Math.floor(Date.now() / 1000);

		const payload = /** @type {JWTPayloadProps} */ ({
			iss: this.#tokenOptions.iss,
			iat: timeNow - Auth.TIME_DELAY,
			nbf: timeNow - Auth.TIME_DELAY,
			exp: timeNow + this.#tokenOptions.age,
			jti: this.#publicKey,
			file_encryption_key: this.#tokenOptions.file_encryption_key
		});

		this.token = jsonwebtoken.sign(payload, this.#secretKey);
		return this.token;
	}

	/**
	 * @private Internal & testing usage only.
	 * @param {import('axios').AxiosInstance} x
	 */
	_setAxiosInstance(x) {
		this.#axiosInstance = x;
	}
}

export default Auth;

/**
 * @typedef {Object} JWTPayloadProps
 * @property {string} iss
 * Token issuer that can be your domain name or a subdomain.
 * - Default: `api.ilovepdf.com`
 * @property {number} iat
 * Unix timestamp in seconds describe the time when the token was issued.
 * Due error in `ILoveApi` server that does not accept recent generated tokens, iat time is
 * modified with the current time less a time delay.
 *
 * ```js
 * const TIME_DELAY = 30; // Delay in seconds
 * const timeNow = Math.floor(Date.now() / 1000);
 * const iat = timeNow - TIME_DELAY;
 * ```
 * @property {number} nbf
 * Unix timestamp in seconds describe the time when the token is not before.
 * Refering authentication token from  `ILoveApi` this match to `iat`.
 * @property {number} exp
 * Unix timestamp in seconds describe the time when the token will expire.
 * Refering authentication token from  `ILoveApi` this match to 1 hour after `iat`.
 * @property {string} jti
 * Identifier that match to iloveapi projects `publicKey`
 * @property {string} [file_encryption_key]
 */

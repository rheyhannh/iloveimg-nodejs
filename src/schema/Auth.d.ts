import { z } from 'zod';

export type SelfSignedTokenOptionsInfered = {
	/**
	 * Self-signed token issuer that can be your domain name or a subdomain.
	 * You may need to adjust this attribute when using self-signed token.
	 * - Default: `api.ilovepdf.com`
	 */
	iss?: string;
	/**
	 * Self-signed token age in seconds. The token will be valid for this duration.
	 * - Default: `3600` (1 hour)
	 */
	age?: number;
	/**
	 * If specified, this attribute will be assigned to self-signed token payload and all previously
	 * uploaded files for the task will be uploaded encrypted. The key will be used to decrypt the
	 * files before processing and re-encrypt them after processing. Only key sizes of
	 * `16`, `24` or `32` characters are supported.
	 */
	file_encryption_key?: string;
};

export declare const SelfSignedTokenOptions: z.ZodType<SelfSignedTokenOptionsInfered>;

import config from './config/global.js';
import Auth from './Auth.js';
import axios from 'axios';
import * as TaskSchema from './schema/Task.js';
import { classifyError } from './Error.js';

const { ILOVEIMG_API_URL_PROTOCOL, ILOVEIMG_API_VERSION } = config;

/**
 * The `Task` class is responsible for handling specific tasks on the `ILoveApi` server,
 * including downloading processed files and retrieving task details.
 *
 * @class Task
 * @see https://github.com/rheyhannh/iloveimg-nodejs
 * @example
 * ```js
 * import { Task } from '@rheyhannh/iloveimg-nodejs';
 *
 * const task = new Task('publicKey', 'secretKey', 'taskId', 'taskServer');
 *
 * // Downloading a Processed File for a Specific Task ID and Server
 * const result = await task.download(); // AxiosResponse
 *
 * // Retrieve Task Details for a Specific Task ID and Server
 * const details = await task.details();
 * ```
 *
 */
class Task {
	/**
	 * An instance of {@link Auth} that issuing, verify and refresh the authentication token used to `ILoveApi` server.
	 * @private Internal usage only.
	 */
	#auth;
	/**
	 * Task id.
	 * @private Internal usage only.
	 */
	#task_id;
	/**
	 * Axios instance that already configured for specific Task.
	 * This configuration add authentication token in `Authorization` header,
	 * opt-out `Content-Type` header and set `ILoveApi` specific subdomain for handling specific task.
	 * @private Internal usage only.
	 */
	#server = /** @type {import('axios').AxiosInstance} */ (undefined);

	/**
	 * Creates an instance that allows downloading a processed file or retrieving task details for a specific task ID and its assigned server.
	 *
	 * @constructor
	 * @param {string} publicKey Projects public key used for authentication, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param {string} [secretKey=''] Projects secret key used for local token generation, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param {string} taskId The unique task identifier.
	 * @param {string} taskServer The server assigned to the task.
	 * @param {import('./schema/Auth.js').SelfSignedTokenOptionsInfered} [params={}] Additional parameters.
	 * @throws {Error} If taskId or taskServer is missing or invalid.
	 */
	constructor(publicKey, secretKey = '', taskId, taskServer, params = {}) {
		if (
			!taskId ||
			!taskServer ||
			typeof taskId !== 'string' ||
			typeof taskServer !== 'string'
		) {
			throw new Error(
				'taskId and taskServer are required and should be string.'
			);
		}
		this.#auth = new Auth(publicKey, secretKey, params);
		this.#task_id = taskId;
		this.#server = axios.create({
			baseURL: `${ILOVEIMG_API_URL_PROTOCOL}://${taskServer}/${ILOVEIMG_API_VERSION}`,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			}
		});
	}

	/**
	 * Downloads processed files associated with this task.
	 * @param {TaskSchema.TaskDownloadGenericOptionsInfered} [options] Generic options for download.
	 * @returns {Promise<import('axios').AxiosResponse<Uint8Array, any>>} A promise resolving to an Axios response containing file data. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed, task id and server are not resolved.
	 * @throws {import('zod').ZodError} If required options are missing or use invalid options.
	 */
	async download(options = {}) {
		/**
		 * Generic options that already validated by zod.
		 */
		const _vOptions =
			await TaskSchema.TaskDownloadGenericOptions.parseAsync(options);
		const isDebug = !!_vOptions?.debug;

		try {
			const token = await this.#auth.getToken();
			this.#server.defaults.headers['Authorization'] = `Bearer ${token}`;
			const response = isDebug
				? await this.#server.get(`/download/${this.#task_id}?debug=true`)
				: await this.#server.get(`/download/${this.#task_id}`);

			if (isDebug) {
				return response.data;
			} else {
				return response;
			}
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * Retrieves details about this task.
	 * @param {TaskSchema.TaskDetailsGenericOptionsInfered} [options] Generic options for retrieving task details.
	 * @returns {Promise<TaskSchema.TaskDetailsReturnTypeInfered>} Task details. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed, task id and server are not resolved, no file to process.
	 * @throws {import('zod').ZodError} If required options are missing or use invalid options.
	 */
	async details(options = {}) {
		/**
		 * Generic options that already validated by zod.
		 */
		const _vOptions =
			await TaskSchema.TaskDetailsGenericOptions.parseAsync(options);
		const isDebug = !!_vOptions?.debug;

		try {
			const token = await this.#auth.getToken();
			this.#server.defaults.headers['Authorization'] = `Bearer ${token}`;
			const response = isDebug
				? await this.#server.get(`/task/${this.#task_id}?debug=true`)
				: await this.#server.get(`/task/${this.#task_id}`);

			return response.data;
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * @private Internal & testing usage only.
	 * @param {import('axios').AxiosInstance} x
	 */
	_setServer(x) {
		this.#server = x;
	}
}

export default Task;

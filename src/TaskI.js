import axios from 'axios';
import config from './config/global.js';
import * as TaskSchema from './schema/Task.js';
import * as _TaskUtils from './util/task.util.js';
import { classifyError } from './Error.js';

// We need to import with this behaviour to make sinon working in testing environment
const TaskUtils = _TaskUtils.default;
const { ILOVEIMG_API_URL_PROTOCOL, ILOVEIMG_API_VERSION } = config;

/**
 * The `TaskI` class represents a task initiated through `ILoveIMGApi`.
 * It simplifies the image processing workflow for a specific tool,
 * handling everything from task creation to file upload, processing, download, etc.
 *
 * @class TaskI
 */
class TaskI {
	/**
	 * Instance of JWT that used for maintaining authentication token used.
	 * @private Internal usage only.
	 */
	#auth;
	/**
	 * Axios instance that already configured for starting a Task.
	 * This configuration add authentication token in `Authorization` header,
	 * opt-out `Content-Type` header and set fixed `ILoveApi` domain for starting a task.
	 * @private Internal usage only.
	 */
	#fixed_server;
	/**
	 * Tool type for specific task.
	 * @private Internal usage only.
	 */
	#tool;
	/**
	 * Assigned task id from `ILoveApi`.
	 * @private Internal usage only.
	 */
	#task_id = /** @type {string} */ (undefined);
	/**
	 * The number of remaining files available for processing in your project.
	 * This represents the current limit on how many files you can process.
	 * @private Internal usage only.
	 */
	#remaining_files = /** @type {number} */ (undefined);
	/**
	 * Assigned (uploaded) image file. This is the file that will be processed.
	 * @private Internal usage only.
	 */
	#files =
		/** @type {TaskSchema.TaskProcessRequiredOptionsInfered['files']} */ (
			undefined
		);
	/**
	 * Axios instance that already configured for specific Task.
	 * This configuration add authentication token in `Authorization` header,
	 * opt-out `Content-Type` header and set `ILoveApi` specific subdomain for handling specific task.
	 * @private Internal usage only.
	 */
	#server = /** @type {import('axios').AxiosInstance} */ (undefined);

	/**
	 * Creates an instance of Task.
	 *
	 * @constructor
	 * @param {import('./Auth.js').default} auth Instance of `Auth` that used for maintaining authentication token used.
	 * @param {import('axios').AxiosInstance} fixedServer Axios instance that already configured for starting a Task.
	 * @param {import('./schema/Tool.js').ToolTypesInfered} taskType Task tool type.
	 */
	constructor(auth, fixedServer, taskType) {
		this.#auth = auth;
		this.#fixed_server = fixedServer;
		this.#tool = taskType;
	}

	/**
	 * Starts task by retrieving the assigned server and task id.
	 * @param {TaskSchema.TaskStartGenericOptionsInfered} [options] Generic options for starting a task.
	 * @returns {Promise<TaskSchema.TaskStartReturnTypeInfered>} Promise resolving an object containing assigned server, task id and project remaining files. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed.
	 * @throws {import('zod').ZodError} If any incorrect or invalid `options` type.
	 */
	async start(options = {}) {
		const validatedOptions =
			await TaskSchema.TaskStartGenericOptions.parseAsync(options);
		const isDebug = !!validatedOptions?.debug;

		try {
			const token = await this.#auth.getToken();
			this.#fixed_server.defaults.headers['Authorization'] = `Bearer ${token}`;
			const response = isDebug
				? await this.#fixed_server.get(`/start/${this.#tool}?debug=true`)
				: await this.#fixed_server.get(`/start/${this.#tool}`);

			if (!isDebug) {
				if (
					!response.data ||
					!response.data.server ||
					!response.data.task ||
					!response.data.remaining_files
				) {
					throw new Error('Invalid response: missing required fields');
				}

				this.#server = axios.create({
					baseURL: `${ILOVEIMG_API_URL_PROTOCOL}://${response.data.server}/${ILOVEIMG_API_VERSION}`,
					headers: {
						'Content-Type': 'application/json;charset=UTF-8',
						Authorization: `Bearer ${token}`
					}
				});
				this.#task_id = response.data.task;
				this.#remaining_files = response.data.remaining_files;
				this.#files = [];

				return {
					server: response.data.server,
					task_id: response.data.task,
					remaining_files: response.data.remaining_files
				};
			}

			return response.data;
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * Upload a image for this task.
	 * @param {TaskSchema.TaskAddFileGenericOptionsInfered} options Generic options for uploading image.
	 * @returns {Promise<string>} Promise resolving a server filename as a string. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed or task id and server are not resolved.
	 * @throws {import('zod').ZodError} If required options are missing or use invalid options.
	 */
	async addFile(options) {
		if (!this.#task_id || !this.#server) {
			throw new Error(
				'You need to retrieve task id and assigned server first using start() method.'
			);
		}

		/**
		 * Generic options that already validated by zod.
		 */
		const _vOptions =
			await TaskSchema.TaskAddFileGenericOptions.parseAsync(options);

		try {
			const response = await this.#server.post('/upload', {
				task: this.#task_id,
				..._vOptions
			});

			return response.data;
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * Delete a image previously that already uploaded on this task.
	 * @param {TaskSchema.TaskRemoveFileGenericOptionsInfered} options Generic options for delete uploaded image.
	 * @returns {Promise<void>} If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed or task id and server are not resolved.
	 * @throws {import('zod').ZodError} If required options are missing or use invalid options.
	 */
	async deleteFile(options) {
		if (!this.#task_id || !this.#server) {
			throw new Error(
				'You need to retrieve task id and assigned server first using start() method.'
			);
		}

		/**
		 * Generic options that already validated by zod.
		 */
		const _vOptions =
			await TaskSchema.TaskRemoveFileGenericOptions.parseAsync(options);
		const isDebug = !!_vOptions?.debug;

		try {
			const response = await this.#server.delete('/upload', {
				data: {
					task: this.#task_id,
					..._vOptions
				}
			});

			if (isDebug) return response.data;
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * Process this task.
	 * @param {TaskSchema.TaskProcessGenericOptionsInfered} [options] Generic options for processing task.
	 * @param {TaskSchema.TaskProcessWatermarkImageOptionsInfered | TaskSchema.TaskProcessConvertImageOptionsInfered | TaskSchema.TaskProcessUpscaleImageOptionsInfered} [toolOptions] Options for specific tool. Please note that some tool has required options you must fill otherwise it will throw, see tool options from {@link https://www.iloveapi.com/docs/api-reference#resizeimage-extra-parameters here}.
	 * @returns {Promise<TaskSchema.TaskProcessReturnTypeInfered>} Processed file meta information. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed, task id and server are not resolved, no file to process.
	 * @throws {import('zod').ZodError} If required options or toolOptions are missing or invalid.
	 */
	async process(options = {}, toolOptions = {}) {
		if (!this.#task_id || !this.#server) {
			throw new Error(
				'You need to retrieve task id and assigned server first using start() method.'
			);
		}
		if (!Array.isArray(this.#files) || !this.#files.length) {
			throw new Error('You need to add files first using addFile() method.');
		}

		/**
		 * Generic options that already validated by zod.
		 */
		const _vOptions =
			await TaskSchema.TaskProcessGenericOptions.parseAsync(options);
		/**
		 * Tool options that already validated by zod.
		 */
		const _vToolOptions = await TaskUtils.validateProcessToolOptions(
			this.#tool,
			toolOptions
		);

		try {
			const response = await this.#server.post('/process', {
				task: this.#task_id,
				tool: this.#tool,
				files: this.#files,
				..._vOptions,
				..._vToolOptions
			});

			return response.data;
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * Downloads processed files on this task.
	 * @param {TaskSchema.TaskDownloadGenericOptionsInfered} [options] Generic options for download processed files.
	 * @returns {Promise<import('axios').AxiosResponse<Uint8Array, any>>} Promise resolve with `AxiosInstance`. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed, task id and server are not resolved.
	 * @throws {import('zod').ZodError} If required options are missing or use invalid options.
	 */
	async download(options = {}) {
		if (!this.#task_id || !this.#server) {
			throw new Error(
				'You need to retrieve task id and assigned server first using start() method.'
			);
		}

		/**
		 * Generic options that already validated by zod.
		 */
		const _vOptions =
			await TaskSchema.TaskDownloadGenericOptions.parseAsync(options);
		const isDebug = !!_vOptions?.debug;

		try {
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
	 * Get details on this task.
	 * @param {TaskSchema.TaskDetailsGenericOptionsInfered} [options] Generic options for details.
	 * @returns {Promise<TaskSchema.TaskDetailsReturnTypeInfered>} Task details. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed, task id and server are not resolved.
	 * @throws {import('zod').ZodError} If required options are missing or use invalid options.
	 */
	async details(options = {}) {
		if (!this.#task_id || !this.#server) {
			throw new Error(
				'You need to retrieve task id and assigned server first using start() method.'
			);
		}

		/**
		 * Generic options that already validated by zod.
		 */
		const _vOptions =
			await TaskSchema.TaskDetailsGenericOptions.parseAsync(options);
		const isDebug = !!_vOptions?.debug;

		try {
			const response = isDebug
				? await this.#server.get(`/task/${this.#task_id}?debug=true`)
				: await this.#server.get(`/task/${this.#task_id}`);

			return response.data;
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * Delete this task.
	 * @param {TaskSchema.TaskDeleteGenericOptionsInfered} [options] Generic options for deleting task.
	 * @returns {Promise<void>} If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws {Error} If requests failed, task id and server are not resolved.
	 * @throws {import('zod').ZodError} If required options are missing or use invalid options.
	 */
	async delete(options = {}) {
		if (!this.#task_id || !this.#server) {
			throw new Error(
				'You need to retrieve task id and assigned server first using start() method.'
			);
		}

		const _vOptions =
			await TaskSchema.TaskDeleteGenericOptions.parseAsync(options);
		const isDebug = !!_vOptions?.debug;

		try {
			const response = isDebug
				? await this.#server.delete(`/task/${this.#task_id}?debug=true`)
				: await this.#server.delete(`/task/${this.#task_id}`);

			if (isDebug) {
				return response.data;
			}
		} catch (error) {
			classifyError(error);
		}
	}

	/**
	 * Retrieve tool type for this task.
	 * @returns Tool type for this task.
	 * @example
	 * ```js
	 * const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
	 * const task = iloveimg.newTask('convertimage');
	 * console.log(task.getTool()); // 'convertimage'
	 * ```
	 */
	getTool() {
		return this.#tool || undefined;
	}

	/**
	 * @private Internal & testing usage only.
	 * @param {import('./schema/Tool.js').ToolTypesInfered} x
	 */
	_setTool(x) {
		this.#tool = x;
	}

	/**
	 * Retrieve id for current task. You might need to call `start()` first otherwise it will return `undefined`.
	 * @returns Id for current task.
	 * @example
	 * ```js
	 * const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
	 * const task = iloveimg.newTask('upscaleimage');
	 * await task.start();
	 * console.log(task.getTaskId()); // 'this_current_task_id'
	 * ```
	 */
	getTaskId() {
		return this.#task_id || undefined;
	}

	/**
	 * @private Internal & testing usage only.
	 * @param {string} x
	 */
	_setTaskId(x) {
		this.#task_id = x;
	}

	/**
	 * Retrieve your project remaining files. This represents the current limit on how many files you can process. You might need to call `start()` first otherwise it will return `undefined`.
	 * @returns Project remaining files.
	 * @example
	 * ```js
	 * const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
	 * const task = iloveimg.newTask('upscaleimage');
	 * await task.start();
	 * console.log(task.getTaskId()); // 2320
	 * ```
	 */
	getRemainingFiles() {
		return this.#remaining_files || undefined;
	}

	/**
	 * @private Internal & testing usage only.
	 * @param {number} x
	 */
	_setRemainingFiles(x) {
		this.#remaining_files = x;
	}

	/**
	 * Retrieve assigned (uploaded) image file for this task. You might need to call `start()` and upload some files first using `addFile()` otherwise it will return `undefined`.
	 * @returns Uploaded images file.
	 * @example
	 * ```js
	 * const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
	 * const task = iloveimg.newTask('upscaleimage');
	 * await task.start();
	 * await task.addFile('https://www.someimgprovider.com/awesomeimage.jpg')
	 * console.log(task.getUploadedFiles());
	 * // [{
	 * // 	server_filename: 'this-value-are-assigned-from-iloveimgserver.jpg',
	 * // 	filename: 'awesomeimg.jpg'
	 * // }]
	 * ```
	 */
	getUploadedFiles() {
		return this.#files || undefined;
	}

	/**
	 * @private Internal & testing usage only.
	 * @param {TaskSchema.TaskProcessRequiredOptionsInfered['files']} x
	 */
	_setUploadedFiles(x) {
		this.#files = x;
	}

	/**
	 * Retrieve `AxiosInstance` for this task. This instance use required authentication token and point to correct `ILoveApi` task specific server.
	 * Its usefull to create a direct request to server without using existing methods. You might need to call `start()` first otherwise it will return `undefined`.
	 * @example
	 * ```js
	 * // Delete current task without using delete() method.
	 * const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
	 * const task = iloveimg.newTask('upscaleimage');
	 * await task.start();
	 * const endpoint = 'task/' + task.getTaskId(); // To delete task we need task id
	 * const axios = task.getServer();
	 * await axios.delete(endpoint)
	 * ```
	 */
	getServer() {
		return this.#server || undefined;
	}

	/**
	 * @private Internal & testing usage only.
	 * @param {import('axios').AxiosInstance} x
	 */
	_setServer(x) {
		this.#server = x;
	}
}

export default TaskI;


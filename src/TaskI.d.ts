import { AxiosInstance, AxiosResponse } from 'axios';
import {
	TaskProcessRequiredOptionsInfered,
	TaskStartGenericOptionsInfered,
	TaskStartReturnTypeInfered,
	TaskAddFileGenericOptionsInfered,
	TaskRemoveFileGenericOptionsInfered,
	TaskProcessGenericOptionsInfered,
	TaskProcessToolOptionsInfered,
	TaskProcessReturnTypeInfered,
	TaskDownloadGenericOptionsInfered,
	TaskDetailsGenericOptionsInfered,
	TaskDetailsReturnTypeInfered,
	TaskDeleteGenericOptionsInfered
} from './schema/Task';
import { ToolTypesInfered } from './schema/Tool';
import Auth from './Auth';

/**
 * The `TaskI` class represents a task initiated through `ILoveIMGApi`.
 * It simplifies the image processing workflow for a specific tool,
 * handling everything from task creation to file upload, processing, download, etc.
 *
 * @class TaskI
 */
declare class TaskI {
	private auth: Auth;
	private fixedServer: AxiosInstance;
	private tool: ToolTypesInfered;
	private taskId?: string;
	private remainingFiles?: number;
	private files?: TaskProcessRequiredOptionsInfered['files'];
	private server?: AxiosInstance;

	/**
	 * Creates an instance of Task.
	 * @param auth Instance of `Auth` that used for maintaining authentication token used.
	 * @param fixedServer Axios instance that already configured for starting a Task.
	 * @param taskType Task tool type.
	 */
	constructor(
		auth: Auth,
		fixedServer: AxiosInstance,
		taskType: ToolTypesInfered
	);

	/**
	 * Starts task by retrieving the assigned server and task id.
	 * @param options Generic options for starting a task.
	 * @returns Promise resolving an object containing assigned server, task id and project remaining files. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws `Error` If requests failed.
	 * @throws `ZodError` If any incorrect or invalid `options` type.
	 */
	start(
		options?: TaskStartGenericOptionsInfered
	): Promise<TaskStartReturnTypeInfered>;

	/**
	 * Upload a image for this task.
	 * @param options Generic options for uploading image.
	 * @returns Promise resolving a server filename as a string. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws `Error` If requests failed or task id and server are not resolved.
	 * @throws `ZodError` If required options are missing or use invalid options.
	 */
	addFile(options: TaskAddFileGenericOptionsInfered): Promise<string>;

	/**
	 * Delete a image previously that already uploaded on this task.
	 * @param options Generic options for delete uploaded image.
	 * @returns If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws `Error` If requests failed or task id and server are not resolved.
	 * @throws `ZodError` If required options are missing or use invalid options.
	 */
	deleteFile(options: TaskRemoveFileGenericOptionsInfered): Promise<void>;

	/**
	 * Process this task.
	 * @param options Generic options for processing task.
	 * @param toolOptions Options for specific tool. When you assign options for different tool, it will be ignored. Please note that some tool has required options you must fill otherwise it will throw, see tool options from {@link https://www.iloveapi.com/docs/api-reference#resizeimage-extra-parameters here}.
	 * @returns Processed file meta information. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws `Error` If requests failed, task id and server are not resolved, no file to process.
	 * @throws `ZodError` If required options or toolOptions are missing or invalid.
	 */
	process(
		options?: TaskProcessGenericOptionsInfered,
		toolOptions?: TaskProcessToolOptionsInfered
	): Promise<TaskProcessReturnTypeInfered>;

	/**
	 * Downloads processed files on this task.
	 * @param options Generic options for download processed files.
	 * @returns Promise resolve with `AxiosInstance`. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws `Error` If requests failed, task id and server are not resolved.
	 * @throws `ZodError` If required options are missing or use invalid options.
	 */
	download(
		options?: TaskDownloadGenericOptionsInfered
	): Promise<AxiosResponse<Uint8Array, any>>;

	/**
	 * Get details on this task.
	 * @param options Generic options for details.
	 * @returns Task details. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws `Error` If requests failed, task id and server are not resolved.
	 * @throws `ZodError` If required options are missing or use invalid options.
	 */
	details(
		options?: TaskDetailsGenericOptionsInfered
	): Promise<TaskDetailsReturnTypeInfered>;

	/**
	 * Delete this task.
	 * @param options Generic options for deleting task.
	 * @returns If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws `Error` If requests failed, task id and server are not resolved.
	 * @throws `ZodError` If required options are missing or use invalid options.
	 */
	delete(options?: TaskDeleteGenericOptionsInfered): Promise<void>;

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
	getTool(): string;

	/**
	 * Retrieve id for this task. You might need to call `start()` first otherwise it will return `undefined`.
	 * @returns Identifier for this task.
	 * @example
	 * ```js
	 * const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
	 * const task = iloveimg.newTask('upscaleimage');
	 * await task.start();
	 * console.log(task.getTaskId()); // 'this_current_task_id'
	 * ```
	 */
	getTaskId(): string | undefined;

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
	getRemainingFiles(): number | undefined;

	/**
	 * Retrieve uploaded images file for this task. You might need to call `start()` and upload some files first using `addFile()` otherwise it will return `undefined`.
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
	getUploadedFiles(): TaskProcessRequiredOptionsInfered['files'] | undefined;

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
	getServer(): AxiosInstance | undefined;
}

export default TaskI;

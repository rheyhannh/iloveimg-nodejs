import { AxiosInstance, AxiosResponse } from 'axios';
import {
	TaskProcessRequiredOptionsInfered,
	TaskStartGenericOptionsInfered,
	TaskStartReturnTypeInfered,
	TaskAddFileGenericOptionsInfered,
	TaskAddFileReturnTypeInfered,
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
import { DebugReturnTypeInfered } from './ILoveIMGApi';

/**
 * The `TaskI` class represents a task initiated through `ILoveIMGApi`.
 * It simplifies the image processing workflow for a specific tool,
 * handling everything from task creation to file upload, processing, download, etc.
 *
 * @class TaskI
 */
declare class TaskI<T extends ToolTypesInfered> {
	private auth: Auth;
	private fixedServer: AxiosInstance;
	private tool: T;
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
	constructor(auth: Auth, fixedServer: AxiosInstance, taskType: T);

	/**
	 * Start task by retrieving the assigned server and task id from `ILoveApi` servers.
	 * @param options Generic options for starting a task.
	 * @returns Promise resolve with object containing assigned server, task id and project remaining files.
	 * @throws `Error` If request fails.
	 * @throws `ZodError` If any incorrect or invalid `options` type.
	 */
	start(
		options: Omit<TaskStartGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: true;
		}
	): Promise<DebugReturnTypeInfered>;
	start(
		options: Omit<TaskStartGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: false;
		}
	): Promise<TaskStartReturnTypeInfered>;
	start(
		options?: TaskStartGenericOptionsInfered
	): Promise<TaskStartReturnTypeInfered>;

	/**
	 * Upload a image for this task by making request to `ILoveIMG` servers.
	 * @param options Generic options for uploading image.
	 * @returns Promise resolve with object containing server filename.
	 * @throws `Error` If request fails or task id and server are not resolved.
	 * @throws `ZodError` If required `options` are missing or invalid.
	 */
	addFile(
		options: Omit<TaskAddFileGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: true;
		}
	): Promise<DebugReturnTypeInfered>;
	addFile(
		options: Omit<TaskAddFileGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: false;
		}
	): Promise<TaskAddFileReturnTypeInfered>;
	addFile(
		options: TaskAddFileGenericOptionsInfered
	): Promise<TaskAddFileReturnTypeInfered>;

	/**
	 * Delete uploaded image on this task by making request to `ILoveIMG` servers.
	 * @param options Generic options for delete uploaded image.
	 * @throws `Error` If request fails or task id and server are not resolved.
	 * @throws `ZodError` If required `options` are missing or invalid.
	 */
	deleteFile(
		options: Omit<TaskRemoveFileGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: true;
		}
	): Promise<DebugReturnTypeInfered>;
	deleteFile(
		options: Omit<TaskRemoveFileGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: false;
		}
	): Promise<void>;
	deleteFile(options: TaskRemoveFileGenericOptionsInfered): Promise<void>;

	/**
	 * Process this task by making request to `ILoveIMG` servers.
	 * @param options Generic options for processing task.
	 * @param toolOptions Options for specific tool. Please note that some tool has required options you must fill otherwise it will throw, see tool options from {@link https://www.iloveapi.com/docs/api-reference#resizeimage-extra-parameters here}.
	 * @returns Promise resolve with processed file meta information.
	 * @throws `Error` If request fails, task id and server are not resolved, no file to process.
	 * @throws `ZodError` If required `options` or `toolOptions` are missing or invalid.
	 */
	process(
		options: Omit<TaskProcessGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: true;
		},
		toolOptions?: TaskProcessToolOptionsInfered[T]
	): Promise<DebugReturnTypeInfered>;
	process(
		options: Omit<TaskProcessGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: false;
		},
		toolOptions?: TaskProcessToolOptionsInfered[T]
	): Promise<TaskProcessReturnTypeInfered>;
	process(
		options?: TaskProcessGenericOptionsInfered,
		toolOptions?: TaskProcessToolOptionsInfered[T]
	): Promise<TaskProcessReturnTypeInfered>;

	/**
	 * Downloads processed files on this task by making request to `ILoveIMG` servers.
	 * @param options Generic options for download processed files.
	 * @returns Promise resolve with `AxiosInstance`.
	 * @throws `Error` If request fails, task id and server are not resolved.
	 * @throws `ZodError` If required `options` are missing or invalid.
	 */
	download(
		options: Omit<TaskDownloadGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: true;
		}
	): Promise<DebugReturnTypeInfered>;
	download(
		options: Omit<TaskDownloadGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: false;
		}
	): Promise<AxiosResponse<Uint8Array, any>>;
	download(
		options?: TaskDownloadGenericOptionsInfered
	): Promise<AxiosResponse<Uint8Array, any>>;

	/**
	 * Retrieve task details for this task by making request to `ILoveIMG` servers.
	 * @param options Generic options for retrieve task details.
	 * @returns Promise with task details.
	 * @throws `Error` If request fails, task id and server are not resolved.
	 * @throws `ZodError` If required `options` are missing or invalid.
	 */
	details(
		options: Omit<TaskDetailsGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: true;
		}
	): Promise<DebugReturnTypeInfered>;
	details(
		options: Omit<TaskDetailsGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: false;
		}
	): Promise<TaskDetailsReturnTypeInfered>;
	details(
		options?: TaskDetailsGenericOptionsInfered
	): Promise<TaskDetailsReturnTypeInfered>;

	/**
	 * Delete this task by making request to `ILoveIMG` servers.
	 * @param options Generic options for deleting task.
	 * @throws `Error` If request fails, task id and server are not resolved.
	 * @throws `ZodError` If required `options` are missing or invalid.
	 */
	delete(
		options: Omit<TaskDeleteGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: true;
		}
	): Promise<DebugReturnTypeInfered>;
	delete(
		options: Omit<TaskDeleteGenericOptionsInfered, 'debug'> & {
			/** Enables or disables debug mode, default is `false`. */ debug: false;
		}
	): Promise<void>;
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

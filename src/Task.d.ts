import { AxiosInstance, AxiosResponse } from 'axios';
import Auth from './Auth';
import * as TaskSchema from './schema/Task';
import { SelfSignedTokenOptionsInfered } from './schema/Auth';

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
declare class Task {
	private readonly #auth: Auth;
	private readonly #task_id: string;
	private #server: AxiosInstance;

	/**
	 * Creates an instance that allows downloading a processed file or retrieving task details for a specific task ID and its assigned server.
	 * @param publicKey Projects public key used for authentication, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param secretKey Projects secret key used for local token generation, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param taskId The unique task identifier.
	 * @param taskServer The server assigned to the task.
	 * @param params Additional parameters.
	 * @throws `Error` If taskId or taskServer is missing or invalid.
	 */
	constructor(
		publicKey: string,
		secretKey?: string,
		taskId: string,
		taskServer: string,
		params?: Partial<SelfSignedTokenOptionsInfered>
	);

	/**
	 * Downloads processed files associated with this task.
	 * @param options Generic options for download.
	 * @returns A promise resolving to an Axios response containing file data. If `debug` is enabled, it resolves with an object containing request information instead.
	 * @throws `Error` If the request fails.
	 * @throws `ZodError` If required options are missing or use invalid options.
	 */
	download(
		options?: TaskSchema.TaskDownloadGenericOptionsInfered
	): Promise<AxiosResponse<Uint8Array>>;

	/**
	 * Retrieves details about this task.
	 * @param options Generic options for retrieving task details.
	 * @returns A promise resolving to the task details.
	 * @throws `Error` If the request fails or required parameters are missing.
	 * @throws `ZodError` If required options are missing or use invalid options.
	 */
	details(
		options?: TaskSchema.TaskDetailsGenericOptionsInfered
	): Promise<TaskSchema.TaskDetailsReturnTypeInfered>;
}

export default Task;

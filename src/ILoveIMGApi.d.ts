import { AxiosInstance } from 'axios';
import Auth from './Auth';
import TaskI from './TaskI';
import * as Schema from './schema/ILoveIMGApi';
import * as ToolSchema from './schema/Tool';
import * as AuthSchema from './schema/Auth';

/**
 * The `ILoveIMGApi` class provides an interface to interact with the `ILoveApi` server,
 * allowing to create new tasks for image processing tools and retrieve task lists.
 *
 * @class ILoveIMGApi
 * @see https://github.com/rheyhannh/iloveimg-nodejs
 * @example
 * ```js
 * import ILoveIMGApi from '@rheyhannh/iloveimg-nodejs';
 *
 * const iloveimg = new ILoveIMGApi('publicKey', 'secretKey');
 *
 * // Create 'Convert Image' Task
 * const task = iloveimg.newTask('convertimage');
 * await task.start();
 * await task.addFile({ cloud_file: 'https://i.imgur.com/awesome.jpeg', filename: 'awesome.jpeg' });
 * await task.process();
 * const result = await task.download(); // AxiosResponse
 *
 * // Retrieve Task List
 * const tasks = await iloveimg.listTasks();
 * ```
 */
declare class ILoveIMGApi {
	private readonly #publicKey: string;
	private readonly #secretKey?: string;
	private #auth: Auth;
	private #fixedServer: AxiosInstance;

	/**
	 * Create an instance of `ILoveIMGApi` using your project public and secret key (optional).
	 * With this instance, you can add task for specific image tool using `newTask` or list your tasks using `listTasks` (secret key required).
	 * @param publicKey Projects public key used for authentication, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param secretKey Projects secret key used for local token generation, obtained from {@link https://www.iloveapi.com/user/projects here}.
	 * @param params Additional parameters.
	 */
	constructor(
		publicKey: string,
		secretKey?: string,
		params?: Partial<AuthSchema.SelfSignedTokenOptionsInfered>
	);

	/**
	 * Creates a new task for a specific `ILoveIMG` tool.
	 * @param type Tool type to run.
	 * @returns Task instance.
	 * @throws `ZodError` If the tool type is not valid.
	 */
	newTask(type: ToolSchema.ToolTypesInfered): TaskI;

	/**
	 * Returns a task lists from `ILoveApi` servers ordered from newest to older.
	 * You need to provide secret key to get the task lists, otherwise this method will throw an error.
	 * @param options Options to get the task list.
	 * @returns List of tasks.
	 * @throws `Error` If the secret key is not provided or requests fail.
	 * @throws `ZodError` If any incorrect or invalid `options` type.
	 */
	listTasks(
		options?: Schema.ListTasksOptionsInfered
	): Promise<Array<Schema.ListTasksReturnTypeInfered>>;
}

export default ILoveIMGApi;

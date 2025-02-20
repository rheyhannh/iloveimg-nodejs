import { z } from 'zod';
import { ToolTypesInfered } from './Tool';
import { FileStatusInfered } from './File';

export type TaskStatusTypesInfered =
	| 'TaskWaiting'
	| 'TaskProcessing'
	| 'TaskSuccess'
	| 'TaskSuccessWithWarnings'
	| 'TaskError'
	| 'TaskDeleted'
	| 'TaskNotFound';

export declare const TaskStatusTypes: z.ZodType<TaskStatusTypesInfered>;

export type TaskStartGenericOptionsInfered = {
	/**
	 * Enables or disables debug mode, default are `false`. When set to `true`,
	 * - No credits will be deducted from your project.
	 * - No actual processing will occur, `ILoveApi` only return response from your request details.
	 * - The returned data may differ from standard response.
	 */
	debug?: boolean;
};

export declare const TaskStartGenericOptions: z.ZodType<TaskStartGenericOptionsInfered>;

export type TaskStartReturnTypeInfered = {
	/**
	 * Assigned server.
	 * - Ex: `api8g.iloveimg.com`
	 */
	server: string;
	/**
	 * Task id.
	 */
	task_id: string;
	/**
	 * The number of remaining files available for processing in your project.
	 * This represents the current limit on how many files you can process.
	 */
	remaining_files: number;
};

export declare const TaskStartReturnType: z.ZodType<TaskStartReturnTypeInfered>;

export type TaskAddFileGenericOptionsInfered = {
	/**
	 * Public image URL. When you working with `URL`, you should parse to string first using `toString`.
	 */
	cloud_file: string;
	/**
	 * Enables or disables debug mode, default are `false`. When set to `true`,
	 * - No credits will be deducted from your project.
	 * - No actual processing will occur, `ILoveApi` only return response from your request details.
	 * - The returned data may differ from standard response.
	 */
	debug?: boolean;
};

export declare const TaskAddFileGenericOptions: z.ZodType<TaskAddFileGenericOptionsInfered>;

export type TaskAddFileReturnTypeInfered = {
	/**
	 * Server filename that resolved from adding image file.
	 * - Ex: `loremipsumdolorsitamet.jpg`
	 */
	server_filename: string;
};

export declare const TaskAddFileReturnType: z.ZodType<TaskAddFileReturnTypeInfered>;

export type TaskRemoveFileGenericOptionsInfered = {
	/**
	 * Server filename that resolved from adding image file.
	 * - Ex: `loremipsumdolorsitamet.jpg`
	 */
	server_filename: string;
	/**
	 * Enables or disables debug mode, default are `false`. When set to `true`,
	 * - No credits will be deducted from your project.
	 * - No actual processing will occur, `ILoveApi` only return response from your request details.
	 * - The returned data may differ from standard response.
	 */
	debug?: boolean;
};

export declare const TaskRemoveFileGenericOptions: z.ZodType<TaskRemoveFileGenericOptionsInfered>;

export type TaskRemoveFileReturnTypeInfered = {
	/**
	 * Indicates whether the file removal process was successful.
	 */
	success: boolean;
};

export declare const TaskRemoveFileReturnType: z.ZodType<TaskRemoveFileReturnTypeInfered>;

export type TaskProcessRequiredOptionsInfered = {
	task: string;
	tool: ToolTypesInfered;
	files: {
		/**
		 * Server filename that resolved from adding image file.
		 * - Ex: `loremipsumdolorsitamet.jpg`
		 */
		server_filename: string;
		/**
		 * Filename that can you customized, make sure extensions are correct.
		 * This will be used as default `output_filename` when you dont specify it.
		 * - Ex: `john_upscaledimage_1.jpg`
		 */
		filename: string;
	}[];
};

export declare const TaskProcessRequiredOptions: z.ZodType<TaskProcessRequiredOptionsInfered>;

export type TaskProcessGenericOptionsInfered = {
	/**
	 * Force process although some of the files are damaged or throw an error. If damaged/error files are equal to total files to process, this value does not take effect. On successful response, all files with errors will be listed as warnings.
	 * - Default: `true`
	 */
	ignore_errors?: boolean;
	/**
	 * Output filename that can accept below placeholder,
	 * - `{date}`: Current date
	 * - `{n}` : File number
	 * - `{filename}`: Original filename
	 * - `{tool}`: The current processing action
	 *
	 * Example: `{tool}_{n}_{date}`
	 */
	output_filename?: string;
	/**
	 * If there are more than one output files, they will be compressed into a ZIP file.
	 * You can specify the filename of the compressed file that accept below placeholder,
	 * - `{date}`: Current date
	 * - `{n}` : File number
	 * - `{filename}`: Original filename
	 * - `{tool}`: The current processing action
	 *
	 * Example: `{tool}_{n}_{date}`
	 */
	packaged_filename?: string;
	/**
	 * If specified, all previously uploaded files for the task will be uploaded encrypted.
	 * The key will be used to decrypt the files before processing and re-encrypt them after processing.
	 * Only key sizes of `16`, `24` or `32` characters are supported.
	 */
	file_encryption_key?: string;
	/**
	 * When an image file fails to be processed, we try to repair it automatically.
	 * - Default: `true`
	 */
	try_image_repair?: boolean;
	/**
	 * Use this parameter to store integers as you wish. You can use it to filter your tasks in the `GET` `/task` resource,
	 * or using `listTasks` options like example below,
	 * ```js
	 * const custom_int = 5;
	 * // Ensure publicKey and secretKey are provided!
	 * const instance = new ILoveIMGApi('publicKey', 'secretKey');
	 * const tasks = await instance.listTasks({ custom_int });
	 * ```
	 */
	custom_int?: number;
	/**
	 * Use this parameter to store integers as you wish. You can use it to filter your tasks in the `GET` `/task` resource,
	 * or using `listTasks` options like example below,
	 * ```js
	 * const custom_string = 'loremipsum';
	 * // Ensure publicKey and secretKey are provided!
	 * const instance = new ILoveIMGApi('publicKey', 'secretKey');
	 * const tasks = await instance.listTasks({ custom_string });
	 * ```
	 */
	custom_string?: string;
	/**
	 * A callback URL. If provided, the API will close the connection immediately after starting the task
	 * and send a POST request with the task details to the specified URL once processing is complete.
	 *
	 * Alternatively, you can set this parameter to an empty string (`""`).
	 * In this case, the API will still close the connection immediately,
	 * but no callback will be sent. This allows you to check the task status manually
	 * by making periodic `GET` requests to `/task/{task}` instead.
	 */
	webhook?: string;
	/**
	 * Enables or disables debug mode, default are `false`. When set to `true`,
	 * - No credits will be deducted from your project.
	 * - No actual processing will occur, `ILoveApi` only return response from your request details.
	 * - The returned data may differ from standard response.
	 */
	debug?: boolean;
};

export declare const TaskProcessGenericOptions: z.ZodType<TaskProcessGenericOptionsInfered>;

export type TaskProcessReturnTypeInfered = {
	/**
	 * This match to `output_filename` on process options when its provided,
	 * otherwise match to its own processed `filename` attributes. When you use `webhook` parameter, this attribute wont exist.
	 */
	download_filename?: string;
	/**
	 * Original image file size in `bytes`. When you use `webhook` parameter, this attribute wont exist.
	 */
	filesize?: number;
	/**
	 * Processed image file size in `bytes`. When you use `webhook` parameter, this attribute wont exist.
	 */
	output_filesize?: number;
	/**
	 * Total image file that already been processed.
	 * When compressed in ZIP, this match to total files in ZIP archive.
	 * When you use `webhook` parameter, this attribute wont exist.
	 */
	output_filenumber?: number;
	/**
	 * Processed image file extensions. When you use `webhook` parameter, this attribute wont exist.
	 * - Ex: `[\"jpg\"]`
	 */
	output_extensions?: string;
	/**
	 * Process duration in string. When you use `webhook` parameter, this attribute wont exist.
	 * - Ex: `23.258`
	 */
	timer?: string;
	/**
	 * Task status. When you use `webhook` parameter, this attribute wont exist.
	 */
	status: TaskStatusTypes;
	/**
	 * Task message that only available when the `webhook` parameter is used.
	 */
	task?: string;
};

export declare const TaskProcessReturnType: z.ZodType<TaskProcessReturnTypeInfered>;

export type TaskDownloadGenericOptionsInfered = {
	/**
	 * Enables or disables debug mode, default are `false`. When set to `true`,
	 * - No credits will be deducted from your project.
	 * - No actual processing will occur, `ILoveApi` only return response from your request details.
	 * - The returned data may differ from standard response.
	 */
	debug?: boolean;
};

export declare const TaskDownloadGenericOptions: z.ZodType<TaskDownloadGenericOptionsInfered>;

export type TaskDetailsGenericOptionsInfered = {
	/**
	 * Enables or disables debug mode, default are `false`. When set to `true`,
	 * - No credits will be deducted from your project.
	 * - No actual processing will occur, `ILoveApi` only return response from your request details.
	 * - The returned data may differ from standard response.
	 */
	debug?: boolean;
};

export declare const TaskDetailsGenericOptions: z.ZodType<TaskDetailsGenericOptionsInfered>;

export type TaskDetailsReturnTypeInfered = {
	/**
	 * Task status.
	 */
	status: TaskStatusTypes;
	/**
	 * Task status message.
	 */
	status_message: string;
	/**
	 * Tool type. This attribute only exist when task already processed.
	 */
	tool?: ToolTypesInfered;
	/**
	 * Date-like when process started. This attribute only exist when task already processed.
	 * - Ex: `2025-02-04 09:36:45`
	 */
	process_start?: string;
	/**
	 * Assigned `custom_int` value. This attribute are `nullable` and only exist when task already processed.
	 */
	custom_int?: number | null;
	/**
	 * Assigned `custom_string` value. This attribute are `nullable` and only exist when task already processed.
	 */
	custom_string?: string | null;
	/**
	 * Process duration in string. This attribute only exist when task already processed.
	 * - Ex: `23.258`
	 */
	timer?: string;
	/**
	 * Original image file size in `bytes`. This attribute only exist when task already processed.
	 */
	filesize?: number;
	/**
	 * Processed image file size in `bytes`. This attribute only exist when task already processed.
	 */
	output_filesize?: number;
	/**
	 * Total image file that already been processed.
	 * When compressed in ZIP, this match to total files in ZIP archive.
	 * This attribute only exist when task already processed.
	 */
	output_filenumber?: number;
	/**
	 * Processed image file extensions. This attribute only exist when task already processed.
	 * - Ex: `[\"jpg\"]`
	 */
	output_extensions?: string;
	/**
	 * Task server. This attribute only exist when task already processed.
	 * - Ex: `api8g.iloveimg\\.com`
	 */
	server?: string;
	/**
	 * Task id. This attribute only exist when task already processed.
	 */
	task_id?: string;
	/**
	 * Task total files in `string`. This attribute only exist when task already processed.
	 */
	file_number?: string;
	/**
	 * This match to `output_filename` on process options when its provided,
	 * otherwise match to its own processed `filename` attributes. This attribute only exist when task already processed.
	 */
	download_filename?: string;
	/**
	 * Array containing processed file. This attribute only exist when task already processed.
	 */
	files?: {
		/**
		 * Server filename that resolved from adding image file. This attribute only exist when task already processed.
		 * - Ex: `loremipsumdolorsitamet.jpg`
		 */
		server_filename?: string;
		/**
		 * File status. This attribute only exist when task already processed.
		 */
		status?: FileStatusInfered;
		/**
		 * File status message.
		 */
		status_message?: string;
		/**
		 * Filename that you assigned. This attribute only exist when task already processed.
		 * - Ex: `john_upscaledimage_1.jpg`
		 */
		filename?: string;
		/**
		 * Process duration. This attribute only exist when task already processed.
		 * - Ex: `23.258`
		 */
		timer?: number;
		/**
		 * Original image file size in `bytes`. This attribute only exist when task already processed.
		 */
		filesize?: number;
		/**
		 * Processed image file size in `bytes`. This attribute only exist when task already processed.
		 */
		output_filesize?: number;
	}[];
};

export declare const TaskDetailsReturnType: z.ZodType<TaskDetailsReturnTypeInfered>;

export type TaskDeleteGenericOptionsInfered = {
	/**
	 * Enables or disables debug mode, default are `false`. When set to `true`,
	 * - No credits will be deducted from your project.
	 * - No actual processing will occur, `ILoveApi` only return response from your request details.
	 * - The returned data may differ from standard response.
	 */
	debug?: boolean;
};

export declare const TaskDeleteGenericOptions: z.ZodType<TaskDeleteGenericOptionsInfered>;

export type TaskProcessConvertImageOptionsInfered = {
	/**
	 * The format to convert to. Accepted values are `jpg`, `png`, `gif`, `gif_animation` and `heic`.
	 * Convert to jpg can be (almost) from any image format. Convert to png and gif can be only from jpg images.
	 *
	 * - Default: `jpg`
	 */
	to?: 'jpg' | 'png' | 'gif' | 'gif_animation' | 'heic';
	/**
	 * Define the seconds per image, in hundredths of a second. Required when `to` are `gif` or `gif_animation`.
	 *
	 * - Default: `50`
	 */
	gif_time?: number;
	/**
	 * Set if animation stops at the end or loops forever. Required when `to` are `gif` or `gif_animation`.
	 *
	 * - Default: `true`
	 */
	gif_loop?: boolean;
};

export declare const TaskProcessConvertImageOptions: z.ZodType<TaskProcessConvertImageOptionsInfered>;

export type TaskProcessUpscaleImageOptionsInfered = {
	/**
	 * Image upscale multiplier. Accepted values are `2`, `4`.
	 */
	multiplier: 2 | 4;
};

export declare const TaskProcessUpscaleImageOptions: z.ZodType<TaskProcessUpscaleImageOptionsInfered>;

export type TaskProcessWatermarkImageElementsPropsInfered = {
	/**
	 * The type for the element. Accepted values are `image` or `text`.
	 */
	type: 'image' | 'text';
	/**
	 * The text to stamp, required when type are `text`
	 */
	text?: string;
	/**
	 * The stamp image that must be uploaded in the Upload resource that required when type are `image`.
	 * This image parameter must referer to the `server_filename` either JPG or PNG.
	 */
	image?: string;
	/**
	 * - Default: `Center`
	 */
	gravity?:
		| 'North'
		| 'NorthEast'
		| 'NorthWest'
		| 'Center'
		| 'CenterEast'
		| 'CenterWest'
		| 'East'
		| 'West'
		| 'South'
		| 'SouthEast'
		| 'SouthWest';
	/**
	 * Adjust how much space must modify the position of the position defined in `gravity`,
	 * based on a percent of the base image, it accepts positive and negative values.
	 * - Default: `0`
	 */
	vertical_adjustment_percent?: number;
	/**
	 * Adjust how much space must modify the position of the position defined in `gravity`,
	 * based on a percent of the base image, it accepts positive and negative values.
	 * - Default: `0`
	 */
	horizontal_adjustment_percent?: number;
	/**
	 * Angle of rotation. Accepted integer range are `0-360`.
	 * - Default: `0`
	 */
	rotation?: number;
	/**
	 * - Default: `Arial`
	 */
	font_family?:
		| 'Arial'
		| 'Arial Unicode MS'
		| 'Verdana'
		| 'Courier'
		| 'Times New Roman'
		| 'Comic Sans MS'
		| 'WenQuanYi Zen Hei'
		| 'Lohit Marathi';
	/**
	 * Optionally you can use `null` for regular normal usage.
	 * - Default: `null`
	 */
	font_style?: 'Bold' | 'Italic' | null;
	/**
	 * - Default: `14`
	 */
	font_size?: number;
	/**
	 * Hexadecimal color.
	 * - Default : `#000000`
	 */
	font_color?: string;
	/**
	 * Percentage of opacity for stamping text or image. Accepted range are `1-100`.
	 * - Default: `100`
	 */
	transparency?: number;
	/**
	 * If `true`, it will overrides all position parameters and stamps the image or text 9 times per page.
	 * - Default: `false`
	 */
	mosaic?: boolean;
};

export declare const TaskProcessWatermarkImageElementsProps: z.ZodType<TaskProcessWatermarkImageElementsPropsInfered>;

export type TaskProcessWatermarkImageOptionsInfered = {
	/**
	 * At least one element required
	 */
	elements: TaskProcessWatermarkImageElementsProps[];
};

export declare const TaskProcessWatermarkImageOptions: z.ZodType<TaskProcessWatermarkImageOptionsInfered>;

export type TaskProcessToolOptionsInfered = {
	/** When tool type are `convertimage`, this options are optional. */
	convertimage?: TaskProcessConvertImageOptions;
	/** When tool type are `removebackgroundimage`, this options are optional. */
	removebackgroundimage?: {};
	/** When tool type are `upscaleimage`, some options are required. */
	upscaleimage?: TaskProcessUpscaleImageOptions;
	/** When tool type are `watermarkimage`, some options are required. */
	watermarkimage?: TaskProcessWatermarkImageOptions;
};

export declare const TaskProcessToolOptions: z.ZodType<TaskProcessToolOptionsInfered>;

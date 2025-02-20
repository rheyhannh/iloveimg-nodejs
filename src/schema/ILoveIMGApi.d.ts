import { z } from 'zod';
import { ToolTypesInfered } from './Tool';
import { TaskStatusTypesInfered } from './Task';

export type ListTasksOptionsInfered = {
	/** Results are offered paginated in 50 results per page. */
	page?: number;
	/** Filter tasks by tool type. */
	tool?: ToolTypesInfered;
	/** Filter tasks by task status type. */
	status?: TaskStatusTypesInfered;
	/** Filter tasks by `custom_int`. */
	custom_int?: number;
	/**
	 * Enables or disables debug mode, default is `false`. When set to `true`:
	 * - No credits will be deducted from your project.
	 * - No actual processing will occur, `ILoveApi` only returns a response from your request details.
	 * - The returned data may differ from the standard response.
	 */
	debug?: boolean;
};

export declare const ListTasksOptions: z.ZodType<ListTasksOptionsInfered>;

export type ListTasksReturnTypeInfered = {
	/** Task status. */
	status: TaskStatusTypesInfered;
	/** Task status message. */
	status_message: string;
	/** Tool type. */
	tool: ToolTypesInfered;
	/**
	 * Date-like when the process started.
	 * - Example: `2025-02-04 09:36:45`
	 */
	process_start: string;
	/** Assigned `custom_int` value. This attribute is `nullable`. */
	custom_int: number | null;
	/** Assigned `custom_string` value. This attribute is `nullable`. */
	custom_string: string | null;
	/**
	 * Process duration in string.
	 * - Example: `23.258`
	 */
	timer: string;
	/** Original image file size in `bytes`. */
	filesize: number;
	/** Processed image file size in `bytes`. */
	output_filesize: number;
	/**
	 * Total image files that have already been processed.
	 * When compressed in ZIP, this matches the total files in the ZIP archive.
	 */
	output_filenumber: number;
	/**
	 * Processed image file extensions.
	 * - Example: `["jpg"]`
	 */
	output_extensions: string;
	/**
	 * Task server.
	 * - Example: `api8g.ilovepdf.com`
	 */
	server: string;
	/** Task ID. */
	task_id: string;
	/** Task total files as a `string`. */
	file_number: string;
	/**
	 * An instruction to make a request on the worker server.
	 * - Example: `Make request on worker server: api8g.ilovepdf.com`
	 */
	download_filename: string;
};

export declare const ListTasksReturnType: z.ZodType<ListTasksReturnTypeInfered>;

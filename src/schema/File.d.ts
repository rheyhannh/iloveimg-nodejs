import { z } from 'zod';

export type FileStatusInfered =
	| 'FileSuccess'
	| 'FileWaiting'
	| 'WrongPassword'
	| 'TimeOut'
	| 'ServerFileNotFound'
	| 'DamagedFile'
	| 'NoImages'
	| 'OutOfRange'
	| 'NonConformant'
	| 'UnknownError';

export declare const FileStatus: z.ZodType<FileStatusInfered>;

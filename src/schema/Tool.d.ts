import { z } from 'zod';

export type ToolTypesInfered =
	| 'convertimage'
	| 'removebackgroundimage'
	| 'upscaleimage'
	| 'watermarkimage'
	| 'compressimage'
	| 'cropimage'
	| 'resizeimage' ;

export declare const ToolTypes: z.ZodType<ToolTypesInfered>;

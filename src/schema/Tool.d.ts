import { z } from 'zod';

export type ToolTypesInfered =
	| 'convertimage'
	| 'removebackgroundimage'
	| 'upscaleimage'
	| 'watermarkimage';

export declare const ToolTypes: z.ZodType<ToolTypesInfered>;

import { SharpnessModel } from './sharpness-model';

export class SharpnessBarModel {
	levels: number[];
	handicraftLevel?: number;
	sharps: SharpnessModel[];
	empty: number;
	widthModifier: number;
	levelsMissing: number;
	tooltipTemplate: string;
	maxColorSharp?: number;
	maxLevelSharp?: number;
	sharpnessDataNeeded: boolean;
	color: string;
}

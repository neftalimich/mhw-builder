import { SharpnessModel } from './sharpness-model';

export class SharpnessBarModel {
	levels: number[];
	sharps: SharpnessModel[];
	empty: number;
	widthModifier: number;
	levelsMissing: number;
	tooltipTemplate: string;
	sharpnessDataNeeded: boolean;
	color: string;
}

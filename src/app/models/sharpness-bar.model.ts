import { SharpnessModel } from './sharpness-model';

export class SharpnessBarModel {
	levels: number[];
	sharps: SharpnessModel[];
	empty: number;
	widthModifier: number;
	levelsMissing: number;
	tooltipTemplate: string;
	maxSharp?: number;
	sharpnessDataNeeded: boolean;
	color: string;
}

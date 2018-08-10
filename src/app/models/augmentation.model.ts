import { AugmentationLevelModel } from './augmentation-level.model';

export class AugmentationModel {
	id: number;
	code: string;
	name: string;
	description: string;
	levels: AugmentationLevelModel[];
}

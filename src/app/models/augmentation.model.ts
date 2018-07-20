import { AugmentationLevelModel } from './augmentation-level.model';

export class AugmentationModel {
	id: number;
	name: string;
	description: string;
	levels: AugmentationLevelModel[];
}

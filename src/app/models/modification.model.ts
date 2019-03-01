import { ModificationLevelModel } from './modification-level.model';

export class ModificationModel {
	id: number;
	code: string;
	name: string;
	description: string;
	levels: ModificationLevelModel[];
}

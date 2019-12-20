import { SetBonusLevelModel } from './set-bonus-level.model';

export class SetBonusModel {
	id: string;
	buildId?: number;
	name: string;
	setLevels: SetBonusLevelModel[];
}

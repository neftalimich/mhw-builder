import { ModeType } from '../types/mode.type';
import { SkillModel } from './skill.model';

export class EquippedSetBonusModel {
	id: string;
	name: string;
	equippedCount: number;
	details: EquippedSetBonusDetailModel[];

	weaponCount: number;
	headCount: number;
	chestCount: number;
	armsCount: number;
	waistCount: number;
	legsCount: number;

	constructor() {
		this.weaponCount = 0;
		this.headCount = 0;
		this.chestCount = 0;
		this.armsCount = 0;
		this.waistCount = 0;
		this.legsCount = 0;
	}
}
export class EquippedSetBonusDetailModel {
	requiredCount: number;
	skill: SkillModel;
	mode: ModeType;

	constructor() {
		this.mode = ModeType.Active;
	}
}


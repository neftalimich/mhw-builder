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
	handsCount: number;
	legsCount: number;
	feetCount: number;

	constructor() {
		this.weaponCount = 0;
		this.headCount = 0;
		this.chestCount = 0;
		this.handsCount = 0;
		this.legsCount = 0;
		this.feetCount = 0;
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


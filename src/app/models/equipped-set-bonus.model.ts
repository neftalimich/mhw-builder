import { EquippedSetBonusDetailModel } from './equipped-set-bonus-detail.model';

export class EquippedSetBonusModel {
	id: string;
	name: string;
	equippedCount: number;
	details: EquippedSetBonusDetailModel[];

	headCount: number;
	chestCount: number;
	handsCount: number;
	legsCount: number;
	feetCount: number;

	constructor() {
		this.headCount = 0;
		this.chestCount = 0;
		this.handsCount = 0;
		this.legsCount = 0;
		this.feetCount = 0;
	}
}

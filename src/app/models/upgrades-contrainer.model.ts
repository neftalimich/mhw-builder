import { AugmentationType } from "../types/augmentation.type";

export class UpgradesContainerModel {
	slots: number;
	used: number;
	hasCustomUpgrades: boolean;
	upgradeDetails: UpgradeDetailModel[];
	customUpgrades: string[];

	constructor() {
		this.slots = 0;
		this.used = 0;
		this.hasCustomUpgrades = false;
		this.upgradeDetails = new Array<UpgradeDetailModel>();
		this.customUpgrades = ['', '', '', '', ''];
	}
}

export class UpgradeDetailModel {
	type: AugmentationType;
	level: number;
	requiredSlots: number;
	totalSlots: number;

	passiveAttack: number;
	passiveAffinity: number;
	passiveDefense: number;
	healOnHitPercent: number;
	passiveElement: number;
	passiveAilment: number;

	constructor() {
		this.passiveAttack = 0;
		this.passiveAffinity = 0;
		this.passiveDefense = 0;
		this.healOnHitPercent = 0;
		this.passiveElement = 0;
		this.passiveAilment = 0;
	}
}

import { AugmentationType } from '../types/augmentation.type';
import { UpgradeLevelModel } from './upgrade.model';

export class UpgradeContainerModel {
	slots: number;
	used: number;
	hasCustomUpgrades: boolean;
	upgradeDetails: UpgradeLevelModel[];
	customUpgrades: string[];

	constructor() {
		this.slots = 0;
		this.used = 0;
		this.hasCustomUpgrades = false;
		this.upgradeDetails = new Array<UpgradeLevelModel>();
		this.customUpgrades = ['', '', '', '', ''];
	}
}

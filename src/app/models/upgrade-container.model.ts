import { WeaponType } from '../types/weapon.type';
import { UpgradeLevelModel } from './upgrade.model';

export class UpgradeContainerModel {
	slots: number;
	used: number;
	hasCustomUpgrades: boolean;
	upgradeDetails: UpgradeLevelModel[];
	customUpgradeIds: number[];
	customUpgradeValues: number[];
	weaponType: WeaponType;

	constructor() {
		this.slots = 0;
		this.used = 0;
		this.hasCustomUpgrades = false;
		this.upgradeDetails = new Array<UpgradeLevelModel>();
		this.customUpgradeIds = [0, 0, 0, 0, 0, 0, 0];
		this.customUpgradeValues = [0, 0, 0, 0, 0, 0, 0];
	}
}

import { Component, Input, OnInit } from '@angular/core';
import { UpgradeContainerModel } from '../../models/upgrade-container.model';
import { UpgradeLevelModel, UpgradeModel } from '../../models/upgrade.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { WeaponType } from '../../types/weapon.type';

@Component({
	selector: 'mhw-builder-upgrades-list',
	templateUrl: './upgrades-list.component.html',
	styleUrls: ['./upgrades-list.component.scss']
})
export class UpgradesListComponent implements OnInit {
	upgrades: UpgradeModel[];
	customUpgrades: any[];
	weaponIndex: number;

	private _upgradeContainer: UpgradeContainerModel;

	@Input()
	set upgradeContainer(upgradeContainer: UpgradeContainerModel) {
		if (upgradeContainer) {
			this._upgradeContainer = JSON.parse(JSON.stringify(upgradeContainer));

			if (this.upgradeContainer.upgradeDetails && this.upgradeContainer.upgradeDetails.length == 0) {
				for (const cUpg of this.upgrades) {
					const newDetail = new UpgradeLevelModel();
					newDetail.type = cUpg.type;
					newDetail.level = 0;
					newDetail.requiredSlots = 0;
					newDetail.totalSlots = 0;
					this.upgradeContainer.upgradeDetails.push(newDetail);
				}
			}

			this.weaponIndex = 0;
			for (const item in WeaponType) {
				if (isNaN(Number(item))) {
					if (item == upgradeContainer.weaponType) {
						break;
					} else {
						this.weaponIndex += 1;
					}
				}
			}

			this.customUpgrades = [];
			for (const cUpg of this.upgrades) {
				if (cUpg.WeaponCustomUpgrades) {
					const levels = cUpg.WeaponCustomUpgrades[this.weaponIndex];
					const maximum = levels.reduce((acumulator, currentValue) => acumulator + currentValue, 0);
					if (maximum > 0) {
						this.customUpgrades.push({
							id: cUpg.id,
							type: cUpg.type,
							maximum: maximum,
							values: cUpg.WeaponCustomUpgrades[this.weaponIndex]
						});
					}
				}
			}

			this.verifyUpgrades();
		}
	}
	get upgradeContainer(): UpgradeContainerModel { return this._upgradeContainer; }

	constructor(
		private dataService: DataService,
		private slotService: SlotService
	) {
		this.upgrades = this.dataService.getUpgrades();
	}

	ngOnInit(): void { }

	selectUpgrade() {
		const newUpg = JSON.parse(JSON.stringify(this.upgradeContainer));
		this.slotService.selectUpgradeContainer(newUpg);
	}

	verifyUpgrades() {
		if (this.upgradeContainer.used > this.upgradeContainer.slots) {
			for (let i = 0; i < this.upgradeContainer.upgradeDetails.length; i++) {
				const detail = this.upgradeContainer.upgradeDetails[i];
				if (detail.level > 0) {
					this.selectUpgLevel(i, detail.level);
					this.verifyUpgrades();
					break;
				}
			}
		}
	}

	selectUpgLevel(augIndex: number, level: number) {
		const auxUpg = this.upgradeContainer.upgradeDetails[augIndex];
		const auxLevel = this.upgrades[augIndex].levels[level - 1];
		if (auxUpg.level == level) {
			auxUpg.level = level - 1;
			if (level > 1) {
				const auxDown = this.upgrades[augIndex].levels[level - 2];
				this.upgradeContainer.used -= auxUpg.totalSlots;
				this.upgradeContainer.used += auxDown.totalSlots;

				this.updatePassiveStats(auxUpg, auxDown);
			} else {
				this.upgradeContainer.used -= auxUpg.totalSlots;

				this.clearPassiveStats(auxUpg);
			}
		} else {
			if (this.upgradeContainer.used - auxUpg.totalSlots + auxLevel.totalSlots <= this.upgradeContainer.slots) {
				this.upgradeContainer.used -= auxUpg.totalSlots;
				this.upgradeContainer.used += auxLevel.totalSlots;

				auxUpg.level = level;
				this.updatePassiveStats(auxUpg, auxLevel);
			}
		}
	}

	updatePassiveStats(aug: UpgradeLevelModel, level: UpgradeLevelModel) {
		aug.requiredSlots = level.requiredSlots;
		aug.totalSlots = level.totalSlots;

		aug.passiveAttack = level.passiveAttack;
		aug.passiveAffinity = level.passiveAffinity;
		aug.passiveDefense = level.passiveDefense;
		aug.healOnHitPercent = level.healOnHitPercent;
		aug.passiveElement = level.passiveElement;
		aug.passiveAilment = level.passiveAilment;

		aug.description = level.description;
	}

	clearPassiveStats(aug: UpgradeLevelModel) {
		aug.requiredSlots = 0;
		aug.totalSlots = 0;

		aug.passiveAttack = 0;
		aug.passiveAffinity = 0;
		aug.passiveDefense = 0;
		aug.healOnHitPercent = 0;
		aug.passiveElement = 0;
		aug.passiveAilment = 0;
	}

	getHexagonClass(upgIndex: number, levelIndex: number) {
		const auxUpg = this.upgradeContainer.upgradeDetails[upgIndex];
		const auxLevel = this.upgrades[upgIndex].levels[levelIndex];

		if (levelIndex + 1 <= auxUpg.level) {
			return 'hex-o-' + (upgIndex + 1);
		} else {
			if (this.upgradeContainer.used - auxUpg.totalSlots + auxLevel.totalSlots <= this.upgradeContainer.slots) {
				return 'hex-' + (upgIndex + 1);
			} else {
				return 'hex-' + (upgIndex + 1);
			}
		}
	}

	getBackgroundColor(upgIndex: number, levelIndex: number) {
		const auxUpg = this.upgradeContainer.upgradeDetails[upgIndex];
		const auxLevel = this.upgrades[upgIndex].levels[levelIndex];

		if (levelIndex + 1 <= auxUpg.level) {
			return '#525252';
		} else {
			if (this.upgradeContainer.used - auxUpg.totalSlots + auxLevel.totalSlots <= this.upgradeContainer.slots) {
				return '';
			} else {
				return '#1E1E1E';
			}
		}
	}

	selectCustomUpg(augId: number, levelIndex: number, level: number) {
		if (level > 0) {
			if (this.upgradeContainer.customUpgradeIds[levelIndex] == augId) {
				this.upgradeContainer.customUpgradeIds[levelIndex] = 0;
				this.upgradeContainer.customUpgradeValues[levelIndex] = 0;
			} else {
				this.upgradeContainer.customUpgradeIds[levelIndex] = augId;
				this.upgradeContainer.customUpgradeValues[levelIndex] = level;
			}
		}
	}

	countCustomUpg(augId: number) {
		return this.upgradeContainer.customUpgradeIds.filter(customId => customId == augId).length;
	}

	sumCustomUpg(augId: number) {
		let result = 0;
		const customUpgrade = this.customUpgrades.find(x => x.id == augId);
		for (const [i, customId] of this.upgradeContainer.customUpgradeIds.entries()) {
			if (customId == augId) {
				result += customUpgrade.values[i];
			}
		}
		return result;
	}


	getCustomColor(augType: string) {
		if (augType == 'Attack') {
			return '0';
		} else if (augType == 'Affinity') {
			return '1';
		} else if (augType == 'Defense') {
			return '2';
		} else if (augType == 'Element') {
			return '5';
		} else {
			return 'gray';
		}
	}
}

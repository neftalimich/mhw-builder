import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UpgradeContainerModel, UpgradeDetailModel } from '../../models/upgrade-container.model';
import { UpgradeLevelModel, UpgradeModel } from '../../models/upgrade.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { AugmentationType } from '../../types/augmentation.type';

@Component({
	selector: 'mhw-builder-upgrades-list',
	templateUrl: './upgrades-list.component.html',
	styleUrls: ['./upgrades-list.component.scss']
})
export class UpgradesListComponent implements OnInit {
	upgrades: UpgradeModel[];

	private _upgradeContainer: UpgradeContainerModel;

	@Input()
	set upgradeContainer(upgradeContainer: UpgradeContainerModel) {
		if (upgradeContainer) {
			this._upgradeContainer = JSON.parse(JSON.stringify(upgradeContainer));

			this.loadUpgrades();
			if (this.upgradeContainer.upgradeDetails && this.upgradeContainer.upgradeDetails.length == 0) {
				for (const cUpg of this.upgrades) {
					const newDetail = new UpgradeDetailModel();
					newDetail.type = cUpg.type;
					newDetail.level = 0;
					newDetail.requiredSlots = 0;
					newDetail.totalSlots = 0;
					this.upgradeContainer.upgradeDetails.push(newDetail);
				}
			}
		}
	}
	get upgradeContainer(): UpgradeContainerModel { return this._upgradeContainer; }

	@Output() upgradeContainerSelected = new EventEmitter<UpgradeContainerModel>();

	constructor(
		private dataService: DataService,
		private slotService: SlotService,
		private tooltipService: TooltipService
	) {
	}

	ngOnInit(): void {
	}

	loadUpgrades() {
		this.upgrades = this.dataService.getUpgrades();
	}

	selectUpgrade() {
		const newUpg = Object.assign({}, this.upgradeContainer);
		this.slotService.selectUpgradeContainer(newUpg);
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

				this.clearPassiveStats(auxUpg, auxLevel);
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

	updatePassiveStats(aug: UpgradeDetailModel, level: UpgradeLevelModel) {
		aug.requiredSlots = level.requiredSlots;
		aug.totalSlots = level.totalSlots;

		aug.passiveAttack = level.passiveAttack;
		aug.passiveAffinity = level.passiveAffinity;
		aug.passiveDefense = level.passiveDefense;
		aug.healOnHitPercent = level.healOnHitPercent;
		aug.passiveElement = level.passiveElement;
		aug.passiveAilment = level.passiveAilment;
	}

	clearPassiveStats(aug: UpgradeDetailModel, level: UpgradeLevelModel) {
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
			return 'hex-o-' + upgIndex;
		} else {
			if (this.upgradeContainer.used - auxUpg.totalSlots + auxLevel.totalSlots <= this.upgradeContainer.slots) {
				return 'hex-' + upgIndex;
			} else {
				return 'hex-' + upgIndex;
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

	selectCustomUpg(augType: string, levelIndex: number) {
		if (this.upgradeContainer.customUpgrades[levelIndex] == augType) {
			this.upgradeContainer.customUpgrades[levelIndex] = '';
		} else {
			this.upgradeContainer.customUpgrades[levelIndex] = augType;
		}
	}

	countCustomUpg(augType: string) {
		return this.upgradeContainer.customUpgrades.filter(custom => custom == augType).length;
	}

	getCustomColor(augType: string) {
		if (augType == 'Attack') {
			return '0';
		} else if (augType == 'Affinity') {
			return '1';
		} else if (augType == 'Element') {
			return '5';
		} else {
			return 'gray';
		}
	}
}

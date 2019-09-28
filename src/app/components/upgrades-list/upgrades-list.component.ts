import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UpgradeContainerModel, UpgradeDetailModel } from '../../models/upgrade-container.model';
import { UpgradeLevelModel, UpgradeModel } from '../../models/upgrade.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';

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
			this._upgradeContainer = upgradeContainer;

			this.loadItems();
			if (this.upgradeContainer.upgradeDetails && this.upgradeContainer.upgradeDetails.length == 0) {
				for (const cAug of this.upgrades) {
					const newDetail = new UpgradeDetailModel();
					newDetail.type = cAug.type;
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

	loadItems() {
		this.upgrades = this.dataService.getUpgrades();
	}

	selectUpgrade() {
		const newUpg = Object.assign({}, this.upgradeContainer);
		this.slotService.selectUpgradeContainer(newUpg);
	}

	selectAugLevel(augIndex: number, level: number) {
		const auxAug = this.upgradeContainer.upgradeDetails[augIndex];
		const auxLevel = this.upgrades[augIndex].levels[level - 1];
		if (auxAug.level == level) {
			auxAug.level = level - 1;
			if (level > 1) {
				const auxDown = this.upgrades[augIndex].levels[level - 2];
				this.upgradeContainer.used -= auxAug.totalSlots;
				this.upgradeContainer.used += auxDown.totalSlots;

				this.updatePassiveStats(auxAug, auxDown);
			} else {
				this.upgradeContainer.used -= auxAug.totalSlots;

				this.clearPassiveStats(auxAug, auxLevel);
			}
		} else {
			if (this.upgradeContainer.used - auxAug.totalSlots + auxLevel.totalSlots <= this.upgradeContainer.slots) {
				this.upgradeContainer.used -= auxAug.totalSlots;
				this.upgradeContainer.used += auxLevel.totalSlots;

				auxAug.level = level;
				this.updatePassiveStats(auxAug, auxLevel);
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

	getHexagonClass(augIndex: number, levelIndex: number) {
		const auxAug = this.upgradeContainer.upgradeDetails[augIndex];
		const auxLevel = this.upgrades[augIndex].levels[levelIndex];

		if (levelIndex + 1 <= auxAug.level) {
			return 'hex-o-' + augIndex;
		} else {
			if (this.upgradeContainer.used - auxAug.totalSlots + auxLevel.totalSlots <= this.upgradeContainer.slots) {
				return 'hex-' + augIndex;
			} else {
				return 'hex-' + augIndex;
			}
		}
	}

	getBackgroundColor(augIndex: number, levelIndex: number) {
		const auxAug = this.upgradeContainer.upgradeDetails[augIndex];
		const auxLevel = this.upgrades[augIndex].levels[levelIndex];

		if (levelIndex + 1 <= auxAug.level) {
			return '#525252';
		} else {
			if (this.upgradeContainer.used - auxAug.totalSlots + auxLevel.totalSlots <= this.upgradeContainer.slots) {
				return '';
			} else {
				return '#1E1E1E';
			}
		}
	}
}

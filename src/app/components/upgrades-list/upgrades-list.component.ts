import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UpgradeLevelModel, UpgradeModel } from '../../models/upgrade.model';
import { UpgradeDetailModel, UpgradesContainerModel } from '../../models/upgrades-contrainer.model';
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

	private _slots: number;
	private _upgradesContainer: UpgradesContainerModel;

	@Input()
	set slots(slots: number) {
		this._slots = slots;
	}
	get slots(): number { return this._slots; }

	set upgradesContainer(upgradesContainer: UpgradesContainerModel) {
		this._upgradesContainer = upgradesContainer;
	}
	get upgradesContainer(): UpgradesContainerModel { return this._upgradesContainer; }

	@Output() upgradesContainerSelected = new EventEmitter<UpgradesContainerModel>();

	constructor(
		private dataService: DataService,
		private slotService: SlotService,
		private tooltipService: TooltipService
	) {
		this.upgradesContainer = new UpgradesContainerModel();
		this.upgradesContainer.used = 0;
		this.upgradesContainer.slots = this.slots;
		this.upgradesContainer.hasCustomUpgrades = false;
	}

	ngOnInit(): void {
		this.loadItems();
		for (let cAug of this.upgrades) {
			let newDetail = new UpgradeDetailModel();
			newDetail.type = cAug.type;
			newDetail.level = 0;
			newDetail.requiredSlots = 0;
			newDetail.totalSlots = 0;
			this.upgradesContainer.upgradeDetails.push(newDetail);
		}
	}

	loadItems() {
		this.upgrades = this.dataService.getUpgrades();
	}

	selectAugmentation() {
		const upgradesContainer = JSON.parse(JSON.stringify(this.upgradesContainer));
		this.slotService.selectUpgradesContainer(upgradesContainer);
	}

	selectAugLevel(augIndex: number, level: number) {
		let auxAug = this.upgradesContainer.upgradeDetails[augIndex];
		let auxLevel = this.upgrades[augIndex].levels[level - 1];
		if (auxAug.level == level) {
			auxAug.level = level - 1;
			if (level > 1) {
				let auxDown = this.upgrades[augIndex].levels[level - 2];
				this.upgradesContainer.used -= auxAug.totalSlots;
				this.upgradesContainer.used += auxDown.totalSlots;

				this.updatePassiveStats(auxAug, auxDown);
			} else {
				this.upgradesContainer.used -= auxAug.totalSlots;

				this.clearPassiveStats(auxAug, auxLevel);
			}
		} else {
			if (this.upgradesContainer.used - auxAug.totalSlots + auxLevel.totalSlots <= this.slots) {
				this.upgradesContainer.used -= auxAug.totalSlots;
				this.upgradesContainer.used += auxLevel.totalSlots;

				auxAug.level = level;
				this.updatePassiveStats(auxAug, auxLevel);
			}
		}
		console.log(this.upgradesContainer.upgradeDetails);
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
		let auxAug = this.upgradesContainer.upgradeDetails[augIndex];
		let auxLevel = this.upgrades[augIndex].levels[levelIndex];

		if (levelIndex + 1 <= auxAug.level) {
			return 'hex-o-' + augIndex;
		} else {
			if (this.upgradesContainer.used - auxAug.totalSlots + auxLevel.totalSlots <= this.slots) {
				return 'hex-' + augIndex;
			} else {
				return 'hex-' + augIndex;
			}
		}
	}

	getBackgroundColor(augIndex: number, levelIndex: number) {
		let auxAug = this.upgradesContainer.upgradeDetails[augIndex];
		let auxLevel = this.upgrades[augIndex].levels[levelIndex];

		if (levelIndex + 1 <= auxAug.level) {
			return '#525252';
		} else {
			if (this.upgradesContainer.used - auxAug.totalSlots + auxLevel.totalSlots <= this.slots) {
				return '';
			} else {
				return '#1E1E1E';
			}
		}
	}
}

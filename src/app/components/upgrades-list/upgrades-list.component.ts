import { Component, OnInit } from '@angular/core';
import { UpgradeModel } from '../../models/upgrade.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { PointerType } from '../../types/pointer.type';

@Component({
	selector: 'mhw-builder-upgrades-list',
	templateUrl: './upgrades-list.component.html',
	styleUrls: ['./upgrades-list.component.scss']
})
export class UpgradesListComponent implements OnInit {
	upgrades: UpgradeModel[];

	constructor(
		private dataService: DataService,
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void {
		this.loadItems();
	}

	loadItems() {
		this.upgrades = this.dataService.getUpgrades();
	}

	//selectUpgrade(upgrade: UpgradeModel) {
	//	const newUpgrade = Object.assign({}, upgrade);
	//	this.slotService.selectUpgrade(newUpgrade);
	//}

	//setTooltipUpgrade(event: PointerEvent, upgrade: UpgradeModel) {
	//	if (event.pointerType == PointerType.Mouse) {
	//		this.tooltipService.setUpgrade(upgrade);
	//	}
	//}

	//clearTooltipUpgrade() {
	//	this.tooltipService.setUpgrade(null);
	//}
}

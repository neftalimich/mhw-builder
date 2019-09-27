import { Component, OnInit } from '@angular/core';
import { UpgradeModel } from '../../models/upgrade.model';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { ItemType } from '../../types/item.type';
import { PointerType } from '../../types/pointer.type';
import { UpgradesContainerModel } from '../../models/upgrades-contrainer.model';

@Component({
	selector: 'mhw-builder-upgrade-slot',
	templateUrl: './upgrade-slot.component.html',
	styleUrls: ['./upgrade-slot.component.scss']
})
export class UpgradeSlotComponent implements OnInit {
	slotName = ItemType.Upgrade;

	upgradesContainer: UpgradesContainerModel;

	public selected: boolean;

	constructor(
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void { }

	clicked() {
		this.slotService.selectUpgradeSlot(this);
	}

	clearClicked(event: Event) {
		event.stopPropagation();
		this.slotService.clearUpgradeSlot(this);
		//this.clearTooltipUpgrade();
	}

	//setTooltipUpgrade(event: PointerEvent, upgrade: UpgradeModel) {
	//	if (event.pointerType == PointerType.Mouse) {
	//		this.tooltipService.setUpgrade(upgrade);
	//	}
	//}

	//clearTooltipUpgrade() {
	//	this.tooltipService.setUpgrade(null);
	//}
}

import { Component, Input, OnInit } from '@angular/core';
import { UpgradeContainerModel } from '../../models/upgrade-container.model';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { ItemType } from '../../types/item.type';

@Component({
	selector: 'mhw-builder-upgrade-slot',
	templateUrl: './upgrade-slot.component.html',
	styleUrls: ['./upgrade-slot.component.scss']
})
export class UpgradeSlotComponent implements OnInit {
	slotName = ItemType.Upgrade;

	@Input()
	slots: number;
	@Input()
	upgradeContainer: UpgradeContainerModel;

	public selected: boolean;

	constructor(
		private slotService: SlotService,
		private tooltipService: TooltipService
	) {
	}

	ngOnInit(): void {
	}

	clicked() {
		this.slotService.selectUpgradeSlot(this);
	}

	clearClicked(event: Event) {
		event.stopPropagation();
		this.slotService.clearUpgradeSlot(this);
	}
}

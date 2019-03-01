import { Component, OnInit } from '@angular/core';
import { ModificationModel } from 'src/app/models/modification.model';
import { SlotService } from 'src/app/services/slot.service';
import { TooltipService } from 'src/app/services/tooltip.service';
import { ItemType } from 'src/app/types/item.type';
import { PointerType } from 'src/app/types/pointer.type';

@Component({
	selector: 'mhw-builder-modification-slot',
	templateUrl: './modification-slot.component.html',
	styleUrls: ['./modification-slot.component.scss']
})
export class ModificationSlotComponent implements OnInit {
	slotName = ItemType.Modification;

	modification: ModificationModel;

	public selected: boolean;

	constructor(
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void { }

	clicked() {
		this.slotService.selectModificationSlot(this);
	}

	clearClicked(event: Event) {
		event.stopPropagation();
		this.slotService.clearModificationSlot(this);
		this.clearTooltipModification();
	}

	setTooltipModification(event: PointerEvent, modification: ModificationModel) {
		if (event.pointerType == PointerType.Mouse) {
			this.tooltipService.setModification(modification);
		}
	}

	clearTooltipModification() {
		this.tooltipService.setModification(null);
	}
}

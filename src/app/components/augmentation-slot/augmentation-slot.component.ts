import { Component, OnInit } from '@angular/core';
import { AugmentationModel } from '../../models/augmentation.model';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { PointerType } from '../../types/pointer.type';
import { ItemType } from '../../types/item.type';

@Component({
	selector: 'mhw-builder-augmentation-slot',
	templateUrl: './augmentation-slot.component.html',
	styleUrls: ['./augmentation-slot.component.scss']
})
export class AugmentationSlotComponent implements OnInit {
	slotName = ItemType.Augmentation;

	augmentation: AugmentationModel;

	public selected: boolean;

	constructor(
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void { }

	clicked() {
		this.slotService.selectAugmentationSlot(this);
	}

	clearClicked(event: Event) {
		event.stopPropagation();
		this.slotService.clearAugmentationSlot(this);
		this.clearTooltipAugmentation();
	}

	setTooltipAugmentation(event: PointerEvent, augmentation: AugmentationModel) {
		if (event.pointerType == PointerType.Mouse) {
			this.tooltipService.setAugmentation(augmentation);
		}
	}

	clearTooltipAugmentation() {
		this.tooltipService.setAugmentation(null);
	}
}

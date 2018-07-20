import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ItemModel } from '../../models/item.model';
import { TooltipService } from '../../services/tooltip.service';
import { ItemType } from '../../types/item.type';
import { DecorationSlotComponent } from '../decoration-slot/decoration-slot.component';
import { AugmentationSlotComponent } from '../augmentation-slot/augmentation-slot.component';
import { AugmentationModel } from '../../models/augmentation.model';
import { SlotService } from '../../services/slot.service';
import { PointerType } from '../../types/pointer.type';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { DataService } from '../../services/data.service';

@Component({
	selector: 'mhw-builder-item-slot',
	templateUrl: './item-slot.component.html',
	styleUrls: ['./item-slot.component.scss']
})
export class ItemSlotComponent implements OnInit {
	@Input() slotName: ItemType;

	@ViewChildren(DecorationSlotComponent) decorationSlots: QueryList<DecorationSlotComponent>;
	@ViewChildren(AugmentationSlotComponent) augmentationSlots: QueryList<AugmentationSlotComponent>;

	item: ItemModel;

	public augmentations = new Array<AugmentationModel>();
	public selected: boolean;

	constructor(
		private dataService: DataService,
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit() { }

	equipmentSlotClicked() {
		this.slotService.selectItemSlot(this);
	}

	levelDownClicked(event: Event) {
		event.stopPropagation();
		if (this.item.equippedLevel > 1) {
			this.item.equippedLevel--;
			this.slotService.updateItemLevel();
		}
	}

	levelUpClicked(event: Event) {
		event.stopPropagation();
		if (this.item.equippedLevel < this.item.levels) {
			this.item.equippedLevel++;
			this.slotService.updateItemLevel();
		}
	}

	getItemIconName(): string {
		let assetPath;

		switch (this.dataService.getEquipmentCategory(this.slotName)) {
			case EquipmentCategoryType.Armor:
				assetPath = `armor/${this.slotName.toLowerCase()}-icon`;
				break;
			case EquipmentCategoryType.Weapon:
				if (this.item) {
					assetPath = `weapons/${this.item.weaponType.toLowerCase()}-icon`;
				} else {
					assetPath = 'weapons/greatsword-icon';
				}
				break;
			case EquipmentCategoryType.Charm:
				assetPath = 'armor/charm-icon';
				break;
		}

		return `assets/images/${assetPath}.png`;
	}

	equipmentClearClicked(event: Event) {
		event.stopPropagation();
		this.slotService.clearItemSlot(this);
		this.clearTooltipItem();
	}

	setTooltipItem(event: PointerEvent) {
		if (event.pointerType == PointerType.Mouse) {
			this.tooltipService.setItem(this.item);
		}
	}

	showOnClickTooltipItem() {
		this.tooltipService.setItem(this.item);
	}

	clearTooltipItem() {
		this.tooltipService.setItem(null);
	}
}

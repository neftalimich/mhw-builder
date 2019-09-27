import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { KinsectModel } from 'src/app/models/kinsect.model';
import { ModificationModel } from 'src/app/models/modification.model';
import { AugmentationModel } from '../../models/augmentation.model';
import { ItemModel } from '../../models/item.model';
import { UpgradesContainerModel } from '../../models/upgrades-contrainer.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { ItemType } from '../../types/item.type';
import { PointerType } from '../../types/pointer.type';
import { AugmentationSlotComponent } from '../augmentation-slot/augmentation-slot.component';
import { DecorationSlotComponent } from '../decoration-slot/decoration-slot.component';
import { KinsectSlotComponent } from '../kinsect-slot/kinsect-slot.component';
import { ModificationSlotComponent } from '../modification-slot/modification-slot.component';
import { UpgradeSlotComponent } from '../upagrade-slot/upgrade-slot.component';

@Component({
	selector: 'mhw-builder-item-slot',
	templateUrl: './item-slot.component.html',
	styleUrls: ['./item-slot.component.scss']
})
export class ItemSlotComponent implements OnInit {
	@Input() slotName: ItemType;

	@ViewChildren(DecorationSlotComponent) decorationSlots: QueryList<DecorationSlotComponent>;
	@ViewChildren(AugmentationSlotComponent) augmentationSlots: QueryList<AugmentationSlotComponent>;
	@ViewChildren(UpgradeSlotComponent) upgradeSlots: QueryList<UpgradeSlotComponent>;
	@ViewChildren(ModificationSlotComponent) modificationSlots: QueryList<ModificationSlotComponent>;
	@ViewChild(KinsectSlotComponent, { static: false }) kinsectSlot: KinsectSlotComponent;

	item: ItemModel;

	public augmentations = new Array<AugmentationModel>();
	public upgradesContainer = UpgradesContainerModel;
	public modifications = new Array<ModificationModel>();
	public kinsect: KinsectModel;
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

	activeClicked(event: Event) {
		event.stopPropagation();
		this.item.active = !this.item.active;
		this.slotService.activeItemTool(this.item.itemType, this.item.active);
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
			case EquipmentCategoryType.Tool:
				assetPath = 'armor/tool-icon';
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

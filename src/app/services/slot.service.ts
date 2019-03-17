import { ChangeDetectorRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { AugmentationSlotComponent } from '../components/augmentation-slot/augmentation-slot.component';
import { DecorationSlotComponent } from '../components/decoration-slot/decoration-slot.component';
import { ItemSlotComponent } from '../components/item-slot/item-slot.component';
import { ModificationSlotComponent } from '../components/modification-slot/modification-slot.component';
import { AugmentationModel } from '../models/augmentation.model';
import { DecorationModel } from '../models/decoration.model';
import { ItemModel } from '../models/item.model';
import { ModificationModel } from '../models/modification.model';
import { SlotEventModel } from '../models/slot-event.model';
import { EquipmentCategoryType } from '../types/equipment-category.type';
import { ItemType } from '../types/item.type';
import { EquipmentService } from './equipment.service';
import { WeaponType } from '../types/weapon.type';
import { KinsectModel } from '../models/kinsect.model';

@Injectable()
export class SlotService {
	public anySlotSelected$ = new Subject<ItemSlotComponent | DecorationSlotComponent | AugmentationSlotComponent | ModificationSlotComponent>();

	public itemSelected$ = new Subject<SlotEventModel<ItemSlotComponent, ItemModel>>();
	public decorationSelected$ = new Subject<SlotEventModel<DecorationSlotComponent, DecorationModel>>();
	public augmentationSelected$ = new Subject<SlotEventModel<AugmentationSlotComponent, AugmentationModel>>();
	public modificationSelected$ = new Subject<SlotEventModel<ModificationSlotComponent, ModificationModel>>();
	public itemLevelChanged$ = new Subject();

	weaponSlot: ItemSlotComponent;
	headSlot: ItemSlotComponent;
	chestSlot: ItemSlotComponent;
	handsSlot: ItemSlotComponent;
	legsSlot: ItemSlotComponent;
	feetSlot: ItemSlotComponent;
	charmSlot: ItemSlotComponent;

	changeDetector: ChangeDetectorRef;

	selectedItemSlot: ItemSlotComponent;
	selectedDecorationSlot: DecorationSlotComponent;
	selectedAugmentationSlot: AugmentationSlotComponent;
	selectedModificationSlot: ModificationSlotComponent;

	constructor(
		private equipmentService: EquipmentService
	) { }

	initialize(
		weaponSlot: ItemSlotComponent,
		headSlot: ItemSlotComponent,
		chestSlot: ItemSlotComponent,
		handsSlot: ItemSlotComponent,
		legsSlot: ItemSlotComponent,
		feetSlot: ItemSlotComponent,
		charmSlot: ItemSlotComponent,
		changeDetector: ChangeDetectorRef
	) {
		this.weaponSlot = weaponSlot;
		this.headSlot = headSlot;
		this.chestSlot = chestSlot;
		this.handsSlot = handsSlot;
		this.legsSlot = legsSlot;
		this.feetSlot = feetSlot;
		this.charmSlot = charmSlot;
		this.changeDetector = changeDetector;
	}

	selectItemSlot(slot: ItemSlotComponent) {
		this.clearSlotSelect();
		this.selectedItemSlot = slot;

		if (this.selectedItemSlot) {
			this.selectedItemSlot.selected = true;
			this.anySlotSelected$.next(this.selectedItemSlot);
		}
	}

	selectDecorationSlot(slot: DecorationSlotComponent) {
		this.clearSlotSelect();
		this.selectedDecorationSlot = slot;

		if (this.selectedDecorationSlot) {
			this.selectedDecorationSlot.selected = true;
			this.anySlotSelected$.next(this.selectedDecorationSlot);
		}
	}

	selectAugmentationSlot(slot: AugmentationSlotComponent) {
		this.clearSlotSelect();
		this.selectedAugmentationSlot = slot;

		if (this.selectedAugmentationSlot) {
			this.selectedAugmentationSlot.selected = true;
			this.anySlotSelected$.next(this.selectedAugmentationSlot);
		}
	}

	selectModificationSlot(slot: ModificationSlotComponent) {
		this.clearSlotSelect();
		this.selectedModificationSlot = slot;

		if (this.selectedModificationSlot) {
			this.selectedModificationSlot.selected = true;
			this.anySlotSelected$.next(this.selectedModificationSlot);
		}
	}

	clearItemSlot(slot: ItemSlotComponent) {
		this.clearSlotItems(slot);

		slot.item = null;
		slot.augmentations = [];
		slot.modifications = [];
		this.itemSelected$.next({ slot: slot, equipment: null });
	}

	clearDecorationSlot(slot: DecorationSlotComponent) {
		this.equipmentService.removeDecoration(slot.decoration);
		slot.decoration = null;
		this.decorationSelected$.next({ slot: slot, equipment: null });
	}

	clearAugmentationSlot(slot: AugmentationSlotComponent) {
		this.equipmentService.removeAugmentation(slot.augmentation);
		this.applySlotAugmentation();
		slot.augmentation = null;
		this.augmentationSelected$.next({ slot: slot, equipment: null });
	}

	clearModificationSlot(slot: ModificationSlotComponent) {
		this.equipmentService.removeModification(slot.modification);
		slot.modification = null;
		this.modificationSelected$.next({ slot: slot, equipment: null });
	}

	selectItem(item: ItemModel) {
		if (this.selectedItemSlot) {
			this.clearSlotItems(this.selectedItemSlot);

			if (!item.equippedLevel && item.itemType == ItemType.Charm) {
				item.equippedLevel = item.levels;
			}

			this.equipmentService.addItem(item);
			this.selectedItemSlot.item = item;

			if (item.equipmentCategory == EquipmentCategoryType.Weapon) {
				if (item.rarity == 6) {
					this.selectedItemSlot.augmentations = [
						new AugmentationModel(),
						new AugmentationModel(),
						new AugmentationModel()
					];
				} else if (item.rarity == 7) {
					this.selectedItemSlot.augmentations = [
						new AugmentationModel(),
						new AugmentationModel()
					];
				} else if (item.rarity == 8) {
					this.selectedItemSlot.augmentations = [
						new AugmentationModel()
					];
				} else {
					this.selectedItemSlot.augmentations = [];
				}

				if (item.weaponType == WeaponType.LightBowgun || item.weaponType == WeaponType.HeavyBowgun) {
					this.selectedItemSlot.modifications = [
						new ModificationModel(),
						new ModificationModel(),
						new ModificationModel()
					];
				} else {
					this.selectedItemSlot.modifications = [];
				}
			}

			this.itemSelected$.next({ slot: this.selectedItemSlot, equipment: item });
		}
	}

	selectDecoration(decoration: DecorationModel) {
		if (this.selectedDecorationSlot) {
			if (this.selectedDecorationSlot.decoration) {
				this.equipmentService.removeDecoration(this.selectedDecorationSlot.decoration);
			}

			decoration.itemId = this.selectedDecorationSlot.itemId;
			decoration.itemType = this.selectedDecorationSlot.itemType;
			this.equipmentService.addDecoration(decoration);
			this.selectedDecorationSlot.decoration = decoration;
			this.decorationSelected$.next({ slot: this.selectedDecorationSlot, equipment: decoration });
		}
	}

	selectAugmentation(augmentation: AugmentationModel) {
		if (this.selectedAugmentationSlot) {
			if (this.selectedAugmentationSlot.augmentation) {
				this.equipmentService.removeAugmentation(this.selectedAugmentationSlot.augmentation);
			}

			this.equipmentService.addAugmentation(augmentation);
			this.applySlotAugmentation();
			this.selectedAugmentationSlot.augmentation = augmentation;
			this.augmentationSelected$.next({ slot: this.selectedAugmentationSlot, equipment: augmentation });
		}
	}

	selectModification(modification: ModificationModel) {
		if (this.selectedModificationSlot) {
			if (this.selectedModificationSlot.modification) {
				this.equipmentService.removeModification(this.selectedModificationSlot.modification);
			}

			this.equipmentService.addModification(modification);
			this.selectedModificationSlot.modification = modification;
			this.modificationSelected$.next({ slot: this.selectedModificationSlot, equipment: modification });
		}
	}

	updateItemLevel() {
		this.itemLevelChanged$.next();
		this.equipmentService.updateItemLevel();
	}

	private applySlotAugmentation() {
		const slotAugs = _.filter(this.equipmentService.augmentations, aug => aug.id == 4);
		const augDecorationSlot = _.find(this.weaponSlot.item.slots, slot => slot.augmentation);

		if (slotAugs && slotAugs.length) {
			this.changeDetector.detectChanges();

			if (augDecorationSlot) {
				augDecorationSlot.level = slotAugs[0].levels[slotAugs.length - 1].slotLevel;
				const decoSlot = this.weaponSlot.decorationSlots.last;
				if (decoSlot && decoSlot.decoration && augDecorationSlot.level < decoSlot.decoration.level) {
					this.clearDecorationSlot(decoSlot);
				}
			} else {
				if (!this.weaponSlot.item.slots) {
					this.weaponSlot.item.slots = [];
				}
				this.weaponSlot.item.slots.push({ level: slotAugs[0].levels[slotAugs.length - 1].slotLevel, augmentation: true });
			}
		} else {
			if (_.some(this.weaponSlot.item.slots, decorationSlot => decorationSlot.augmentation)) {
				this.weaponSlot.item.slots = _.reject(this.weaponSlot.item.slots, decorationSlot => decorationSlot === augDecorationSlot);
				this.equipmentService.removeDecoration(this.weaponSlot.decorationSlots.last.decoration);
			}
		}
	}

	private clearSlotItems(slot: ItemSlotComponent) {
		this.equipmentService.removeItem(slot.item);

		slot.decorationSlots.forEach(ds => {
			this.equipmentService.removeDecoration(ds.decoration);
		});

		slot.augmentationSlots.forEach(as => {
			this.equipmentService.removeAugmentation(as.augmentation);
		});

		slot.modificationSlots.forEach(md => {
			this.equipmentService.removeModification(md.modification);
		});
	}

	private clearSlotSelect() {
		if (this.selectedItemSlot) {
			this.selectedItemSlot.selected = false;
		}

		if (this.selectedDecorationSlot) {
			this.selectedDecorationSlot.selected = false;
		}

		if (this.selectedAugmentationSlot) {
			this.selectedAugmentationSlot.selected = false;
		}

		if (this.selectedModificationSlot) {
			this.selectedModificationSlot.selected = false;
		}

		this.selectedItemSlot = null;
		this.selectedDecorationSlot = null;
		this.selectedAugmentationSlot = null;
		this.selectedModificationSlot = null;
	}
}

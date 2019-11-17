import { ChangeDetectorRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { AugmentationSlotComponent } from '../components/augmentation-slot/augmentation-slot.component';
import { DecorationSlotComponent } from '../components/decoration-slot/decoration-slot.component';
import { ItemSlotComponent } from '../components/item-slot/item-slot.component';
import { KinsectSlotComponent } from '../components/kinsect-slot/kinsect-slot.component';
import { ModificationSlotComponent } from '../components/modification-slot/modification-slot.component';
import { UpgradeSlotComponent } from '../components/upagrade-slot/upgrade-slot.component';
import { AugmentationModel } from '../models/augmentation.model';
import { DecorationModel } from '../models/decoration.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { ModificationModel } from '../models/modification.model';
import { SlotEventModel } from '../models/slot-event.model';
import { UpgradeContainerModel } from '../models/upgrade-container.model';
import { EquipmentCategoryType } from '../types/equipment-category.type';
import { ItemType } from '../types/item.type';
import { WeaponType } from '../types/weapon.type';
import { EquipmentService } from './equipment.service';

@Injectable()
export class SlotService {
	public anySlotSelected$ =
		new Subject<ItemSlotComponent | DecorationSlotComponent | AugmentationSlotComponent | UpgradeSlotComponent | ModificationSlotComponent | KinsectSlotComponent>();

	public itemSelected$ = new Subject<SlotEventModel<ItemSlotComponent, ItemModel>>();
	public itemSelectedNew$ = new Subject<SlotEventModel<ItemSlotComponent, ItemModel>>();
	public decorationSelected$ = new Subject<SlotEventModel<DecorationSlotComponent, DecorationModel>>();
	public augmentationSelected$ = new Subject<SlotEventModel<AugmentationSlotComponent, AugmentationModel>>();
	public upgradeSelected$ = new Subject<SlotEventModel<UpgradeSlotComponent, UpgradeContainerModel>>();
	public modificationSelected$ = new Subject<SlotEventModel<ModificationSlotComponent, ModificationModel>>();
	public kinsectSelected$ = new Subject<SlotEventModel<KinsectSlotComponent, KinsectModel>>();
	public itemLevelChanged$ = new Subject();
	public itemActiveChanged$ = new Subject();
	public weaponSlotSelected$ = new Subject();
	public armorSlotSelected$ = new Subject();

	weaponSlot: ItemSlotComponent;
	headSlot: ItemSlotComponent;
	chestSlot: ItemSlotComponent;
	handsSlot: ItemSlotComponent;
	legsSlot: ItemSlotComponent;
	feetSlot: ItemSlotComponent;
	charmSlot: ItemSlotComponent;
	tool1Slot: ItemSlotComponent;
	tool2Slot: ItemSlotComponent;

	changeDetector: ChangeDetectorRef;

	selectedItemSlot: ItemSlotComponent;
	selectedDecorationSlot: DecorationSlotComponent;
	selectedAugmentationSlot: AugmentationSlotComponent;
	selectedUpgradeSlot: UpgradeSlotComponent;
	selectedModificationSlot: ModificationSlotComponent;
	selectedKinsectSlot: KinsectSlotComponent;

	onlyIceborne: boolean;

	constructor(
		private equipmentService: EquipmentService
	) {
		this.onlyIceborne = true;
	}

	initialize(
		weaponSlot: ItemSlotComponent,
		headSlot: ItemSlotComponent,
		chestSlot: ItemSlotComponent,
		handsSlot: ItemSlotComponent,
		legsSlot: ItemSlotComponent,
		feetSlot: ItemSlotComponent,
		charmSlot: ItemSlotComponent,
		tool1Slot: ItemSlotComponent,
		tool2Slot: ItemSlotComponent,
		changeDetector: ChangeDetectorRef
	) {
		this.weaponSlot = weaponSlot;
		this.headSlot = headSlot;
		this.chestSlot = chestSlot;
		this.handsSlot = handsSlot;
		this.legsSlot = legsSlot;
		this.feetSlot = feetSlot;
		this.charmSlot = charmSlot;
		this.tool1Slot = tool1Slot;
		this.tool2Slot = tool2Slot;
		this.changeDetector = changeDetector;
	}

	selectItemSlot(slot: ItemSlotComponent) {
		this.clearSlotSelect();
		this.selectedItemSlot = slot;

		if (this.selectedItemSlot) {
			this.selectedItemSlot.selected = true;
			this.anySlotSelected$.next(this.selectedItemSlot);
			if (this.selectedItemSlot && this.selectedItemSlot.item) {
				if (this.selectedItemSlot.item.equipmentCategory == EquipmentCategoryType.Weapon) {
					this.weaponSlotSelected$.next();
				} else if (this.selectedItemSlot.item.equipmentCategory == EquipmentCategoryType.Armor) {
					this.armorSlotSelected$.next();
				}
			}
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

	selectUpgradeSlot(slot: UpgradeSlotComponent) {
		this.clearSlotSelect();
		this.selectedUpgradeSlot = slot;

		if (this.selectedUpgradeSlot) {
			this.selectedUpgradeSlot.selected = true;
			this.anySlotSelected$.next(this.selectedUpgradeSlot);
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

	selectKinsectSlot(slot: KinsectSlotComponent) {
		this.clearSlotSelect();
		this.selectedKinsectSlot = slot;

		if (this.selectedKinsectSlot) {
			this.selectedKinsectSlot.selected = true;
			this.anySlotSelected$.next(this.selectedKinsectSlot);
		}
	}

	clearItemSlot(slot: ItemSlotComponent) {
		this.clearSlotItems(slot);

		slot.item = null;
		slot.augmentations = [];
		slot.modifications = [];
		if (slot.upgradeContainer) {
			slot.upgradeContainer.slots = 0;
			slot.upgradeContainer.used = 0;
			slot.upgradeContainer.hasCustomUpgrades = false;
			this.clearUpgradeContainer(slot.upgradeContainer);
			this.equipmentService.upgradeContainer = slot.upgradeContainer;
		}
		slot.kinsect = null;
		this.itemSelected$.next({ slot: slot, equipment: null });
	}
	clearArmorSlot(slot: ItemSlotComponent) {
		this.clearSlotItems(slot);

		slot.item = null;
		this.itemSelectedNew$.next({ slot: slot, equipment: null });
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

	clearUpgradeSlot(slot: UpgradeSlotComponent) {
		this.equipmentService.removeUpgrade();
		this.applySlotUpgrade(0);
		if (slot.upgradeContainer) {
			slot.upgradeContainer.used = 0;
			slot.upgradeContainer.hasCustomUpgrades = false;
			this.clearUpgradeContainer(slot.upgradeContainer);
		}
		this.upgradeSelected$.next({ slot: slot, equipment: null });
	}

	clearUpgradeContainer(upgradeContainer: UpgradeContainerModel) {
		for (const detail of upgradeContainer.upgradeDetails) {
			detail.level = 0;
			detail.totalSlots = 0;
			detail.requiredSlots = 0;

			detail.passiveAttack = 0;
			detail.passiveAffinity = 0;
			detail.passiveDefense = 0;
			detail.slotLevel = 0;
			detail.healOnHitPercent = 0;
			detail.passiveElement = 0;
			detail.passiveAilment = 0;
		}
		upgradeContainer.customUpgrades = ['', '', '', '', '', ''];
	}

	clearModificationSlot(slot: ModificationSlotComponent) {
		this.equipmentService.removeModification(slot.modification);
		slot.modification = null;
		this.modificationSelected$.next({ slot: slot, equipment: null });
	}

	clearKinsectSlot(slot: KinsectSlotComponent) {
		this.equipmentService.removeKinsect();
		slot.kinsect = null;
		this.kinsectSelected$.next({ slot: slot, equipment: null });
	}

	selectItem(item: ItemModel, updateStats: boolean = true) {
		if (this.selectedItemSlot) {
			this.clearSlotItems(this.selectedItemSlot);

			if (!item.equippedLevel && item.itemType == ItemType.Charm) {
				item.equippedLevel = item.levels;
			}
			if (item.itemType == ItemType.Tool1 || item.itemType == ItemType.Tool2) {
				item.active = false;
			} else {
				item.active = true;
			}

			this.equipmentService.addItem(item, updateStats);
			this.selectedItemSlot.item = item;

			if (item.equipmentCategory == EquipmentCategoryType.Weapon) {
				if (this.selectedItemSlot.upgradeSlot) {
					this.clearUpgradeSlot(this.selectedItemSlot.upgradeSlot);
				}
				if (this.selectedItemSlot.upgradeContainer) {
					this.clearUpgradeContainer(this.selectedItemSlot.upgradeContainer);
				} else {
					this.selectedItemSlot.upgradeContainer = new UpgradeContainerModel();
				}
				this.selectedItemSlot.upgradeContainer.slots = 0;
				this.selectedItemSlot.upgradeContainer.hasCustomUpgrades = item.hasCustomUpgrades ? true : false;
				this.selectedItemSlot.upgradeContainer.weaponType = item.weaponType;
				this.selectedItemSlot.augmentations = [];
				if (this.selectedItemSlot.upgradeSlot && this.selectedItemSlot.upgradeContainer) {
					this.selectedItemSlot.upgradeSlot.upgradeContainer = this.selectedItemSlot.upgradeContainer;
				}

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
				} else if (item.rarity == 10) {
					this.selectedItemSlot.upgradeContainer.slots = 9;
				} else if (item.rarity == 11) {
					this.selectedItemSlot.upgradeContainer.slots = 6;
				} else if (item.rarity == 12) {
					this.selectedItemSlot.upgradeContainer.slots = 5;
				}

				this.selectedItemSlot.kinsect = null;
				this.selectedItemSlot.modifications = [];
				switch (item.weaponType) {
					case WeaponType.InsectGlaive:
						this.selectedItemSlot.kinsect = new KinsectModel();
						break;
					case WeaponType.HeavyBowgun:
						this.selectedItemSlot.modifications = [
							new ModificationModel(),
							new ModificationModel(),
							new ModificationModel()
						];
						if (item.rarity >= 10) {
							this.selectedItemSlot.modifications.push(new ModificationModel());
						}
						break;
					case WeaponType.LightBowgun:
						this.selectedItemSlot.modifications = [
							new ModificationModel(),
							new ModificationModel(),
							new ModificationModel()
						];
						if (item.rarity >= 10) {
							this.selectedItemSlot.modifications.push(new ModificationModel());
							this.selectedItemSlot.modifications.push(new ModificationModel());
						}
						break;
					default:
						break;
				}
			}

			if (updateStats) {
				this.itemSelected$.next({ slot: this.selectedItemSlot, equipment: item });
			}
		}
	}

	selectArmorItemByType(item: ItemModel, closeModal?: boolean, updateStats: boolean = true) {
		let slotAux: ItemSlotComponent;
		switch (item.itemType) {
			case ItemType.Head:
				slotAux = this.headSlot;
				break;
			case ItemType.Chest:
				slotAux = this.chestSlot;
				break;
			case ItemType.Hands:
				slotAux = this.handsSlot;
				break;
			case ItemType.Legs:
				slotAux = this.legsSlot;
				break;
			case ItemType.Feet:
				slotAux = this.feetSlot;
				break;
			default:
				break;
		}
		let currentId = 0;
		if (slotAux.item) {
			currentId = slotAux.item.id;
		}
		if (currentId != item.id) {
			this.clearSlotItems(slotAux);
			this.equipmentService.addItem(item, updateStats);
			slotAux.item = item;
			if (closeModal) {
				this.itemSelected$.next({ slot: slotAux, equipment: item });
			} else {
				this.itemSelectedNew$.next({ slot: slotAux, equipment: item });
			}
		} else {
			this.clearArmorSlot(slotAux);
		}
	}

	selectDecoration(decoration: DecorationModel, updateStats: boolean = true) {
		if (this.selectedDecorationSlot) {
			if (this.selectedDecorationSlot.decoration) {
				this.equipmentService.removeDecoration(this.selectedDecorationSlot.decoration);
			}

			decoration.itemId = this.selectedDecorationSlot.itemId;
			decoration.itemType = this.selectedDecorationSlot.itemType;
			this.equipmentService.addDecoration(decoration, updateStats);
			this.selectedDecorationSlot.decoration = decoration;
			this.decorationSelected$.next({ slot: this.selectedDecorationSlot, equipment: decoration });
		}
	}

	selectAugmentation(augmentation: AugmentationModel, updateStats: boolean = true) {
		if (this.selectedAugmentationSlot) {
			if (this.selectedAugmentationSlot.augmentation) {
				this.equipmentService.removeAugmentation(this.selectedAugmentationSlot.augmentation);
			}

			this.equipmentService.addAugmentation(augmentation, updateStats);
			this.applySlotAugmentation();
			this.selectedAugmentationSlot.augmentation = augmentation;
			this.augmentationSelected$.next({ slot: this.selectedAugmentationSlot, equipment: augmentation });
		}
	}

	selectUpgradeContainer(upgradeContainer: UpgradeContainerModel, updateStats: boolean = true) {
		if (this.selectedUpgradeSlot) {
			if (this.selectedUpgradeSlot.upgradeContainer) {
				this.equipmentService.removeUpgrade();
			}

			this.equipmentService.addUpgrade(upgradeContainer, updateStats);

			if (upgradeContainer.upgradeDetails.length > 0) {
				this.applySlotUpgrade(upgradeContainer.upgradeDetails[3].level);
			} else {
				this.applySlotUpgrade(0);
			}
			this.selectedUpgradeSlot.upgradeContainer = upgradeContainer;
			this.upgradeSelected$.next({ slot: this.selectedUpgradeSlot, equipment: upgradeContainer });
		}
	}

	selectModification(modification: ModificationModel, updateStats: boolean = true) {
		if (this.selectedModificationSlot) {
			if (this.selectedModificationSlot.modification) {
				this.equipmentService.removeModification(this.selectedModificationSlot.modification);
			}

			this.equipmentService.addModification(modification);
			this.selectedModificationSlot.modification = modification;
			this.modificationSelected$.next({ slot: this.selectedModificationSlot, equipment: modification });
		}
	}

	selectKinsect(kinsect: KinsectModel, updateStats: boolean = true) {
		if (this.selectedKinsectSlot) {
			if (this.selectedKinsectSlot.kinsect) {
				this.equipmentService.removeKinsect();
			}
			this.equipmentService.addKinsect(kinsect, updateStats);
			this.selectedKinsectSlot.kinsect = kinsect;
			this.kinsectSelected$.next({ slot: this.selectedKinsectSlot, equipment: kinsect });
		}
	}

	updateItemLevel() {
		this.itemLevelChanged$.next();
		this.equipmentService.updateItemLevel();
	}

	activeItemTool(itemType: ItemType, active: boolean) {
		if (active) {
			if (itemType == ItemType.Tool1 && this.tool2Slot.item) {
				this.tool2Slot.item.active = false;
			}
			if (itemType == ItemType.Tool2 && this.tool1Slot.item) {
				this.tool1Slot.item.active = false;
			}
		}
		this.itemActiveChanged$.next();
		this.equipmentService.updateItemActive();
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

	private applySlotUpgrade(slotLevel: number) {
		const augDecorationSlot = _.find(this.weaponSlot.item.slots, slot => slot.augmentation);

		if (slotLevel > 0) {
			this.changeDetector.detectChanges();
			if (augDecorationSlot) {
				augDecorationSlot.level = slotLevel;
				const decoSlot = this.weaponSlot.decorationSlots.last;
				if (decoSlot && decoSlot.decoration && augDecorationSlot.level < decoSlot.decoration.level) {
					this.clearDecorationSlot(decoSlot);
				}
			} else {
				if (!this.weaponSlot.item.slots) {
					this.weaponSlot.item.slots = [];
				}
				this.weaponSlot.item.slots.push({ level: slotLevel, augmentation: true });
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

		if (this.selectedUpgradeSlot) {
			this.selectedUpgradeSlot.selected = false;
		}

		if (this.selectedModificationSlot) {
			this.selectedModificationSlot.selected = false;
		}

		if (this.selectedKinsectSlot) {
			this.selectedKinsectSlot.selected = false;
		}

		this.selectedItemSlot = null;
		this.selectedDecorationSlot = null;
		this.selectedAugmentationSlot = null;
		this.selectedUpgradeSlot = null;
		this.selectedModificationSlot = null;
		this.selectedKinsectSlot = null;
	}
}

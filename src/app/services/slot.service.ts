import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AugmentationSlotComponent } from '../components/augmentation-slot/augmentation-slot.component';
import { AwakeningSlotComponent } from '../components/awakening-slot/awakening-slot.component';
import { DecorationSlotComponent } from '../components/decoration-slot/decoration-slot.component';
import { ItemSlotComponent } from '../components/item-slot/item-slot.component';
import { KinsectSlotComponent } from '../components/kinsect-slot/kinsect-slot.component';
import { ModificationSlotComponent } from '../components/modification-slot/modification-slot.component';
import { UpgradeSlotComponent } from '../components/upagrade-slot/upgrade-slot.component';
import { AugmentationModel } from '../models/augmentation.model';
import { AwakeningLevelModel } from '../models/awakening-level.model';
import { DecorationModel } from '../models/decoration.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { ModificationModel } from '../models/modification.model';
import { SetBonusModel } from '../models/set-bonus.model';
import { SlotEventModel } from '../models/slot-event.model';
import { UpgradeContainerModel } from '../models/upgrade-container.model';
import { AilmentType } from '../types/ailment.type';
import { AwakeningType } from '../types/awakening.type';
import { ElementType } from '../types/element.type';
import { EquipmentCategoryType } from '../types/equipment-category.type';
import { ItemType } from '../types/item.type';
import { WeaponType } from '../types/weapon.type';
import { EquipmentService } from './equipment.service';

@Injectable()
export class SlotService {
	public anySlotSelected$ =
		new Subject<ItemSlotComponent | DecorationSlotComponent | AugmentationSlotComponent | UpgradeSlotComponent | AwakeningSlotComponent | ModificationSlotComponent | KinsectSlotComponent>();

	public itemSelected$ = new Subject<SlotEventModel<ItemSlotComponent, ItemModel>>();
	public itemSelectedNew$ = new Subject<SlotEventModel<ItemSlotComponent, ItemModel>>();
	public decorationSelected$ = new Subject<SlotEventModel<DecorationSlotComponent, DecorationModel>>();
	public augmentationSelected$ = new Subject<SlotEventModel<AugmentationSlotComponent, AugmentationModel>>();
	public upgradeSelected$ = new Subject<SlotEventModel<UpgradeSlotComponent, UpgradeContainerModel>>();
	public setbonusSelected$ = new Subject();
	public modificationSelected$ = new Subject<SlotEventModel<ModificationSlotComponent, ModificationModel>>();
	public kinsectSelected$ = new Subject<SlotEventModel<KinsectSlotComponent, KinsectModel>>();
	public itemLevelChanged$ = new Subject();
	public itemActiveChanged$ = new Subject();
	public weaponSlotSelected$ = new Subject();
	public armorSlotSelected$ = new Subject();

	public weaponModSelected$ = new Subject();

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
	selectedAwakeningSlot: AwakeningSlotComponent;
	selectedModificationSlot: ModificationSlotComponent;
	selectedKinsectSlot: KinsectSlotComponent;
	selectedSetbonusSlot: AwakeningSlotComponent;

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

	selectSetbonusSlot(slot: AwakeningSlotComponent) {
		this.clearSlotSelect();
		this.selectedSetbonusSlot = slot;

		if (this.selectedSetbonusSlot) {
			this.selectedSetbonusSlot.selected = true;
			this.anySlotSelected$.next(this.selectedSetbonusSlot);
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
		this.applySlotUpgrade();
		if (slot.upgradeContainer) {
			this.clearUpgradeContainer(slot.upgradeContainer);
		}
		this.upgradeSelected$.next({ slot: slot, equipment: null });
	}

	clearAwakeningSlot(slot: AwakeningSlotComponent, update: boolean = true) {
		this.equipmentService.removeAwakening();
		slot.awakenings = [];
		this.clearSkillSlot(slot, false);
		if (update) {
			this.weaponModSelected$.next({ slot: slot, equipment: null });
		}
	}

	clearSkillSlot(slot: AwakeningSlotComponent, update: boolean = true) {
		this.equipmentService.removeSetbonus();
		slot.setbonus = null;
		if (update) {
			this.weaponModSelected$.next({ slot: slot, equipment: null });
		}
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
				this.selectedItemSlot.augmentations = [];

				if (this.selectedItemSlot.upgradeSlot) {
					this.clearUpgradeSlot(this.selectedItemSlot.upgradeSlot);
				}

				this.selectedItemSlot.upgradeContainer = new UpgradeContainerModel();
				this.selectedItemSlot.upgradeContainer.hasCustomUpgrades = item.upgradeType == 1;
				this.selectedItemSlot.upgradeContainer.weaponType = item.weaponType;

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
					this.selectedItemSlot.upgradeContainer.slots = 10;
				} else if (item.rarity == 11) {
					this.selectedItemSlot.upgradeContainer.slots = 8;
				} else if (item.rarity == 12) {
					this.selectedItemSlot.upgradeContainer.slots = 6;
				}

				if (item.upgradeType == 2) {
					this.selectedItemSlot.awakenings = [
						new AwakeningLevelModel(),
						new AwakeningLevelModel(),
						new AwakeningLevelModel(),
						new AwakeningLevelModel(),
						new AwakeningLevelModel()
					];
				}

				this.selectedItemSlot.kinsect = null;
				this.selectedItemSlot.modifications = [];
				switch (item.weaponType) {
					case WeaponType.InsectGlaive:
						this.selectedItemSlot.kinsect = new KinsectModel();
						break;
					case WeaponType.LightBowgun:
						this.selectedItemSlot.modifications = [
							new ModificationModel(),
							new ModificationModel(),
							new ModificationModel()
						];
						if (item.rarity >= 10) {
							this.selectedItemSlot.modifications.push(new ModificationModel());
						}
						if (item.rarity >= 12) {
							this.selectedItemSlot.modifications.push(new ModificationModel());
						}
						break;
					case WeaponType.HeavyBowgun:
						this.selectedItemSlot.modifications = [
							new ModificationModel(),
							new ModificationModel(),
							new ModificationModel()
						];
						if (item.rarity >= 9) {
							this.selectedItemSlot.modifications.push(new ModificationModel());
						}
						if (item.rarity >= 10) {
							this.selectedItemSlot.modifications.push(new ModificationModel());
						}
						if (item.rarity >= 12) {
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
			case ItemType.Arms:
				slotAux = this.handsSlot;
				break;
			case ItemType.Waist:
				slotAux = this.legsSlot;
				break;
			case ItemType.Legs:
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

			this.applySlotUpgrade();

			this.selectedUpgradeSlot.upgradeContainer = upgradeContainer;
			this.upgradeSelected$.next({ slot: this.selectedUpgradeSlot, equipment: upgradeContainer });
		}
	}

	selectAwakenings(awakenings: AwakeningLevelModel[], updateStats: boolean = true) {
		if (this.selectedAwakeningSlot) {
		} else {
			this.selectedAwakeningSlot = this.weaponSlot.awakeningSlot;
		}
		this.equipmentService.addAwakenings(awakenings, updateStats);
		this.applySlotAwakening();

		this.selectedAwakeningSlot.awakenings = awakenings;
		this.weaponModSelected$.next({ slot: this.selectedAwakeningSlot, equipment: awakenings });
	}

	selectSetbonus(setbonus: SetBonusModel, updateStats: boolean = true) {
		if (this.selectedSetbonusSlot) {
			if (this.selectedSetbonusSlot.setbonus) {
				this.equipmentService.removeSetbonus();
			}
			this.equipmentService.addSetbonus(setbonus, updateStats);
			this.selectedSetbonusSlot.setbonus = setbonus;
			this.setbonusSelected$.next({ slot: this.selectedSetbonusSlot, equipment: setbonus });
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

	selectWeaponElement(element: ElementType, elementAttack: number) {
		this.equipmentService.changeElement(element, elementAttack);
		this.weaponModSelected$.next(element);
	}

	selectWeaponAilment(ailment: AilmentType, ailmentAttack: number) {
		this.equipmentService.changeAilment(ailment, ailmentAttack);
		this.weaponModSelected$.next(ailment);
	}

	changeWeaponName(weaponName: string) {
		this.equipmentService.changeWeaponName(weaponName);
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

	private clearUpgradeContainer(upgradeContainer: UpgradeContainerModel) {
		upgradeContainer.used = 0;
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
		upgradeContainer.customUpgradeIds = [0, 0, 0, 0, 0, 0, 0];
	}

	private applySlotAugmentation() {
		const slotAugs = this.equipmentService.augmentations.filter(aug => aug.id == 4);
		const augDecorationSlot = this.weaponSlot.item.slots.find(slot => slot.augmentation);

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
			if (this.weaponSlot.item.slots.some(decorationSlot => decorationSlot.augmentation)) {
				this.weaponSlot.item.slots = this.weaponSlot.item.slots.filter(decorationSlot => !(decorationSlot === augDecorationSlot)); // Was Reject
				this.equipmentService.removeDecoration(this.weaponSlot.decorationSlots.last.decoration);
			}
		}
	}

	private applySlotUpgrade() {
		const upgradeContainer = this.equipmentService.upgradeContainer;
		if (upgradeContainer && upgradeContainer.upgradeDetails && upgradeContainer.upgradeDetails.length > 0) {
			this.applySlotIncrement(upgradeContainer.upgradeDetails[3].level, ItemType.Upgrade);
		} else {
			this.applySlotIncrement(0, ItemType.Upgrade);
		}
	}

	private applySlotAwakening() {
		const slotAwakening = this.equipmentService.awakenings.find(x => x.type == AwakeningType.Slot);
		if (slotAwakening && slotAwakening.level - 1 > 0) {
			this.applySlotIncrement(slotAwakening.level - 1, ItemType.Awakening);
		} else {
			this.applySlotIncrement(0, ItemType.Awakening);
		}
	}

	private applySlotIncrement(extraSlots: number, itemType: ItemType) {
		const decoSlotsIncremented = this.weaponSlot.item.slots.filter(x => x.slotsAdded && x.slotsAdded.some(y => y.itemType == itemType));
		let totalAdded = 0;
		if (decoSlotsIncremented) {
			for (const decoSlot of decoSlotsIncremented) {
				if (decoSlot.slotsAdded.length) {
					for (const added of decoSlot.slotsAdded) {
						if (added.itemType == itemType) {
							totalAdded += added.level;
						}
					}
				}
			}
			if (totalAdded != extraSlots) {
				this.slotsIncrementRecursive(extraSlots - totalAdded, itemType);
			}
		}
	}

	private slotsIncrementRecursive(extraSlots: number, itemType: ItemType) {
		if (extraSlots > 0) {
			for (const slot of this.weaponSlot.item.slots) {
				if (slot.level < 4) {
					const toAdd = Math.min(4 - slot.level, extraSlots);

					if (!slot.slotsAdded) {
						slot.slotsAdded = [];
					}
					const added = slot.slotsAdded.find(x => x.itemType == itemType);
					if (added) {
						added.level += toAdd;
					} else {
						slot.slotsAdded.push({ level: toAdd, itemType: itemType });
					}

					slot.level += toAdd;
					extraSlots -= toAdd;
				}
				if (extraSlots == 0) {
					break;
				}
			}
			if (extraSlots > 0 && this.weaponSlot.item.slots.length < 3) {
				if (!this.weaponSlot.item.slots) {
					this.weaponSlot.item.slots = [];
				}
				this.weaponSlot.item.slots.push({ level: 0 });
				this.slotsIncrementRecursive(extraSlots, itemType);
			}
		} else {
			for (let i = this.weaponSlot.item.slots.length - 1; i >= 0; i--) {
				const slot = this.weaponSlot.item.slots[i];
				const toRemove = Math.min(slot.level, -extraSlots);
				if (slot.slotsAdded) {
					const added = slot.slotsAdded.find(x => x.itemType == itemType);
					if (added) {
						added.level -= toRemove;
					}
				}
				const decoSlot = this.weaponSlot.decorationSlots.toArray()[i];
				if (decoSlot && decoSlot.decoration && decoSlot.decoration.level > slot.level - toRemove) {
					this.clearDecorationSlot(decoSlot);
				}
				slot.level -= toRemove;
				extraSlots += toRemove;
				if (slot.level == 0) {
					this.weaponSlot.item.slots.pop();
				}
				if (extraSlots == 0) {
					break;
				}
			}
		}
	}

	private clearSlotItems(slot: ItemSlotComponent) {
		if (slot.item) {
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

			if (slot.awakeningSlot) {
				this.equipmentService.removeAwakening();
				slot.awakeningSlot.setbonus = null;
			}
		}
		if (slot.upgradeContainer) {
			slot.upgradeContainer.slots = 0;
			slot.upgradeContainer.used = 0;
			slot.upgradeContainer.hasCustomUpgrades = false;
			this.clearUpgradeContainer(slot.upgradeContainer);
			this.equipmentService.upgradeContainer = slot.upgradeContainer;
		}
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

		if (this.selectedSetbonusSlot) {
			this.selectedSetbonusSlot.selected = false;
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
		this.selectedSetbonusSlot = null;
		this.selectedModificationSlot = null;
		this.selectedKinsectSlot = null;
	}
}

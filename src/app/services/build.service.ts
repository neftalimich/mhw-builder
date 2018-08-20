import { ChangeDetectorRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { ItemSlotComponent } from '../components/item-slot/item-slot.component';
import { ItemModel } from '../models/item.model';
import { EquipmentCategoryType } from '../types/equipment-category.type';
import { ItemType } from '../types/item.type';
import { DataService } from './data.service';
import { EquipmentService } from './equipment.service';
import { SlotService } from './slot.service';

@Injectable()
export class BuildService {
	public buildIdUpdated$ = new Subject<string>();

	private changeDetector: ChangeDetectorRef;
	private loadingBuild = false;

	constructor(
		private dataService: DataService,
		private slotService: SlotService,
		private equipmentService: EquipmentService
	) { }

	initialize(
		changeDetector: ChangeDetectorRef
	) {
		// TODO: Passing in change detector feels gross, but at the moment it's needed to set up decoration slots when an item is loaded by build id.
		this.changeDetector = changeDetector;
		this.subscribeSlotEvents();
	}

	private subscribeSlotEvents() {
		this.slotService.itemSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.decorationSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.augmentationSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.itemLevelChanged$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});
	}

	loadBuild(buildId: string) {
		this.loadingBuild = true;

		const itemHashes = buildId.split('i');

		// build string format version number is hash[0]

		this.loadBuildSlot(itemHashes[1], this.slotService.weaponSlot);
		this.loadBuildSlot(itemHashes[2], this.slotService.headSlot);
		this.loadBuildSlot(itemHashes[3], this.slotService.chestSlot);
		this.loadBuildSlot(itemHashes[4], this.slotService.handsSlot);
		this.loadBuildSlot(itemHashes[5], this.slotService.legsSlot);
		this.loadBuildSlot(itemHashes[6], this.slotService.feetSlot);
		this.loadBuildSlot(itemHashes[7], this.slotService.charmSlot);

		this.slotService.selectItemSlot(null);
		this.changeDetector.detectChanges();
		this.loadingBuild = false;
	}

	private loadBuildSlot(itemHash: string, slot: ItemSlotComponent) {
		if (itemHash) {
			const decorationParts = itemHash.split('d');
			const itemParts = itemHash.split('l');
			const augmentParts = itemHash.split('a');
			const itemId = parseInt(itemParts[0], 10);

			if (itemId) {
				let item: ItemModel;
				switch (this.dataService.getEquipmentCategory(slot.slotName)) {
					case EquipmentCategoryType.Weapon:
						item = this.dataService.getWeapon(itemId);
						break;
					case EquipmentCategoryType.Armor:
						item = this.dataService.getArmor(itemId);
						break;
					case EquipmentCategoryType.Charm:
						item = this.dataService.getCharm(itemId);
						break;
				}

				// if (slot.slotName == ItemType.Weapon) {
				// 	item = this.dataService.getWeapon(itemId);
				// } else if (this.dataService.getEquipmentCategory(slot.slotName) == EquipmentCategoryType.Armor) {
				// 	item = this.dataService.getArmor(itemId);
				// }

				if (item) {
					if (itemParts.length > 1) {
						const level = parseInt(itemParts[1], 10);
						item.equippedLevel = level;
					}

					this.slotService.selectItemSlot(slot);
					this.slotService.selectItem(item);

					this.changeDetector.detectChanges();

					if (augmentParts.length > 1 && item.equipmentCategory == EquipmentCategoryType.Weapon) {
						for (let i = 0; i < 9 - item.rarity; i++) {
							const augId = parseInt(augmentParts[i + 1], 10);
							if (augId) {
								const aug = this.dataService.getAugmentation(augId);
								if (aug) {
									this.slotService.selectAugmentationSlot(slot.augmentationSlots.toArray()[i]);
									const newAug = Object.assign({}, aug);
									this.slotService.selectAugmentation(newAug);
								}
							}
						}
					}

					this.changeDetector.detectChanges();

					for (let i = 1; i < decorationParts.length; i++) {
						const decorationId = parseInt(decorationParts[i], 10);
						if (decorationId) {
							const decoration = this.dataService.getDecoration(decorationId);
							if (decoration) {
								this.slotService.selectDecorationSlot(slot.decorationSlots.toArray()[i - 1]);
								const newDecoration = Object.assign({}, decoration);
								this.slotService.selectDecoration(newDecoration);
							}
						}
					}
				}
			}
		}
	}

	private updateBuildId() {
		const weapon = this.equipmentService.items.find(item => item.equipmentCategory == EquipmentCategoryType.Weapon);
		const head = this.equipmentService.items.find(item => item.itemType == ItemType.Head);
		const chest = this.equipmentService.items.find(item => item.itemType == ItemType.Chest);
		const hands = this.equipmentService.items.find(item => item.itemType == ItemType.Hands);
		const legs = this.equipmentService.items.find(item => item.itemType == ItemType.Legs);
		const feet = this.equipmentService.items.find(item => item.itemType == ItemType.Feet);
		const charm = this.equipmentService.items.find(item => item.itemType == ItemType.Charm);

		let buildId = 'v1';

		this.changeDetector.detectChanges();

		buildId += this.getItemBuildString(weapon);
		buildId += this.getItemBuildString(head);
		buildId += this.getItemBuildString(chest);
		buildId += this.getItemBuildString(hands);
		buildId += this.getItemBuildString(legs);
		buildId += this.getItemBuildString(feet);
		buildId += this.getItemBuildString(charm);

		this.buildIdUpdated$.next(buildId);
	}

	private getItemBuildString(item: ItemModel): string {
		let result = 'i';

		if (item) {
			result += item.id.toString();

			if (item.equippedLevel) {
				result += `l${item.equippedLevel}`;
			}

			if (item.equipmentCategory == EquipmentCategoryType.Weapon && item.rarity >= 6) {
				for (const aug of this.equipmentService.augmentations) {
					if (aug.id) {
						result += `a${aug.id}`;
					}
				}
			}

			if (item.slots) {
				let decorations = _.filter(this.equipmentService.decorations, d => d.itemId === item.id);
				decorations = _.orderBy(decorations, [d => d.level], ['desc']);
				for (let i = 0; i < item.slots.length; i++) {
					const slot = item.slots[i];
					const decoration = _.find(decorations, d => d.itemId == item.id && d.level <= slot.level);
					decorations = _.without(decorations, decoration);
					if (decoration) {
						result += `d${decoration.id.toString()}`;
					}
				}
			}
		}

		return result;
	}
}

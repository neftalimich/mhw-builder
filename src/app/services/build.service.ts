import { ChangeDetectorRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { ItemSlotComponent } from '../components/item-slot/item-slot.component';
import { BuildItemModel, BuildModel } from '../models/build.model';
import { ItemModel } from '../models/item.model';
import { ElementType } from '../types/element.type';
import { EquipmentCategoryType } from '../types/equipment-category.type';
import { ItemType } from '../types/item.type';
import { WeaponType } from '../types/weapon.type';
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

		this.slotService.modificationSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.kinsectSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.itemLevelChanged$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});
	}

	loadBuild(buildId: string) {
		this.loadingBuild = true;
		const build = this.parseBuildId(buildId);

		this.loadBuildSlot(build.weapon, this.slotService.weaponSlot);
		this.loadBuildSlot(build.head, this.slotService.headSlot);
		this.loadBuildSlot(build.chest, this.slotService.chestSlot);
		this.loadBuildSlot(build.hands, this.slotService.handsSlot);
		this.loadBuildSlot(build.legs, this.slotService.legsSlot);
		this.loadBuildSlot(build.feet, this.slotService.feetSlot);
		this.loadBuildSlot(build.charm, this.slotService.charmSlot);
		this.loadBuildSlot(build.tool1, this.slotService.tool1Slot);
		this.loadBuildSlot(build.tool2, this.slotService.tool2Slot);

		this.slotService.selectItemSlot(null);
		this.changeDetector.detectChanges();
		this.loadingBuild = false;
	}

	private parseBuildId(buildId: string): BuildModel {
		const itemGroupRegex = /(i[.]*[^i]*)/g;
		const itemRegex = /(?<=i)([\d]+)/g;
		const decoRegex = /(?<=d)([\d]+)/g;
		const augRegex = /(?<=a)([\d]+)/g;
		const kinsectRegex = /(?<=k)([\d]+)/g;
		const modRegex = /(?<=m)([\d]+)/g;
		const elementRegex = /(?<=e)([\d]+)/g;
		const levelRegex = /(?<=l)([\d]+)/g;

		const build = new BuildModel();

		const itemGroups = buildId.match(itemGroupRegex);
		let index = 1;
		for (const itemGroup of itemGroups) {
			const buildItem = new BuildItemModel();

			const item = itemGroup.match(itemRegex);
			if (item) {
				buildItem.itemId = parseInt(item[0], 10);
			}

			const decos = itemGroup.match(decoRegex);
			if (decos) {
				buildItem.decorationIds = [];
				for (const deco of decos) {
					buildItem.decorationIds.push(parseInt(deco, 10));
				}
			}

			const augs = itemGroup.match(augRegex);
			if (augs) {
				buildItem.augmentationIds = [];
				for (const aug of augs) {
					buildItem.augmentationIds.push(parseInt(aug, 10));
				}
			}

			const mods = itemGroup.match(modRegex);
			if (mods) {
				buildItem.modificationIds = [];
				for (const mod of mods) {
					buildItem.modificationIds.push(parseInt(mod, 10));
				}
			}

			const kinsect = itemGroup.match(kinsectRegex);
			if (kinsect) {
				buildItem.kinsectId = parseInt(kinsect[0], 10);
			}

			const element = itemGroup.match(elementRegex);
			if (element) {
				buildItem.kinsectElementId = parseInt(element[0], 10);
			}

			const level = itemGroup.match(levelRegex);
			if (level) {
				buildItem.level = parseInt(level[0], 10);
			}

			switch (index) {
				case 1:
					build.weapon = buildItem;
					break;
				case 2:
					build.head = buildItem;
					break;
				case 3:
					build.chest = buildItem;
					break;
				case 4:
					build.hands = buildItem;
					break;
				case 5:
					build.legs = buildItem;
					break;
				case 6:
					build.feet = buildItem;
					break;
				case 7:
					build.charm = buildItem;
					break;
				case 8:
					build.tool1 = buildItem;
					break;
				case 9:
					build.tool2 = buildItem;
					break;
			}
			index++;
		}

		return build;
	}

	private loadBuildSlot(buildItem: BuildItemModel, slot: ItemSlotComponent) {
		if (buildItem.itemId) {
			let item: ItemModel;
			switch (this.dataService.getEquipmentCategory(slot.slotName)) {
				case EquipmentCategoryType.Weapon:
					item = this.dataService.getWeapon(buildItem.itemId);
					break;
				case EquipmentCategoryType.Armor:
					item = this.dataService.getArmor(buildItem.itemId);
					break;
				case EquipmentCategoryType.Charm:
					item = this.dataService.getCharm(buildItem.itemId);
					break;
				case EquipmentCategoryType.Tool:
					item = this.dataService.getTool(buildItem.itemId, slot.slotName);
					break;
			}

			if (item) {
				if (buildItem.level) {
					item.equippedLevel = buildItem.level;
				}

				this.slotService.selectItemSlot(slot);
				this.slotService.selectItem(item);

				this.changeDetector.detectChanges();

				if (item.equipmentCategory == EquipmentCategoryType.Weapon) {
					if (buildItem.augmentationIds) {
						for (let i = 0; i < 9 - item.rarity; i++) {
							const augId = buildItem.augmentationIds[i];
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

					switch (item.weaponType) {
						case WeaponType.InsectGlaive:
							if (buildItem.kinsectId) {
								const kinsect = this.dataService.getKinsect(buildItem.kinsectId);
								if (kinsect) {
									this.slotService.selectKinsectSlot(slot.kinsectSlot);
									const newKinsect = Object.assign({}, kinsect);
									this.slotService.selectKinsect(newKinsect);
									if (buildItem.kinsectElementId) {
										const keys = Object.keys(ElementType);
										for (const key in keys) {
											if (key == buildItem.kinsectElementId.toString()) {
												const value = keys[key];
												newKinsect.element = (<any>ElementType)[value]; // There must be a better way to do this...
											}
										}
									} else {
										newKinsect.element = ElementType.None;
									}
								}
							}
							break;
						case WeaponType.LightBowgun:
						case WeaponType.HeavyBowgun:
							if (buildItem.modificationIds) {
								for (let i = 0; i < buildItem.modificationIds.length; i++) {
									const modId = buildItem.modificationIds[i];
									if (modId) {
										const mod = this.dataService.getModification(modId);
										if (mod) {
											this.slotService.selectModificationSlot(slot.modificationSlots.toArray()[i]);
											const newAug = Object.assign({}, mod);
											this.slotService.selectModification(newAug);
										}
									}
								}
							}
							break;
						default:
							break;
					}
				}

				this.changeDetector.detectChanges();

				if (buildItem.decorationIds) {
					let i = 0;
					for (const decorationId of buildItem.decorationIds) {
						const decoration = this.dataService.getDecoration(decorationId);
						if (decoration) {
							this.slotService.selectDecorationSlot(slot.decorationSlots.toArray()[i]);
							const newDecoration = Object.assign({}, decoration);
							this.slotService.selectDecoration(newDecoration);
						}
						i++;
					}
				}
			}
		} else {
			this.slotService.clearItemSlot(slot);
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
		const tool1 = this.equipmentService.items.find(item => item.itemType == ItemType.Tool1);
		const tool2 = this.equipmentService.items.find(item => item.itemType == ItemType.Tool2);

		let buildId = 'v2';

		this.changeDetector.detectChanges();

		buildId += this.getItemBuildString(weapon);
		buildId += this.getItemBuildString(head);
		buildId += this.getItemBuildString(chest);
		buildId += this.getItemBuildString(hands);
		buildId += this.getItemBuildString(legs);
		buildId += this.getItemBuildString(feet);
		buildId += this.getItemBuildString(charm);
		buildId += this.getItemBuildString(tool1);
		buildId += this.getItemBuildString(tool2);

		this.buildIdUpdated$.next(buildId);
	}

	private getItemBuildString(item: ItemModel): string {
		let result = 'i';

		if (item) {
			result += item.id.toString();

			if (item.equippedLevel) {
				result += `l${item.equippedLevel}`;
			}

			if (item.equipmentCategory == EquipmentCategoryType.Weapon) {
				if (item.rarity >= 6) {
					for (const aug of this.equipmentService.augmentations) {
						if (aug.id) {
							result += `a${aug.id}`;
						}
					}
				}

				for (const mod of this.equipmentService.modifications) {
					if (mod.id) {
						result += `m${mod.id}`;
					}
				}

				if (this.equipmentService.kinsect) {
					result += `k${this.equipmentService.kinsect.id}`;

					if (this.equipmentService.kinsect.element) {
						const keys = Object.keys(ElementType);
						let elementIndex = '0';
						for (const key in keys) {
							if (keys.hasOwnProperty(key)) {
								const value = keys[key];
								if (this.equipmentService.kinsect.element == value) {
									elementIndex = key;
								}
							}
						}
						result += `e${elementIndex}`;
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

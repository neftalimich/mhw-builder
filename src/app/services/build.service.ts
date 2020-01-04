import { ChangeDetectorRef, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { ItemSlotComponent } from '../components/item-slot/item-slot.component';
import { AwakeningLevelModel } from '../models/awakening-level.model';
import { BuildItemModel, BuildModel } from '../models/build.model';
import { ItemModel } from '../models/item.model';
import { UpgradeContainerModel } from '../models/upgrade-container.model';
import { UpgradeLevelModel } from '../models/upgrade.model';
import { AilmentType } from '../types/ailment.type';
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

	private weaponItem: ItemModel;

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
		this.slotService.itemSelectedNew$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.decorationSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.augmentationSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.upgradeSelected$.subscribe(() => {
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

		this.slotService.weaponModSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});

		this.slotService.setbonusSelected$.subscribe(() => {
			if (!this.loadingBuild) { this.updateBuildId(); }
		});
	}

	loadBuild(buildHash: string) {
		this.loadingBuild = true;
		const buildParts = buildHash.split('&');

		const buildId = buildParts[0];

		const build = this.parseBuildId(buildId);

		this.loadBuildSlot(build.head, this.slotService.headSlot);
		this.loadBuildSlot(build.chest, this.slotService.chestSlot);
		this.loadBuildSlot(build.hands, this.slotService.handsSlot);
		this.loadBuildSlot(build.legs, this.slotService.legsSlot);
		this.loadBuildSlot(build.feet, this.slotService.feetSlot);
		this.loadBuildSlot(build.charm, this.slotService.charmSlot);
		if (build.tool1) { this.loadBuildSlot(build.tool1, this.slotService.tool1Slot); }
		if (build.tool2) { this.loadBuildSlot(build.tool2, this.slotService.tool2Slot); }
		this.loadBuildSlot(build.weapon, this.slotService.weaponSlot, true);

		this.slotService.selectItemSlot(null);
		this.changeDetector.detectChanges();
		this.loadingBuild = false;
	}

	private parseBuildId(buildId: string): BuildModel {
		const itemGroupRegex = /(i[.]*[^i]*)/g;
		const itemRegex = /(?<=i)([\d]+)/g;
		const decoRegex = /(?<=d)([\d]+)/g;
		const augRegex = /(?<=a)([\d]+)/g;
		const upgRegex = /(?<=u)([\d]+)/g;
		const custRegex = /(?<=c)([\d]+)/g;
		const awkRegex = /(?<=w)([\d]+)(l)([\d]+)/g;
		const setbRegex = /(?<=s)([\d]+)/g;
		const kinsectRegex = /(?<=k)([\d]+)/g;
		const kinsectElementRegex = /(?<=e)([\d]+)/g;
		const elementRegex = /(?<=f)([\d]+)/g;
		const ailmentRegex = /(?<=g)([\d]+)/g;
		const modRegex = /(?<=m)([\d]+)/g;
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

			const upgs = itemGroup.match(upgRegex);
			if (upgs) {
				buildItem.upgradeLevels = [];
				buildItem.upgradeLevels.push(parseInt(upgs.toString().substring(0, 1), 10)); // Attack
				buildItem.upgradeLevels.push(parseInt(upgs.toString().substring(1, 2), 10)); // Affinity
				buildItem.upgradeLevels.push(parseInt(upgs.toString().substring(2, 3), 10)); // Defense
				buildItem.upgradeLevels.push(parseInt(upgs.toString().substring(3, 4), 10)); // Slots
				buildItem.upgradeLevels.push(parseInt(upgs.toString().substring(4, 5), 10)); // Health
				buildItem.upgradeLevels.push(parseInt(upgs.toString().substring(5, 6), 10)); // Element/Ailment
			}

			const customs = itemGroup.match(custRegex);
			if (customs) {
				if (customs.toString().length == 4) { // V2
					// Empty
				} else if (customs.toString().length == 7) { // v3
					buildItem.customLevelIds = [];
					buildItem.customLevelIds.push(parseInt(customs.toString().substring(0, 1), 10)); // Lv 1
					buildItem.customLevelIds.push(parseInt(customs.toString().substring(1, 2), 10)); // Lv 2
					buildItem.customLevelIds.push(parseInt(customs.toString().substring(2, 3), 10)); // Lv 3
					buildItem.customLevelIds.push(parseInt(customs.toString().substring(3, 4), 10)); // Lv 4
					buildItem.customLevelIds.push(parseInt(customs.toString().substring(4, 5), 10)); // Lv 5
					buildItem.customLevelIds.push(parseInt(customs.toString().substring(5, 6), 10)); // Lv 6
					buildItem.customLevelIds.push(parseInt(customs.toString().substring(6, 7), 10)); // Lv 7
				}
			}

			const awks = itemGroup.match(awkRegex);
			if (awks) {
				buildItem.awakenings = [];
				for (const awk of awks) {
					const awkAux = awk.split('l');
					buildItem.awakenings.push([parseInt(awkAux[0], 10), parseInt(awkAux[1], 10)]);
				}
			}

			const setb = itemGroup.match(setbRegex);
			if (setb) {
				buildItem.setbonusId = parseInt(setb[0], 10);
			}

			const element = itemGroup.match(elementRegex);
			if (element) {
				buildItem.elementId = parseInt(element[0], 10);
			}
			const ailment = itemGroup.match(ailmentRegex);
			if (ailment) {
				buildItem.ailmentId = parseInt(ailment[0], 10);
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

			const kinsectElement = itemGroup.match(kinsectElementRegex);
			if (kinsectElement) {
				buildItem.kinsectElementId = parseInt(kinsectElement[0], 10);
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

	private loadBuildSlot(buildItem: BuildItemModel, slot: ItemSlotComponent, updateStats: boolean = false) {
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
				this.slotService.selectItem(item, updateStats);

				this.changeDetector.detectChanges();

				if (item.equipmentCategory == EquipmentCategoryType.Weapon) {
					// -------------------- Element
					let weaponIndex = 0;
					for (const types in WeaponType) {
						if (isNaN(Number(types))) {
							if (types == item.weaponType) {
								break;
							} else {
								weaponIndex += 1;
							}
						}
					}
					if (buildItem.elementId != null) {
						item.element = this.dataService.getElement(buildItem.elementId);
						if (item.upgradeType == 2) {
							if (item.element != null) {
								item.elementBaseAttack = this.dataService.getSafiElementAttack(weaponIndex);
							} else {
								item.elementBaseAttack = null;
							}
						}
					}
					// -------------------- Ailment
					if (buildItem.ailmentId != null) {
						item.ailment = this.dataService.getAilment(buildItem.ailmentId);
						if (item.upgradeType == 2) {
							if (item.ailment != null) {
								let ailmentType = 0;
								if (item.ailment == AilmentType.Poison || item.ailment == AilmentType.Blast) {
									ailmentType = 1;
								}
								item.ailmentBaseAttack = this.dataService.getSafiAilmentAttack(weaponIndex, ailmentType);
							} else {
								item.ailmentBaseAttack = null;
							}
						}
					}
					// --------------------
					if (item.upgradeType == 2
						&& item.weaponType != WeaponType.LightBowgun
						&& item.weaponType != WeaponType.HeavyBowgun
						&& (buildItem.elementId != null || buildItem.ailmentId != null)) {
						item.name = this.dataService.getSafiWeaponName(item.weaponType, item.element, item.ailment);
					}
					// -------------------- Awakenings
					if (buildItem.awakenings != null) {
						const awakeningLevels: AwakeningLevelModel[] = [];
						for (const awk of buildItem.awakenings) {
							const awkAux = this.dataService.getAwakening(awk[0]);
							awakeningLevels.push({
								id: awkAux.id,
								type: awkAux.type,
								name: awkAux.name,
								level: awk[1],
								minLevel: awkAux.minLevel,
								maxLevel: awkAux.maxLevel
							});
						}
						slot.awakeningSlot.awakenings = awakeningLevels;
						this.slotService.selectAwakenings(awakeningLevels);
					}
					// -------------------- Setbonus
					if (buildItem.setbonusId != null) {
						const setbonus = this.dataService.getSetBonusByBuildId(buildItem.setbonusId);
						if (setbonus) {
							if (slot.awakeningSlot) {
								slot.awakeningSlot.setbonus = setbonus;
								this.slotService.selectSetbonusSlot(slot.awakeningSlot);
							}
							this.slotService.selectSetbonus(setbonus);
						}
					}
					// --------------------

					// -------------------- Augmentations
					if (buildItem.augmentationIds) {
						for (let i = 0; i < 9 - item.rarity; i++) {
							const augId = buildItem.augmentationIds[i];
							if (augId) {
								const aug = this.dataService.getAugmentation(augId);
								if (aug) {
									this.slotService.selectAugmentationSlot(slot.augmentationSlots.toArray()[i]);
									const newAug = Object.assign({}, aug);
									this.slotService.selectAugmentation(newAug, updateStats);
								}
							}
						}
					}

					// -------------------- Upgrades
					if (buildItem.upgradeLevels && slot.upgradeSlot) {
						const upgrades = this.dataService.getUpgrades();
						const upgradeContainer = new UpgradeContainerModel();
						upgradeContainer.hasCustomUpgrades = item.upgradeType == 1;
						upgradeContainer.weaponType = item.weaponType;
						if (item.rarity == 10) {
							upgradeContainer.slots = 10;
						} else if (item.rarity == 11) {
							upgradeContainer.slots = 8;
						} else if (item.rarity == 12) {
							upgradeContainer.slots = 6;
						} else {
							upgradeContainer.slots = 0;
						}

						for (let i = 0; i < buildItem.upgradeLevels.length; i++) {
							const detail = new UpgradeLevelModel;
							detail.type = upgrades[i].type;
							detail.level = buildItem.upgradeLevels[i];
							if (detail.level > 0) {
								detail.requiredSlots = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].requiredSlots;
								detail.totalSlots = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].totalSlots;

								detail.passiveAttack = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].passiveAttack;
								detail.passiveAffinity = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].passiveAffinity;
								detail.passiveDefense = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].passiveDefense;
								detail.slotLevel = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].slotLevel;
								detail.healOnHitPercent = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].healOnHitPercent;
								detail.passiveElement = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].passiveElement;
								detail.passiveAilment = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].passiveAilment;

								detail.description = upgrades[i].levels[buildItem.upgradeLevels[i] - 1].description;

								upgradeContainer.used += detail.totalSlots;
							} else {
								detail.requiredSlots = 0;
								detail.totalSlots = 0;

								detail.passiveAttack = 0;
								detail.passiveAffinity = 0;
								detail.passiveDefense = 0;
								detail.slotLevel = 0;
								detail.healOnHitPercent = 0;
								detail.passiveElement = 0;
								detail.passiveAilment = 0;
							}
							upgradeContainer.upgradeDetails.push(detail);
						}

						if (buildItem.customLevelIds) {
							upgradeContainer.customUpgradeIds = buildItem.customLevelIds;
						}

						slot.upgradeSlot.upgradeContainer = upgradeContainer;

						this.slotService.selectUpgradeSlot(slot.upgradeSlot);
						const newUpg = JSON.parse(JSON.stringify(upgradeContainer));
						this.slotService.selectUpgradeContainer(newUpg, updateStats);
					}
					// --------------------
					switch (item.weaponType) {
						case WeaponType.InsectGlaive:
							if (buildItem.kinsectId) {
								const kinsect = this.dataService.getKinsect(buildItem.kinsectId);
								if (kinsect) {
									this.slotService.selectKinsectSlot(slot.kinsectSlot);
									const newKinsect = Object.assign({}, kinsect);
									this.slotService.selectKinsect(newKinsect, updateStats);
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
											this.slotService.selectModification(newAug, updateStats);
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
							this.slotService.selectDecoration(newDecoration, updateStats);
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

		let buildId = 'v3';

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
					// -------------------- Augmentations

					for (const aug of this.equipmentService.augmentations) {
						if (aug.id) {
							result += `a${aug.id}`;
						}
					}
					// -------------------- Upgrades
					if (this.equipmentService.upgradeContainer) {
						result += 'u';
						for (const detail of this.equipmentService.upgradeContainer.upgradeDetails) {
							if (detail.level) {
								result += `${detail.level}`;
							} else {
								result += '0';
							}
						}
						result += 'c';
						for (const customId of this.equipmentService.upgradeContainer.customUpgradeIds) {
							result += customId;
						}
					} else {
						result += 'u000000c0000000';
					}
					// -------------------- Awakenings
					if (this.equipmentService.awakenings.length) {
						for (const awakening of this.equipmentService.awakenings) {
							result += `w${awakening.id}l${awakening.level}`;
						}
					}
					// --------------------

					// -------------------- Setbonus
					if (this.equipmentService.awakeningSetbonus) {
						result += `s${this.equipmentService.awakeningSetbonus.buildId}`;
					}
					// --------------------
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
				if (item.element) {
					const elementId = this.dataService.getElementId(item.element);
					result += `f${elementId}`;
				} else {
					result += `f${0}`;
				}
				if (item.ailment) {
					const ailmentId = this.dataService.getAilmentId(item.ailment);
					result += `g${ailmentId}`;
				} else {
					result += `g${0}`;
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

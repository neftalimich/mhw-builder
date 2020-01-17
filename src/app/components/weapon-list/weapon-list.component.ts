import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ItemModel } from '../../models/item.model';
import { SkillModel } from '../../models/skill.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { ItemType } from '../../types/item.type';
import { WeaponType } from '../../types/weapon.type';

@Component({
	selector: 'mhw-builder-weapon-list',
	templateUrl: './weapon-list.component.html',
	styleUrls: ['./weapon-list.component.scss']
})
export class WeaponListComponent implements OnInit {
	public itemTypes = ItemType;
	public equipmentCategoryType = EquipmentCategoryType;
	private _itemType: ItemType;
	private _onlyIceborne: boolean;

	@Input()
	set itemType(itemType: ItemType) {
		this._itemType = itemType;
		this.loadItems();
	}
	get itemType(): ItemType { return this._itemType; }

	@Input()
	set onlyIceborne(onlyIceborne: boolean) {
		this._onlyIceborne = onlyIceborne;
		this.applyIceborneFilter();
		this.search({ key: 'Filter' }, this.searchBox.nativeElement.value);
		this.weaponTypeSort = '';
	}
	get onlyIceborne(): boolean { return this._onlyIceborne; }

	@Output() itemSelected = new EventEmitter<ItemModel>();

	@ViewChild('searchBox', { static: true }) searchBox: ElementRef;
	@ViewChild('itemList', { static: false }) itemList: VirtualScrollerComponent;

	items: ItemModel[];
	itemsWorld: ItemModel[];
	itemsIceborne: ItemModel[];
	filteredItems: ItemModel[];
	virtualItems: ItemModel[];
	weaponTypeFilter?: WeaponType;
	weaponTypeSort: String;

	showFilterContainer = true;
	showSortContainer = true;

	childHeight: number;

	@HostListener('window:resize')
	onResize() {
		this.refreshList();
	}

	constructor(
		private slotService: SlotService,
		public dataService: DataService,
	) {
		this.items = this.dataService.getWeapons();
	}

	ngOnInit() {
		this.slotService.weaponSlotSelected$.subscribe(slot => {
			setTimeout(() => {
				this.searchBox.nativeElement.focus();
				this.searchBox.nativeElement.select();
			}, 250);
		});
	}

	refreshList() {
		if (this.itemList) {
			this.itemList.refresh();
		}
	}

	onItemListUpdate(items: ItemModel[]) {
		this.virtualItems = items;
	}

	loadItems() {
		this.itemsWorld = this.items.filter(item => item.id < 1000);
		this.itemsIceborne = this.items.filter(item => item.id >= 1000);
		this.resetSearchResults();
		setTimeout(() => this.searchBox.nativeElement.focus(), 250);
	}

	search(event, query: string) {
		if (query) {
			if (event && (event.key === 'FilterHard' || event.key === 'Backspace' || event.key === 'Delete')) {
				this.applyIceborneFilter();
			}
			if (query.length > 1) {
				query = query.toLowerCase().trim();
				const queryParts = query.split(' ');

				if (this.filteredItems) {
					for (const item of this.filteredItems) {
						const itemName = item.name.toLowerCase();

						const match = _.some(queryParts, queryPart => {
							const nameMatch = itemName.includes(queryPart);
							const skillMatch = _.some(item.skills, skill => skill.id.toLowerCase().includes(queryPart));
							const tagMatch = _.some(item.tags, tag => tag.toLowerCase().includes(queryPart));
							const monstersMatch = _.some(item.monsters, tag => tag.toLowerCase().includes(queryPart));

							return nameMatch || skillMatch || tagMatch || monstersMatch;
						});

						if (!match) {
							this.filteredItems = _.reject(this.filteredItems, i => i.name === item.name);
						}
					}
				}
				this.applyWeaponFilter();
			}
		} else {
			this.resetSearchResults();
		}
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.applyIceborneFilter();
		this.applyWeaponFilter();
		this.weaponTypeSort = '';
	}

	applyWeaponFilter() {
		if (this.filteredItems && this.weaponTypeFilter && this.itemType == ItemType.Weapon) {
			this.filteredItems = _.reject(this.filteredItems, item => item.weaponType != this.weaponTypeFilter);
		}
	}

	applyIceborneFilter() {
		if (this.onlyIceborne) {
			this.filteredItems = this.itemsIceborne;
		} else {
			this.filteredItems = this.itemsIceborne.concat(this.itemsWorld);
		}
	}

	weaponFilterClicked(weaponType: WeaponType) {
		if (this.weaponTypeFilter) {
			if (this.weaponTypeFilter == weaponType) {
				this.weaponTypeFilter = null;
				this.search({ key: 'FilterHard' }, this.searchBox.nativeElement.value);
			} else {
				this.weaponTypeFilter = weaponType;
				this.search({ key: 'FilterHard' }, this.searchBox.nativeElement.value);
			}
		} else {
			this.weaponTypeFilter = weaponType;
			this.search({ key: 'FilterSoft' }, this.searchBox.nativeElement.value);
		}

		this.weaponTypeSort = '';
	}

	selectItem(item: ItemModel) {
		if (item.weaponType == WeaponType.LightBowgun || item.weaponType == WeaponType.HeavyBowgun) {
			item.ammoCapacities = this.dataService.getAmmoCapacities(item.id);
		} else if (item.weaponType == WeaponType.HuntingHorn && item.otherData) {
			item.melodies = this.dataService.getMelodies(item.otherData.map(other => other.value).join(';'));
		}

		const newItem = Object.assign({}, item);
		this.slotService.selectItem(newItem);
	}

	getSkillCount(item: ItemModel, skill: SkillModel): string {
		const itemSkill = _.find(item.skills, s => s.id == skill.id);
		const result = `${itemSkill.level}/${skill.levels.length}`;
		return result;
	}

	getMonsterIcon(monster: string, item: ItemModel): string {
		if (monster != 'element') {
			return `assets/images/monsters/${monster}.png`;
		} else {
			if (item.ailment) {
				return `assets/images/${item.ailment.toLowerCase()}-icon.png`;
			} else if (item.element) {
				return `assets/images/${item.element.toLowerCase()}-icon.png`;
			} else {
				return `assets/images/monsters/question.png`;
			}
		}
	}

	getElementIcon(item: ItemModel): string {
		if (item.element) {
			return `assets/images/${item.element.toLowerCase()}${item.elementHidden ? '-gray' : ''}-icon.png`;
		} else {
			return null;
		}
	}

	getAilmentIcon(item: ItemModel): string {
		if (item.ailment) {
			return `assets/images/${item.ailment.toLowerCase()}${item.ailmentHidden ? '-gray' : ''}-icon.png`;
		} else {
			return null;
		}
	}

	weaponSortByAttack() {
		this.weaponTypeSort = 'ATK';
		this.filteredItems.sort(function (item1, item2) {
			if (item1.baseAttack > item2.baseAttack) {
				return -1;
			} else if (item1.baseAttack < item2.baseAttack) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	weaponSortByAffinity() {
		this.weaponTypeSort = 'AFN';
		this.filteredItems.sort(function (item1, item2) {
			if (item1.baseAffinityPercent > item2.baseAffinityPercent) {
				return -1;
			} else if (item1.baseAffinityPercent < item2.baseAffinityPercent) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	weaponSortByAilment() {
		this.weaponTypeSort = 'AIL';
		this.filteredItems.sort(function (item1, item2) {
			if (item1.ailment && !item2.ailment || item1.ailmentBaseAttack > item2.ailmentBaseAttack) {
				return -1;
			} else if (!item1.ailment && item2.ailment || item1.ailmentBaseAttack < item2.ailmentBaseAttack) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	weaponSortByElement() {
		this.weaponTypeSort = 'ELE';
		this.filteredItems.sort(function (item1, item2) {
			if (item1.element && !item2.element || item1.elementBaseAttack > item2.elementBaseAttack) {
				return -1;
			} else if (!item1.element && item2.element || item1.elementBaseAttack < item2.elementBaseAttack) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	weaponSortByDefense() {
		this.weaponTypeSort = 'DEF';
		this.filteredItems.sort(function (item1, item2) {
			if (item1.defense > item2.defense) {
				return -1;
			} else if (item1.defense < item2.defense) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	weaponSortBySharpness() {
		this.weaponTypeSort = 'SHARP';
		this.filteredItems.sort(function (item1, item2) {
			let sharp1 = -1;
			let sharp2 = -1;
			if (!item1.sharpnessDataNeeded && item1.sharpnessLevelsBar.length > 0) {
				if (item1.sharpnessLevelsBar[item1.sharpnessLevelsBar.length - 1] > 0) {
					sharp1 = item1.sharpnessLevelsBar.length * 100 + item1.sharpnessLevelsBar[item1.sharpnessLevelsBar.length - 1];
				} else {
					sharp1 = (item1.sharpnessLevelsBar.length - 1) * 100 + item1.sharpnessLevelsBar[item1.sharpnessLevelsBar.length - 2];
				}
			}
			if (!item2.sharpnessDataNeeded && item2.sharpnessLevelsBar.length > 0) {
				if (item2.sharpnessLevelsBar[item2.sharpnessLevelsBar.length - 1] > 0) {
					sharp2 = item2.sharpnessLevelsBar.length * 100 + item2.sharpnessLevelsBar[item2.sharpnessLevelsBar.length - 1];
				} else {
					sharp2 = (item2.sharpnessLevelsBar.length - 1) * 100 + item2.sharpnessLevelsBar[item2.sharpnessLevelsBar.length - 2];
				}
			}
			if (sharp1 > sharp2) {
				return -1;
			} else if (sharp1 < sharp2) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	weaponSortBySlots() {
		this.weaponTypeSort = 'SLOT';
		this.filteredItems.sort(function (item1, item2) {
			let slotValue1 = 0;
			let slotValue2 = 0;

			if (item1.slots.length > 0) {
				slotValue1 += item1.slots[0].level * 100;
			}
			if (item1.slots.length > 1) {
				slotValue1 += item1.slots[1].level * 10;
			}
			if (item1.slots.length > 2) {
				slotValue1 += item1.slots[2].level;
			}
			if (item2.slots.length > 0) {
				slotValue2 += item2.slots[0].level * 100;
			}
			if (item2.slots.length > 1) {
				slotValue2 += item2.slots[1].level * 10;
			}
			if (item2.slots.length > 2) {
				slotValue2 += item2.slots[2].level;
			}

			if (slotValue1 > slotValue2) {
				return -1;
			} else if (slotValue1 < slotValue2) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}
}

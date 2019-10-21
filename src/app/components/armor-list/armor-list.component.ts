import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ItemModel } from '../../models/item.model';
import { SkillModel } from '../../models/skill.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { ItemType } from '../../types/item.type';

@Component({
	selector: 'mhw-builder-armor-list',
	templateUrl: './armor-list.component.html',
	styleUrls: ['./armor-list.component.scss']
})
export class ArmorListComponent implements OnInit {
	public equipmentCategoryType = EquipmentCategoryType;
	private _itemTypeFilters: ItemType[];
	onlyIceborne = true;
	typeSort: string;
	showFilterContainer = false;
	showSortContainer = true;

	@Input()
	set itemTypeFilters(itemTypeFilters: ItemType[]) {
		this._itemTypeFilters = itemTypeFilters;
		this.loadItems();
	}
	get itemTypeFilters(): ItemType[] { return this._itemTypeFilters; }

	@ViewChild('searchBox', { static: true }) searchBox: ElementRef;
	@ViewChild('itemList', { static: false }) itemList: VirtualScrollerComponent;

	items: ItemModel[];
	itemsAll: ItemModel[];
	filteredItems: ItemModel[];
	virtualItems: ItemModel[];

	@HostListener('window:resize')
	onResize() {
		this.refreshList();
	}

	constructor(
		private slotService: SlotService,
		public dataService: DataService
	) { }

	ngOnInit(): void { }

	refreshList() {
		if (this.itemList) {
			this.itemList.refresh();
		}
	}

	onItemListUpdate(items: ItemModel[]) {
		this.virtualItems = items;
	}

	loadItems() {
		this.itemsAll = this.dataService.getArmors();
		this.items = this.itemsAll.filter(f => f.id > 1000);
		this.filteredItems = this.items;
		this.applyItemFilter();
		setTimeout(() => this.searchBox.nativeElement.focus(), 250);
	}

	search(query: string) {
		this.filteredItems = this.items;

		if (query) {
			const alphaIndex = query.indexOf('alpha');
			if (alphaIndex > -1) {
				query = query.replace('alpha', '');
			}
			const betaIndex = query.indexOf('beta');
			if (betaIndex > -1) {
				query = query.replace('beta', '');
			}

			query = query.toLowerCase().trim();

			const queryParts = query.split(' ');

			if (this.items) {
				for (const item of this.items) {
					const itemName = item.name.toLowerCase();
					const skills = this.dataService.getSkills(item.skills);

					const nameMatch = itemName.includes(query);
					const skillMatch = _.some(skills, skill => skill.name.toLowerCase().includes(query));

					const tagMatch = _.some(queryParts, queryPart => {
						return _.some(item.tags, tag => tag.toLowerCase().includes(queryPart));
					});

					if (!nameMatch && !skillMatch && !tagMatch) {
						this.filteredItems = _.reject(this.filteredItems, i => i.name === item.name);
					}
					if (alphaIndex > -1 || betaIndex > -1) {
						const alphaBetaQuery = [];

						if (alphaIndex > -1) {
							alphaBetaQuery.push('α');
						}
						if (betaIndex > -1) {
							alphaBetaQuery.push('β');
						}
						const query2Match = _.some(alphaBetaQuery, queryPart => {
							return itemName.includes(queryPart);
						});
						if (!query2Match) {
							this.filteredItems = _.reject(this.filteredItems, i => i.name === item.name);
						}
					}
				}
				this.filteredItems.sort((a, b) => {
					return (this.getItemTypeIndex(a.itemType) > this.getItemTypeIndex(b.itemType)) ?
						1 : ((this.getItemTypeIndex(b.itemType) > this.getItemTypeIndex(a.itemType)) ?
							-1 : 0);
				});
			}
		} else {
			this.resetSearchResults();
		}
		this.applyItemFilter();
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.filteredItems = this.items;
		this.applyItemFilter();
	}

	applyItemFilter() {
		if (this.filteredItems && this.itemTypeFilters) {
			this.filteredItems = _.reject(this.filteredItems, item => {
				for (const itemType of this.itemTypeFilters) {
					if (item.itemType == itemType) {
						return false;
					}
				}
				return true;
			});
		}
	}

	applyIceborneFilter() {
		this.onlyIceborne = !this.onlyIceborne;
		if (this.onlyIceborne) {
			this.items = this.itemsAll.filter(f => f.id > 1000);
		} else {
			this.items = this.itemsAll;
		}
		this.search(this.searchBox.nativeElement.value);
	}

	selectItem(item: ItemModel) {
		const newItem = Object.assign({}, item);
		if (this.itemTypeFilters.length == 1) {
			this.slotService.selectArmorItemByType(newItem, true);
		} else {
			this.slotService.selectArmorItemByType(newItem);
		}
	}

	addItemTypeFilter(itemTypeFilter: ItemType) {
		const existFilter = this.itemTypeFilters.filter(f => f == itemTypeFilter);
		if (existFilter.length > 0) {
			const index = this.itemTypeFilters.indexOf(existFilter[0], 0);
			if (index > -1) {
				this.itemTypeFilters.splice(index, 1);
			}
		} else {
			this.itemTypeFilters.push(itemTypeFilter);
		}
		this.search(this.searchBox.nativeElement.value);
	}

	getSkillCount(item: ItemModel, skill: SkillModel): string {
		const itemSkill = _.find(item.skills, s => s.id == skill.id);
		const result = `${itemSkill.level}/${skill.levels.length}`;
		return result;
	}

	itemTypeIsSelected(itemType: ItemType) {
		if (this.itemTypeFilters.filter(f => f == itemType).length > 0) {
			return true;
		} else {
			return false;
		}
	}

	itemIsSelected(id: number, itemType: ItemType) {
		let itemId = 0;
		switch (itemType) {
			case ItemType.Head:
				if (this.slotService.headSlot.item) {
					itemId = this.slotService.headSlot.item.id;
				}
				break;
			case ItemType.Chest:
				if (this.slotService.chestSlot.item) {
					itemId = this.slotService.chestSlot.item.id;
				}
				break;
			case ItemType.Hands:
				if (this.slotService.handsSlot.item) {
					itemId = this.slotService.handsSlot.item.id;
				}
				break;
			case ItemType.Legs:
				if (this.slotService.legsSlot.item) {
					itemId = this.slotService.legsSlot.item.id;
				}
				break;
			case ItemType.Feet:
				if (this.slotService.feetSlot.item) {
					itemId = this.slotService.feetSlot.item.id;
				}
				break;
			default:
				break;
		}
		return id == itemId;
	}

	getItemTypeIndex(type: ItemType): number {
		if (type == ItemType.Head) {
			return 1;
		} else if (type == ItemType.Chest) {
			return 2;
		} else if (type == ItemType.Hands) {
			return 3;
		} else if (type == ItemType.Legs) {
			return 4;
		} else if (type == ItemType.Feet) {
			return 5;
		} else {
			return 0;
		}
	}

	sortByDefense() {
		this.typeSort = 'DEF';
		this.filteredItems.sort(function (item1, item2) {
			if (item1.defense[2] > item2.defense[2]) {
				return -1;
			} else if (item1.defense[2] < item2.defense[2]) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	sortByResistance(type: string) {
		this.typeSort = type;
		this.filteredItems.sort(function (item1, item2) {
			let resistance1 = 0;
			let resistance2 = 0;
			if (type == 'FIR') {
				resistance1 = item1.fireResist;
				resistance2 = item2.fireResist;
			} else if (type == 'WAT') {
				resistance1 = item1.waterResist
				resistance2 = item2.waterResist
			} else if (type == 'THU') {
				resistance1 = item1.thunderResist
				resistance2 = item2.thunderResist
			} else if (type == 'ICE') {
				resistance1 = item1.iceResist
				resistance2 = item2.iceResist
			} else if (type == 'DRA') {
				resistance1 = item1.dragonResist
				resistance2 = item2.dragonResist
			}
			if (resistance1 > resistance2) {
				return -1;
			} else if (resistance1 < resistance2) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	sortBySlots() {
		this.typeSort = 'SLOT';
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

import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
	private _onlyIceborne: boolean;

	@Input()
	set itemTypeFilters(itemTypeFilters: ItemType[]) {
		this._itemTypeFilters = itemTypeFilters;
		this.loadItems();
	}
	get itemTypeFilters(): ItemType[] { return this._itemTypeFilters; }

	@Input()
	set onlyIceborne(onlyIceborne: boolean) {
		this._onlyIceborne = onlyIceborne;
		this.search({ key: 'Filter' }, this.searchBox.nativeElement.value);
		this.armorTypeSort = '';
	}
	get onlyIceborne(): boolean { return this._onlyIceborne; }

	@ViewChild('searchBox', { static: true }) searchBox: ElementRef;
	@ViewChild('itemList', { static: false }) itemList: VirtualScrollerComponent;

	itemsAll: ItemModel[];
	itemsWorld: ItemModel[];
	itemsIceborne: ItemModel[];
	filteredItems: ItemModel[];
	virtualItems: ItemModel[];
	armorTypeSort: string;

	headId = 0;
	bodyId = 0;
	armsId = 0;
	torsoId = 0;
	legsId = 0;

	showFilterContainer = false;
	showSortContainer = true;

	@HostListener('window:resize')
	onResize() {
		this.refreshList();
	}

	constructor(
		private slotService: SlotService,
		public dataService: DataService
	) {
		this.itemsAll = this.dataService.getArmors();
		this.itemsAll.sort((a, b) => {
			return (this.getItemTypeIndex(a.itemType) > this.getItemTypeIndex(b.itemType)) ?
				1 : ((this.getItemTypeIndex(b.itemType) > this.getItemTypeIndex(a.itemType)) ?
					-1 : 0);
		});

		this.slotService.itemSelected$.subscribe(item => {
			this.getArmorIds();
		});
		this.slotService.itemSelectedNew$.subscribe(item => {
			this.getArmorIds();
		});
	}

	ngOnInit(): void {
		this.slotService.armorSlotSelected$.subscribe(slot => {
			setTimeout(() => {
				this.searchBox.nativeElement.focus();
				this.searchBox.nativeElement.select();
			}, 250);
		});
		this.getArmorIds();
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
		this.itemsWorld = this.itemsAll.filter(f => f.id < 1000);
		this.itemsIceborne = this.itemsAll.filter(f => f.id >= 1000);

		this.applyIceborneFilter();
		this.applyItemFilter();
		setTimeout(() => this.searchBox.nativeElement.focus(), 250);
	}

	search(event, query: string) {
		if (event && (event.key === 'FilterHard' || event.key === 'Backspace' || event.key === 'Delete')) {
			this.applyIceborneFilter();
		}

		if (query) {
			if (query.length > 2) {
				query = query.toLowerCase().trim();

				const alphaIndex = query.indexOf('alpha');
				if (alphaIndex > -1) {
					query = query.replace('alpha', '');
				}
				const betaIndex = query.indexOf('beta');
				if (betaIndex > -1) {
					query = query.replace('beta', '');
				}
				const gammaIndex = query.indexOf('gamma');
				if (gammaIndex > -1) {
					query = query.replace('gamma', '');
				}

				const queryParts = query.split(' ');

				if (event && event.key === 'FilterSoft' && (alphaIndex > -1 || betaIndex > -1 || gammaIndex > -1)) {
					this.applyIceborneFilter();
				}

				if (this.filteredItems) {
					for (const item of this.filteredItems) {
						const itemName = item.name.toLowerCase();
						const skills = this.dataService.getSkills(item.skills);

						const nameMatch = itemName.includes(query);
						const skillMatch = skills.some(skill => skill.name.toLowerCase().includes(query));

						const tagMatch = queryParts.some(queryPart => {
							return item.tags.some(tag => tag.toLowerCase().includes(queryPart));
						});

						if (!nameMatch && !skillMatch && !tagMatch) {
							this.filteredItems = this.filteredItems.filter(i => i.name != item.name);
						}
						if (alphaIndex > -1 || betaIndex > -1 || gammaIndex > -1) {
							const abgQuery = [];

							if (alphaIndex > -1) {
								abgQuery.push('α');
							}
							if (betaIndex > -1) {
								abgQuery.push('β');
							}
							if (gammaIndex > -1) {
								abgQuery.push('γ');
							}
							const query2Match = abgQuery.some(queryPart => {
								return itemName.includes(queryPart);
							});
							if (!query2Match) {
								this.filteredItems = this.filteredItems.filter(i => i.name != item.name);
							}
						}
					}
				}
				this.applyItemFilter();
			}
		} else {
			this.resetSearchResults();
		}
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.applyIceborneFilter();
		this.applyItemFilter();
		this.armorTypeSort = '';
	}

	applyItemFilter() {
		if (this.filteredItems && this.itemTypeFilters) {
			this.filteredItems = this.filteredItems.filter(item => {
				for (const itemType of this.itemTypeFilters) {
					if (item.itemType == itemType) {
						return true;
					}
				}
				return false;
			});
		}
	}

	applyIceborneFilter() {
		if (this.onlyIceborne) {
			this.filteredItems = this.itemsIceborne;
		} else {
			this.filteredItems = this.itemsIceborne.concat(this.itemsWorld);
		}
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
			this.search({ key: 'FilterSoft' }, this.searchBox.nativeElement.value);
		} else {
			this.itemTypeFilters.push(itemTypeFilter);
			this.search({ key: 'FilterHard' }, this.searchBox.nativeElement.value);
		}
	}

	getSkillCount(item: ItemModel, skill: SkillModel): string {
		const itemSkill = item.skills.find(s => s.id == skill.id);
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
				itemId = this.headId;
				break;
			case ItemType.Chest:
				itemId = this.bodyId;
				break;
			case ItemType.Hands:
				itemId = this.armsId;
				break;
			case ItemType.Legs:
				itemId = this.torsoId;
				break;
			case ItemType.Feet:
				itemId = this.legsId;
				break;
			default:
				break;
		}
		return id == itemId;
	}

	getArmorIds() {
		if (this.slotService.headSlot.item) {
			this.headId = this.slotService.headSlot.item.id;
		} else {
			this.headId = 0;
		}
		if (this.slotService.chestSlot.item) {
			this.bodyId = this.slotService.chestSlot.item.id;
		} else {
			this.bodyId = 0;
		}
		if (this.slotService.handsSlot.item) {
			this.armsId = this.slotService.handsSlot.item.id;
		} else {
			this.armsId = 0;
		}
		if (this.slotService.legsSlot.item) {
			this.torsoId = this.slotService.legsSlot.item.id;
		} else {
			this.torsoId = 0;
		}
		if (this.slotService.feetSlot.item) {
			this.legsId = this.slotService.feetSlot.item.id;
		} else {
			this.legsId = 0;
		}
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
		this.armorTypeSort = 'DEF';
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
		this.armorTypeSort = type;
		this.filteredItems.sort(function (item1, item2) {
			let resistance1 = 0;
			let resistance2 = 0;
			if (type == 'FIR') {
				resistance1 = item1.fireResist;
				resistance2 = item2.fireResist;
			} else if (type == 'WAT') {
				resistance1 = item1.waterResist;
				resistance2 = item2.waterResist;
			} else if (type == 'THU') {
				resistance1 = item1.thunderResist;
				resistance2 = item2.thunderResist;
			} else if (type == 'ICE') {
				resistance1 = item1.iceResist;
				resistance2 = item2.iceResist;
			} else if (type == 'DRA') {
				resistance1 = item1.dragonResist;
				resistance2 = item2.dragonResist;
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
		this.armorTypeSort = 'SLOT';
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

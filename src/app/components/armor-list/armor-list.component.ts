import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
	selector: 'mhw-builder-armor-list',
	templateUrl: './armor-list.component.html',
	styleUrls: ['./armor-list.component.scss']
})
export class ArmorListComponent implements OnInit {
	public equipmentCategoryType = EquipmentCategoryType;
	private _itemTypeFilters: ItemType[];
	onlyIceborne = true;
	hideFilterContainer = true;

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
}

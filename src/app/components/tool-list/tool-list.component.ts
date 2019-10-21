import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ItemModel } from '../../models/item.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { ItemType } from '../../types/item.type';
import { ToolType } from '../../types/tool.type';

@Component({
	selector: 'mhw-builder-tool-list',
	templateUrl: './tool-list.component.html',
	styleUrls: ['./tool-list.component.scss']
})
export class ToolListComponent implements OnInit {
	public itemTypes = ItemType;
	public equipmentCategoryType = EquipmentCategoryType;
	private _itemType: ItemType;
	typeSort: string;

	@Input()
	set itemType(itemType: ItemType) {
		this._itemType = itemType;
		this.loadItems();
	}
	get itemType(): ItemType { return this._itemType; }

	@Output() itemSelected = new EventEmitter<ItemModel>();

	@ViewChild('searchBox', { static: true }) searchBox: ElementRef;
	@ViewChild('itemList', { static: false }) itemList: VirtualScrollerComponent;

	items: ItemModel[];
	filteredItems: ItemModel[];
	virtualItems: ItemModel[];
	toolTypeFilter?: ToolType;
	weaponTypeSort: String;

	hideFilterContainer = false;
	showSortContainer = false;

	childHeight: number;
	constructor(
		private slotService: SlotService,
		public dataService: DataService,
	) { }

	ngOnInit() {
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
		this.items = this.dataService.getTools(this._itemType);
		this.resetSearchResults();
		setTimeout(() => this.searchBox.nativeElement.focus(), 250);
	}

	search(query: string) {
		this.filteredItems = this.items;

		if (query) {
			query = query.toLowerCase().trim();
			const queryParts = query.split(' ');

			if (this.items) {
				for (const item of this.items) {
					const itemName = item.name.toLowerCase();

					const nameMatch = itemName.includes(query);

					const tagMatch = _.some(queryParts, queryPart => {
						return _.some(item.tags, tag => tag.toLowerCase().includes(queryPart));
					});

					if (!nameMatch && !tagMatch) {
						this.filteredItems = _.reject(this.filteredItems, i => i.name === item.name);
					}
				}
			}
		} else {
			this.resetSearchResults();
		}
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.filteredItems = this.items;
		this.applyToolFilter();
	}

	applyToolFilter() {
	}

	selectItem(item: ItemModel) {
		const newItem = Object.assign({}, item);
		this.slotService.selectItem(newItem);
	}

	sortByDuration() {
		this.typeSort = 'DUR';
		this.filteredItems.sort(function (item1, item2) {
			if (item1.duration > item2.duration) {
				return -1;
			} else if (item1.duration < item2.duration) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}

	sortByRecharge() {
		this.typeSort = 'REC';
		this.filteredItems.sort(function (item1, item2) {
			if (item1.recharge < item2.recharge) {
				return -1;
			} else if (item1.recharge > item2.recharge) {
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

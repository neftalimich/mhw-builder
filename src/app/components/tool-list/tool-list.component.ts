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
		this.items = this.dataService.getTools();
		this.resetSearchResults();
		setTimeout(() => this.searchBox.nativeElement.focus(), 250);
	}

	search(query: string) {
		this.filteredItems = this.items;
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
}

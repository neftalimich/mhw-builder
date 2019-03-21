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
	selector: 'mhw-builder-charm-list',
	templateUrl: './charm-list.component.html',
	styleUrls: ['./charm-list.component.scss']
})
export class CharmListComponent implements OnInit {
	public equipmentCategoryType = EquipmentCategoryType;

	private _itemType: ItemType;

	@Input()
	set itemType(itemType: ItemType) {
		this._itemType = itemType;
		this.loadItems();
	}
	get itemType(): ItemType { return this._itemType; }

	@ViewChild('searchBox') searchBox: ElementRef;
	@ViewChild('itemList') itemList: VirtualScrollerComponent;

	items: ItemModel[];
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

	loadItems() {
		this.items = this.dataService.getCharms();
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
					const skills = this.dataService.getSkills(item.skills);

					const nameMatch = itemName.includes(query);
					const skillMatch = _.some(skills, skill => skill.name.toLowerCase().includes(query));

					const tagMatch = _.some(queryParts, queryPart => {
						return _.some(item.tags, tag => tag.toLowerCase().includes(queryPart));
					});

					if (!nameMatch && !skillMatch && !tagMatch) {
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
	}

	onItemListUpdate(items: ItemModel[]) {
		this.virtualItems = items;
	}

	selectItem(item: ItemModel) {
		const newItem = Object.assign({}, item);
		this.slotService.selectItem(newItem);
	}

	getSkillCount(item: ItemModel, skill: SkillModel): string {
		const itemSkill = _.find(item.skills, s => s.id == skill.id);
		const result = `${itemSkill.level}/${skill.levels.length}`;
		return result;
	}
}

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { ItemModel } from '../../models/item.model';
import { DataService } from '../../services/data.service';
import { SkillModel } from '../../models/skill.model';
import * as _ from 'lodash';
import { ItemType } from '../../types/item.type';
import { VirtualScrollComponent } from 'angular2-virtual-scroll';
import { SlotService } from '../../services/slot.service';

@Component({
	selector: 'mhw-builder-armor-list',
	templateUrl: './armor-list.component.html',
	styleUrls: ['./armor-list.component.scss']
})
export class ArmorListComponent implements OnInit {
	public equipmentCategoryType = EquipmentCategoryType;

	private _itemType: ItemType;

	@Input()
	set itemType(itemType: ItemType) {
		this._itemType = itemType;
		this.loadItems();
	}
	get itemType(): ItemType { return this._itemType; }

	@ViewChild('searchBox') searchBox: ElementRef;
	@ViewChild('itemList') itemList: VirtualScrollComponent;

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
		this.items = this.dataService.getArmorByType(this.itemType);
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

	@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
		if (event.keyCode === 13) {
			document.getElementById('dummy').focus();
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

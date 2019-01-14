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
import { promise } from 'selenium-webdriver';

@Component({
	selector: 'mhw-builder-weapon-list',
	templateUrl: './weapon-list.component.html',
	styleUrls: ['./weapon-list.component.scss']
})
export class WeaponListComponent implements OnInit {
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

	@ViewChild('searchBox') searchBox: ElementRef;
	@ViewChild('itemList') itemList: VirtualScrollerComponent;

	items: ItemModel[];
	filteredItems: ItemModel[];
	virtualItems: ItemModel[];
	weaponTypeFilter?: WeaponType;
	weaponTypeSort: String;

	childHeight: number;

	@HostListener('window:resize')
	onResize() {
		this.refreshList();
	}

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
		this.items = this.dataService.getWeapons();
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

					let match = _.some(queryParts, queryPart => {
						const nameMatch = itemName.includes(queryPart);
						const skillMatch = _.some(skills, skill => skill.name.toLowerCase().includes(queryPart));
						const tagMatch = _.some(item.tags, tag => tag.toLowerCase().includes(queryPart));

						return nameMatch || skillMatch || tagMatch;
					});

					let hiddenMatch = true;
					if (_.some(queryParts, queryPart => queryPart === 'hidden')) {
						hiddenMatch = (item.elementHidden || item.ailmentHidden);

						if (queryParts.length < 2) {
							match = true;
						}
					}

					if (!match || !hiddenMatch) {
						this.filteredItems = _.reject(this.filteredItems, i => i.name === item.name);
					}
				}
			}

			this.applyWeaponFilter();
		} else {
			this.resetSearchResults();
		}
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.filteredItems = this.items;
		this.applyWeaponFilter();
	}

	applyWeaponFilter() {
		if (this.filteredItems && this.weaponTypeFilter && this.itemType == ItemType.Weapon) {
			this.filteredItems = _.reject(this.filteredItems, item => item.weaponType != this.weaponTypeFilter);
		}
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

	weaponFilterClicked(weaponType: WeaponType) {
		if (!this.weaponTypeFilter || this.weaponTypeFilter != weaponType) {
			this.weaponTypeFilter = weaponType;
		} else if (this.weaponTypeFilter == weaponType) {
			this.weaponTypeFilter = null;
		}

		this.search(this.searchBox.nativeElement.value);
		this.weaponTypeSort = '';
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
			if (item1.ailmentBaseAttack > item2.ailmentBaseAttack) {
				return -1;
			} else if (item1.ailmentBaseAttack < item2.ailmentBaseAttack) {
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
			if (item1.elementBaseAttack > item2.elementBaseAttack) {
				return -1;
			} else if (item1.elementBaseAttack < item2.elementBaseAttack) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualItems = this.filteredItems;
	}
}

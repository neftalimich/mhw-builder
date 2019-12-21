import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { EquippedSetBonusDetailModel } from '../../models/equipped-set-bonus.model';
import { SetBonusModel } from '../../models/set-bonus.model';
import { SkillModel } from '../../models/skill.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { ModeType } from '../../types/mode.type';

@Component({
	selector: 'mhw-builder-setbonus-list',
	templateUrl: './setbonus-list.component.html',
	styleUrls: ['./setbonus-list.component.scss']
})
export class SetbonusListComponent implements OnInit {
	@Output() setbonusSelected = new EventEmitter<SetBonusModel>();

	@ViewChild('searchBox', { static: true }) searchBox: ElementRef;
	@ViewChild('setbonusList', { static: false }) setbonusList: VirtualScrollerComponent;

	setbonuses: SetBonusModel[];
	filteredSetbonuses: SetBonusModel[];
	virtualSetbonuses: SetBonusModel[];

	@HostListener('window:resize')
	onResize() {
		this.refreshList();
	}

	constructor(
		public dataService: DataService,
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void {
		this.loadItems();
	}

	refreshList() {
		if (this.setbonusList) {
			this.setbonusList.refresh();
		}
	}

	onSetbonusListUpdate(setbonuses: SetBonusModel[]) {
		this.virtualSetbonuses = setbonuses;
	}

	loadItems() {
		this.setbonuses = this.dataService.getSetBonuses();
		this.setbonuses = this.setbonuses.sort((a, b) => {
			if (a.name > b.name) {
				return 1;
			} else if (a.name < b.name) {
				return -1;
			} else {
				return 0;
			}
		});
		this.resetSearchResults();
		setTimeout(() => this.searchBox.nativeElement.focus(), 250);
	}

	search(query: string) {
		this.filteredSetbonuses = this.setbonuses;

		if (query) {
			query = query.toLowerCase().trim();
			const queryParts = query.split(' ');

			if (this.setbonuses) {
				for (const setbonus of this.setbonuses) {
					const itemName = setbonus.name.toLowerCase();

					const nameMatch = itemName.includes(query);

					if (!nameMatch) {
						this.filteredSetbonuses = _.reject(this.filteredSetbonuses, d => d.name === setbonus.name);
					}
				}
			}
		} else {
			this.resetSearchResults();
		}
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.filteredSetbonuses = this.setbonuses;
	}

	selectSetbonus(setbonus: SetBonusModel) {
		const newSetbonus = Object.assign({}, setbonus);
		this.slotService.selectSetbonus(newSetbonus);
	}

	getSkills(setbonus: SetBonusModel): EquippedSetBonusDetailModel[] {
		const result: EquippedSetBonusDetailModel[] = [];
		for (const level of setbonus.setLevels) {
			let skill: SkillModel = JSON.parse(JSON.stringify(this.dataService.getSkill(level.id)));
			let setbonus: EquippedSetBonusDetailModel = {
				skill: skill,
				mode: ModeType.Active,
				requiredCount: level.pieces
			};
			result.push(setbonus);
		}
		return result;
	}
}

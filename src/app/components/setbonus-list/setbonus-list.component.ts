import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { SkillModel } from '../../models/skill.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { SetBonusModel } from '../../models/set-bonus.model';

@Component({
	selector: 'mhw-builder-setbonus-list',
	templateUrl: './setbonus-list.component.html',
	styleUrls: ['./setbonus-list.component.scss']
})
export class SetbonusListComponent implements OnInit {

	//@Input()
	//set setbonusLevel(setbonusLevel: number) {
	//	this._setbonusLevel = setbonusLevel;
	//	this.loadItems();
	//}
	//get setbonusLevel(): number { return this._setbonusLevel; }

	//@Output() setbonusSelected = new EventEmitter<SetbonusModel>();

	@ViewChild('searchBox', { static: true }) searchBox: ElementRef;
	@ViewChild('setbonusList', { static: false }) setbonusList: VirtualScrollerComponent;

	setbonuses: SetBonusModel[];
	filteredSetbonuss: SetBonusModel[];
	virtualSetbonuss: SetBonusModel[];

	@HostListener('window:resize')
	onResize() {
		this.refreshList();
	}

	constructor(
		public dataService: DataService,
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void { }

	refreshList() {
		if (this.setbonusList) {
			this.setbonusList.refresh();
		}
	}

	onSetbonusListUpdate(setbonuss: SetBonusModel[]) {
		this.virtualSetbonuss = setbonuss;
	}

	loadItems() {
		this.setbonuses = this.dataService.getSetBonuses();
		this.resetSearchResults();
		setTimeout(() => this.searchBox.nativeElement.focus(), 250);
	}

	search(query: string) {
		this.filteredSetbonuss = this.setbonuses;

		//if (query) {
		//	query = query.toLowerCase().trim();
		//	const queryParts = query.split(' ');

		//	if (this.setbonuses) {
		//		for (const setbonus of this.setbonuses) {
		//			const itemName = setbonus.name.toLowerCase();
		//			const skills = this.dataService.getSkills(setbonus.skills);

		//			const nameMatch = itemName.includes(query);

		//			let skillMatch = true;
		//			for (const queryPart of queryParts) {
		//				skillMatch = _.some(skills, skill => skill.name.toLowerCase().includes(queryPart));
		//				if (!skillMatch) {
		//					break;
		//				}
		//			}

		//			if (!nameMatch && !skillMatch) {
		//				this.filteredSetbonuss = _.reject(this.filteredSetbonuss, d => d.name === setbonus.name);
		//			}
		//		}
		//	}
		//} else {
		//	this.resetSearchResults();
		//}
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.filteredSetbonuss = this.setbonuses;
	}

	selectSetbonus(setbonus: SetBonusModel) {
		//const newSetbonus = Object.assign({}, setbonus);
		//this.slotService.selectSetbonus(newSetbonus);
	}

	getSkills(setbonus: SetBonusModel): SkillModel[] {
		const result: SkillModel[] = [];
		//for (const skill of setbonus.skills) {
		//	result.push(this.dataService.getSkill(skill.id));
		//}
		return result;
	}

	getSkillCount(setbonus: SetBonusModel, skill: SkillModel): string {
		//const itemSkill = _.find(setbonus.skills, s => s.id == skill.id);
		//const result = `${itemSkill.level}/${skill.levels.length}`;
		//return result;
		return '';
	}
}

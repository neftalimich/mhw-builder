import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ElementType } from 'src/app/types/element.type';
import { KinsectModel } from '../../models/kinsect.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';

@Component({
	selector: 'mhw-builder-kinsect-list',
	templateUrl: './kinsect-list.component.html',
	styleUrls: ['./kinsect-list.component.scss']
})
export class KinsectListComponent implements OnInit {
	private onlyIceborne = true;

	@ViewChild('searchBox', { static: true }) searchBox: ElementRef;
	@ViewChild('itemList', { static: false }) itemList: VirtualScrollerComponent;

	kinsects: KinsectModel[];
	kinsectsWorld: KinsectModel[];
	kinsectsIceborne: KinsectModel[];
	filteredKinsects: KinsectModel[];
	virtualKinsects: KinsectModel[];

	showSortContainer = true;
	sortType = '';

	@HostListener('window:resize')
	onResize() {
		this.refreshList();
	}

	constructor(
		private slotService: SlotService,
		private dataService: DataService
	) { }

	ngOnInit() {
		this.loadKinsects();
	}

	refreshList() {
		if (this.itemList) {
			this.itemList.refresh();
		}
	}

	loadKinsects() {
		this.kinsects = this.dataService.getKinsects();
		this.kinsectsWorld = this.kinsects.filter(item => item.id <= 100);
		this.kinsectsIceborne = this.kinsects.filter(item => item.id > 100);
		this.resetSearchResults();
	}

	search(query: string) {
		this.applyIceborneFilter();

		if (query) {
			query = query.toLocaleLowerCase().trim();

			this.filteredKinsects = _.filter(this.filteredKinsects, (k: KinsectModel) =>
				k.name.toLocaleLowerCase().includes(query) ||
				k.attackType.toString().toLocaleLowerCase().includes(query) ||
				k.dustEffect.toString().toLocaleLowerCase().includes(query));
		} else {
			this.resetSearchResults();
		}
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.applyIceborneFilter();
		this.sortType = '';
	}

	applyIceborneFilter() {
		if (this.onlyIceborne) {
			this.filteredKinsects = this.kinsectsIceborne;
		} else {
			this.filteredKinsects = this.kinsectsIceborne.concat(this.kinsectsWorld);
		}
	}

	setOnlyIceborne() {
		this.onlyIceborne = !this.onlyIceborne;
		this.applyIceborneFilter();
	}

	onKinsectListUpdate(kinsects: KinsectModel[]) {
		this.virtualKinsects = kinsects;
	}

	selectKinsect(kinsect: KinsectModel) {
		const newKinsect = Object.assign({}, kinsect);
		newKinsect.element = ElementType.None;
		this.slotService.selectKinsect(newKinsect);
	}

	sortByProperty(property: string) {
		this.sortType = property;
		this.filteredKinsects.sort(function (a, b) {
			if (a[property] > b[property]) {
				return -1;
			} else if (a[property] < b[property]) {
				return 1;
			} else {
				return 0;
			}
		});
		this.virtualKinsects = this.filteredKinsects;
	}
}

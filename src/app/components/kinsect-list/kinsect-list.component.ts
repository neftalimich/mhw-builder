import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { KinsectModel } from '../../models/kinsect.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { ElementType } from 'src/app/types/element.type';

@Component({
	selector: 'mhw-builder-kinsect-list',
	templateUrl: './kinsect-list.component.html',
	styleUrls: ['./kinsect-list.component.scss']
})
export class KinsectListComponent implements OnInit {

	@ViewChild('searchBox') searchBox: ElementRef;
	@ViewChild('itemList') itemList: VirtualScrollerComponent;

	kinsects: KinsectModel[];
	filteredKinsects: KinsectModel[];
	virtualKinsects: KinsectModel[];

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
		this.resetSearchResults();
	}

	search(query: string) {
		this.filteredKinsects = this.kinsects;

		if (query) {
			query = query.toLocaleLowerCase().trim();

			this.filteredKinsects = _.filter(this.kinsects, (k: KinsectModel) =>
				k.name.toLocaleLowerCase().includes(query) ||
				k.type.toString().toLocaleLowerCase().includes(query) ||
				k.dustEffect.toString().toLocaleLowerCase().includes(query));
		} else {
			this.resetSearchResults();
		}
	}

	resetSearchResults() {
		this.searchBox.nativeElement.value = null;
		this.filteredKinsects = this.kinsects;
	}

	onKinsectListUpdate(kinsects: KinsectModel[]) {
		this.virtualKinsects = kinsects;
	}

	selectKinsect(kinsect: KinsectModel) {
		const newKinsect = Object.assign({}, kinsect);
		newKinsect.element = ElementType.None;
		this.slotService.selectKinsect(newKinsect);
	}
}

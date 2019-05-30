import { Component, ContentChildren, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';

@Component({
	selector: 'mhw-builder-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
	isOpen = false;

	@ViewChild('container', { static: true }) container: ElementRef;
	@ContentChildren(ElementRef, { descendants: true }) items: QueryList<ElementRef>;

	constructor() { }

	ngOnInit() {
	}

	public toggle(event: Event) {
		event.stopPropagation();
		this.isOpen = !this.isOpen;
	}

	public open() {
		this.isOpen = true;
	}

	public close() {
		this.isOpen = false;
	}
}

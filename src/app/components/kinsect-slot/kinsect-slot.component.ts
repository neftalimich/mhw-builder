import { Component, OnInit, ViewChild } from '@angular/core';
import { KeyValuePair } from '../../models/common/key-value-pair.model';
import { KinsectModel } from '../../models/kinsect.model';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { ElementType } from '../../types/element.type';
import { ItemType } from '../../types/item.type';
import { PointerType } from '../../types/pointer.type';
import { DropdownComponent } from '../common/dropdown/dropdown.component';

@Component({
	selector: 'mhw-builder-kinsect-slot',
	templateUrl: './kinsect-slot.component.html',
	styleUrls: ['./kinsect-slot.component.scss']
})
export class KinsectSlotComponent implements OnInit {
	slotName = ItemType.Kinsect;
	elementTypes = ElementType;
	kinsect: KinsectModel;
	elements: KeyValuePair<string, string>[];

	public selected: boolean;

	@ViewChild(DropdownComponent) elementDropdown: DropdownComponent;

	constructor(
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void {
		this.elements = [];
		Object.keys(ElementType).map(key => {
			this.elements.push({ key: key, value: key });
		});
	}

	clicked() {
		this.slotService.selectKinsectSlot(this);
	}

	clearClicked(event: Event) {
		event.stopPropagation();
		this.slotService.clearKinsectSlot(this);
		this.clearTooltipKinsect();
	}

	setTooltipKinsect(event: PointerEvent, kinsect: KinsectModel) {
		if (event.pointerType == PointerType.Mouse) {
			this.tooltipService.setKinsect(kinsect);
		}
	}

	clearTooltipKinsect() {
		this.tooltipService.setKinsect(null);
	}

	selectElement(selectedElement: ElementType) {
		this.kinsect.element = selectedElement;
		this.slotService.selectKinsectSlot(this);
		this.slotService.selectKinsect(this.kinsect);
	}

	getElementIcon(element: ElementType): string {
		let assetPath;
		if (element && element != ElementType.None) {
			assetPath = `${element.toLowerCase()}-icon`;
		}
		return `assets/images/${assetPath}.png`;
	}
}

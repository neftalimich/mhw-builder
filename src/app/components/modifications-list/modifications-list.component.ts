import { Component, OnInit } from '@angular/core';
import { ModificationModel } from '../../models/modification.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { PointerType } from '../../types/pointer.type';

@Component({
	selector: 'mhw-builder-modifications-list',
	templateUrl: './modifications-list.component.html',
	styleUrls: ['./modifications-list.component.scss']
})
export class ModificationsListComponent implements OnInit {
	modifications: ModificationModel[];

	constructor(
		private dataService: DataService,
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void {
		this.loadItems();
	}

	loadItems() {
		this.modifications = this.dataService.getModifications();
	}

	selectModification(modification: ModificationModel) {
		const newModification = Object.assign({}, modification);
		this.slotService.selectModification(newModification);
	}

	setTooltipModification(event: PointerEvent, modification: ModificationModel) {
		if (event.pointerType == PointerType.Mouse) {
			this.tooltipService.setModification(modification);
		}
	}

	clearTooltipModification() {
		this.tooltipService.setModification(null);
	}
}

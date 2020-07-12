import { Component, OnInit } from '@angular/core';
import { EquipmentService } from 'src/app/services/equipment.service';
import { TooltipService } from '../../services/tooltip.service';

@Component({
	selector: 'mhw-builder-equipped-buffs',
	templateUrl: './equipped-buffs.component.html',
	styleUrls: ['./equipped-buffs.component.scss']
})

export class EquippedBuffsComponent implements OnInit {

	buffsVisible = true;
	elementBuffActive = 0;

	constructor(
		private equipementService: EquipmentService,
		private tooltipService: TooltipService,
	) { }

	ngOnInit() {
	}
	buffElementLarge() {
		if (this.elementBuffActive != 3) {
			this.elementBuffActive = 3;
		} else {
			this.elementBuffActive = 0;
		}

		this.equipementService.updateElementBuff(this.elementBuffActive);
	}
}

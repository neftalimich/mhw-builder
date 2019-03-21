import { Component, Input, OnInit } from '@angular/core';
import { EquippedSetBonusModel } from '../../models/equipped-set-bonus.model';
import { TooltipService } from '../../services/tooltip.service';

@Component({
	selector: 'mhw-builder-set-bonus-details',
	templateUrl: './set-bonus-details.component.html',
	styleUrls: ['./set-bonus-details.component.scss']
})
export class SetBonusDetailsComponent implements OnInit {

	@Input() equippedSetBonus: EquippedSetBonusModel;

	constructor(
		private tooltipService: TooltipService
	) { }

	ngOnInit() { }

	clearSetBonus() {
		this.tooltipService.setEquippedSetBonus(null);
	}

	getLevelColor(equipped: boolean): string {
		return equipped ? '#F0E68C' : 'white';
	}
}

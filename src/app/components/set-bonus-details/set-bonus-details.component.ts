import { Component, Input, OnInit } from '@angular/core';
import { EquippedSkillModel } from '../../models/equipped-skill.model';
import { SkillModel } from '../../models/skill.model';
import { TooltipService } from '../../services/tooltip.service';
import { EquippedSetBonusModel } from '../../models/equipped-set-bonus.model';

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

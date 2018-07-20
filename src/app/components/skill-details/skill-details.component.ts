import { Component, Input, OnInit } from '@angular/core';
import { EquippedSkillModel } from '../../models/equipped-skill.model';
import { SkillModel } from '../../models/skill.model';
import { TooltipService } from '../../services/tooltip.service';

@Component({
	selector: 'mhw-builder-skill-details',
	templateUrl: './skill-details.component.html',
	styleUrls: ['./skill-details.component.scss']
})
export class SkillDetailsComponent implements OnInit {

	@Input() equippedSkill: EquippedSkillModel;
	@Input() skill: SkillModel;

	constructor(
		private tooltipService: TooltipService
	) { }

	ngOnInit() { }

	clearSkill() {
		this.tooltipService.setEquippedSkill(null);
	}

	getLevelColor(level: number): string {
		return Math.min(this.equippedSkill.equippedCount, this.equippedSkill.totalLevelCount) == level ? '#86ff86' : 'white';
	}
}

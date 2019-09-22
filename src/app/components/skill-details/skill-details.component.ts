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
		let color = 'white';
		if (level == Math.min(this.equippedSkill.equippedArmorCount + this.equippedSkill.equippedToolActiveCount, this.equippedSkill.totalLevelCount)) {
			color = 'rgb(134, 255, 134)';
		}
		if (level == Math.min(this.equippedSkill.equippedArmorCount, this.equippedSkill.totalLevelCount)) {
			color = '#87cefa';
		}
		return color;
	}
}

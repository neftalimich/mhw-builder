import { Component, OnInit } from '@angular/core';
import { EquippedSetBonusModel } from '../../models/equipped-set-bonus.model';
import { EquippedSkillModel } from '../../models/equipped-skill.model';
import { SkillService } from '../../services/skill.service';
import { TooltipService } from '../../services/tooltip.service';
import { PointerType } from '../../types/pointer.type';

@Component({
	selector: 'mhw-builder-equipped-skills',
	templateUrl: './equipped-skills.component.html',
	styleUrls: ['./equipped-skills.component.scss']
})
export class EquippedSkillsComponent implements OnInit {
	skills: EquippedSkillModel[];
	setBonuses: EquippedSetBonusModel[];

	skillsVisible = true;

	constructor(
		private skillService: SkillService,
		private tooltipService: TooltipService
	) { }

	ngOnInit() {
		this.skillService.skillsUpdated$.subscribe(skills => {
			this.skills = skills;
			this.skills.sort(function (skill1, skill2) {
				if (skill1.isSetBonus && !skill2.isSetBonus) {
					return 1;
				} if (!skill1.isSetBonus && skill2.isSetBonus) {
					return -1;
				} else if (skill1.equippedCount > skill2.equippedCount) {
					return -1;
				} else if (skill1.equippedCount < skill2.equippedCount) {
					return 1;
				} else if (skill1.totalLevelCount > skill2.totalLevelCount) {
					return -1;
				} else if (skill1.totalLevelCount < skill2.totalLevelCount) {
					return 1;
				} else {
					return skill1.name.localeCompare(skill2.name);
				}
			});
		});

		this.skillService.setBonusesUpdated$.subscribe(setBonuses => {
			this.setBonuses = setBonuses;
		});
	}

	getSkillCountColor(skill: EquippedSkillModel): string {
		if (skill.isSetBonus) {
			return '#F0E68C';
		} else if (skill.equippedCount > skill.totalLevelCount) {
			return '#e4ff1a';
		} else if (skill.equippedCount == skill.totalLevelCount) {
			return '#86ff86';
		}

		return 'white';
	}

	getSetBonusColor(equippedCount: number, requiredCount: number): string {
		if (equippedCount > requiredCount) {
			return '#e4ff1a';
		} else if (equippedCount == requiredCount) {
			return '#F0E68C';
		}
		return 'white';
	}

	showSkillDetails(event: PointerEvent, equippedSkill: EquippedSkillModel) {
		if (event.pointerType == PointerType.Mouse) {
			this.tooltipService.setEquippedSkill(equippedSkill);
		}
	}

	clearSkillDetails() {
		this.tooltipService.setEquippedSkill(null);
	}

	showOnClickSkillDetails(equippedSkill: EquippedSkillModel) {
		this.tooltipService.setEquippedSkill(equippedSkill);
	}

	showSetBonusDetails(event: PointerEvent, equippedSetBonus: EquippedSetBonusModel) {
		if (event.pointerType == PointerType.Mouse) {
			this.tooltipService.setEquippedSetBonus(equippedSetBonus);
		}
	}

	clearSetBonusDetails() {
		this.tooltipService.setEquippedSetBonus(null);
	}

	showOnClickSetBonusDetails(equippedSetBonus: EquippedSetBonusModel) {
		this.tooltipService.setEquippedSetBonus(equippedSetBonus);
	}
}

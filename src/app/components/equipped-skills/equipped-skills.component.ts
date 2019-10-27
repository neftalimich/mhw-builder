import { Component, OnInit } from '@angular/core';
import { EquippedSetBonusDetailModel, EquippedSetBonusModel } from '../../models/equipped-set-bonus.model';
import { EquippedSkillModel } from '../../models/equipped-skill.model';
import { EquipmentService } from '../../services/equipment.service';
import { SkillService } from '../../services/skill.service';
import { TooltipService } from '../../services/tooltip.service';
import { ModeType } from '../../types/mode.type';
import { PointerType } from '../../types/pointer.type';

@Component({
	selector: 'mhw-builder-equipped-skills',
	templateUrl: './equipped-skills.component.html',
	styleUrls: ['./equipped-skills.component.scss']
})
export class EquippedSkillsComponent implements OnInit {
	skills: EquippedSkillModel[];
	skillsBackup: EquippedSkillModel[];
	setBonuses: EquippedSetBonusModel[];

	skillsVisible = true;

	constructor(
		private skillService: SkillService,
		private equipmentService: EquipmentService,
		private tooltipService: TooltipService
	) { }

	ngOnInit() {
		this.skillService.skillsUpdated$.subscribe(skills => {
			this.skills = skills;
			this.skillsBackup = JSON.parse(JSON.stringify(this.skills));
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

	getMinCount(tool1Count: number, tool2Count: number) {
		return Math.min(tool1Count, tool2Count);
	}

	getMaxCount(tool1Count: number, tool2Count: number) {
		return Math.max(tool1Count, tool2Count);
	}

	getSkillCountColor(skill: EquippedSkillModel): string {
		if (skill.isSetBonus) {
			return '#F0E68C';
		} else if (skill.equippedArmorCount > skill.totalLevelCount) {
			return '#ffa07a';
		} else if (skill.equippedArmorCount == skill.totalLevelCount) {
			return '#87cefa';
		} else if (skill.equippedCount + skill.equippedToolActiveCount >= skill.totalLevelCount) {
			return '#86ff86';
		}

		return 'white';
	}

	getSetBonusColor(equippedCount: number, requiredCount: number): string {
		if (equippedCount >= requiredCount) {
			return '#87cefa';
		}
		return 'rgba(200,200,200,0.5)';
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

	skillMode(equippedSkill: EquippedSkillModel) {
		if (equippedSkill.mode == ModeType.AllSkillActive) {
			equippedSkill.mode = ModeType.Active;
		} else if (equippedSkill.mode == ModeType.Active) {
			equippedSkill.mode = ModeType.Inactive;
		} else if (equippedSkill.mode == ModeType.Inactive) {
			if (equippedSkill.hasActiveStats) {
				equippedSkill.mode = ModeType.AllSkillActive;
			} else {
				equippedSkill.mode = ModeType.Active;
			}
		}
		this.equipmentService.updateSkillMode(this.skills);
	}

	SetbonusSkillMode(detail: EquippedSetBonusDetailModel, equippedCount: number) {
		if (equippedCount >= detail.requiredCount && detail.skill.levels[0].activeSkills) {
			if (detail.mode == ModeType.Active) {
				detail.mode = ModeType.AllSkillActive;
				for (const skillExtra of detail.skill.levels[0].activeSkills) {
					let equippedSkill = new EquippedSkillModel();
					equippedSkill = this.skills.find(es => es.id == skillExtra.id);
					if (!equippedSkill) {
						equippedSkill = this.skillService.createEquippedSkill(skillExtra.id, skillExtra.level);
						equippedSkill.isNatureBonus = true;
						this.skills.push(equippedSkill);
					} else {
						if (skillExtra.level > equippedSkill.equippedCount) {
							equippedSkill.equippedCount = skillExtra.level;
							equippedSkill.equippedArmorCount = skillExtra.level;
							equippedSkill.isNatureBonus = true;
						}
					}
					this.equipmentService.updateSkillMode(this.skills);
				}
			} else if (detail.mode == ModeType.AllSkillActive) {
				detail.mode = ModeType.Active;
				for (const skillExtra of detail.skill.levels[0].activeSkills) {
					let equippedSkill = new EquippedSkillModel();
					equippedSkill = this.skillsBackup.find(es => es.id == skillExtra.id);
					if (!equippedSkill) {
						const skillIndex = this.skills.findIndex(es => es.id == skillExtra.id);
						if (skillIndex > -1) {
							this.skills.splice(skillIndex, 1);
						}
					} else {
						const skillIndex = this.skills.findIndex(es => es.id == skillExtra.id);
						if (skillIndex > -1) {
							this.skills[skillIndex] = equippedSkill;
						}
					}
				}
				this.equipmentService.updateSkillMode(this.skills);
			}
		}
	}

	getModeColor(mode: ModeType) {
		if (mode == 1) {
			return '';
		} else if (mode == 2) {
			return 'rgba(200,200,200,0.5)';
		} else if (mode == 3) {
			return '#0091c2';
		} else {
			return '';
		}
	}

	getIconModeClass(mode: ModeType) {
		if (mode == 1) {
			return 'fas fa-circle';
		} else if (mode == 2) {
			return 'far fa-circle';
		} else if (mode == 3) {
			return 'fas fa-circle';
		} else {
			return '';
		}

	}
}

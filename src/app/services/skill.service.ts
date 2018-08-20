import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { AugmentationModel } from '../models/augmentation.model';
import { DecorationModel } from '../models/decoration.model';
import { EquippedSetBonusDetailModel } from '../models/equipped-set-bonus-detail.model';
import { EquippedSetBonusModel } from '../models/equipped-set-bonus.model';
import { EquippedSkillModel } from '../models/equipped-skill.model';
import { ItemModel } from '../models/item.model';
import { ItemType } from '../types/item.type';
import { DataService } from './data.service';

@Injectable()
export class SkillService {
	public skillsUpdated$ = new Subject<EquippedSkillModel[]>();
	public setBonusesUpdated$ = new Subject<EquippedSetBonusModel[]>();

	public skills: EquippedSkillModel[];
	public setBonuses: EquippedSetBonusModel[];

	constructor(
		private dataService: DataService
	) {
	}

	updateSkills(items: ItemModel[], decorations: DecorationModel[], augmentations: AugmentationModel[]) {
		const equippedSkills = new Array<EquippedSkillModel>();
		const equippedSetBonuses = new Array<EquippedSetBonusModel>();

		// IMPROVEMENT: this code loops through items several times.
		this.addItemSkills(items, equippedSkills);
		this.addDecorationSkills(decorations, equippedSkills);
		this.addSetSkills(items, equippedSkills, equippedSetBonuses);
		this.addAugmentationSkills(augmentations, equippedSkills);

		this.skills = equippedSkills;
		this.setBonuses = equippedSetBonuses;

		this.skillsUpdated$.next(this.skills);
		this.setBonusesUpdated$.next(this.setBonuses);
	}

	private addItemSkills(items: ItemModel[], equippedSkills: EquippedSkillModel[]) {
		for (const item of items) {
			if (!item.skills) {
				continue;
			}

			for (const itemSkill of item.skills) {
				if (!itemSkill.level) {
					continue;
				}

				let equippedSkill = _.find(equippedSkills, es => es.id == itemSkill.id);
				const equippedCount = itemSkill.level * (item.equippedLevel ? item.equippedLevel : 1);
				if (!equippedSkill) {
					const skill = this.dataService.getSkill(itemSkill.id);
					equippedSkill = new EquippedSkillModel();
					equippedSkill.skill = skill;
					equippedSkill.id = skill.id;
					equippedSkill.name = skill.name;
					equippedSkill.description = skill.description;
					equippedSkill.equippedCount = equippedCount;
					equippedSkill.totalLevelCount = skill.levels.length;
					this.countSkillItemPart(equippedSkill, equippedCount, item.itemType);
					equippedSkills.push(equippedSkill);
				} else {
					equippedSkill.equippedCount += equippedCount;
					this.countSkillItemPart(equippedSkill, equippedCount, item.itemType);
				}
			}
		}
	}

	private addDecorationSkills(decorations: DecorationModel[], equippedSkills: EquippedSkillModel[]) {
		for (const decoration of decorations) {
			if (!decoration.skills) {
				continue;
			}

			for (const itemSkill of decoration.skills) {
				if (!itemSkill.level) {
					continue;
				}

				let equippedSkill = _.find(equippedSkills, es => es.id == itemSkill.id);
				const equippedCount = itemSkill.level;
				if (!equippedSkill) {
					const skill = this.dataService.getSkill(itemSkill.id);
					equippedSkill = new EquippedSkillModel();
					equippedSkill.skill = skill;
					equippedSkill.id = skill.id;
					equippedSkill.name = skill.name;
					equippedSkill.description = skill.description;
					equippedSkill.equippedCount = equippedCount;
					equippedSkill.totalLevelCount = skill.levels.length;
					this.countSkillItemPart(equippedSkill, equippedCount, decoration.itemType);
					equippedSkills.push(equippedSkill);
				} else {
					equippedSkill.equippedCount += equippedCount;
					this.countSkillItemPart(equippedSkill, equippedCount, decoration.itemType);
				}
			}
		}
	}

	private addSetSkills(items: ItemModel[], equippedSkills: EquippedSkillModel[], equippedSetBonuses: EquippedSetBonusModel[]) {
		let setBonusNames = new Array<string>();
		const setBonusParts = [];

		for (const item of items) {
			if (!item.skills) {
				continue;
			}

			for (const skill of item.skills) {
				if (!skill.level && skill.id.length > 1) {
					setBonusNames.push(skill.id);
					setBonusParts.push([skill.id, item.itemType]);
				}
			}
		}

		const setCounts = _.countBy(setBonusNames);
		setBonusNames = _.uniq(setBonusNames);
		for (const setBonusName of setBonusNames) {
			const setBonus = this.dataService.getSetBonus(setBonusName);
			const setLevels = _.filter(setBonus.setLevels, sl => sl.pieces <= setCounts[setBonusName]);
			const setParts = _.filter(setBonusParts, x => x[0].localeCompare(setBonusName) == 0);

			const headCount = _.filter(setParts, x => x[1] == 'Head').length > 0 ? 1 : 0;
			const chestCount = _.filter(setParts, x => x[1] == 'Chest').length > 0 ? 1 : 0;
			const handsCount = _.filter(setParts, x => x[1] == 'Hands').length > 0 ? 1 : 0;
			const legsCount = _.filter(setParts, x => x[1] == 'Legs').length > 0 ? 1 : 0;
			const feetCount = _.filter(setParts, x => x[1] == 'Feet').length > 0 ? 1 : 0;
			if (setLevels) {
				for (const setLevel of setLevels) {
					let equippedSkill = _.find(equippedSkills, es => es.id == setLevel.id);

					if (!equippedSkill) {
						const skill = this.dataService.getSkill(setLevel.id);
						equippedSkill = new EquippedSkillModel();
						equippedSkill.skill = skill;
						equippedSkill.id = skill.id;
						equippedSkill.name = skill.name;
						equippedSkill.description = skill.description;
						equippedSkill.headCount = headCount;
						equippedSkill.chestCount = chestCount;
						equippedSkill.handsCount = handsCount;
						equippedSkill.legsCount = legsCount;
						equippedSkill.feetCount = feetCount;
						equippedSkill.isSetBonus = true;
						equippedSkill.equippedCount = 1;
						equippedSkill.totalLevelCount = skill.levels.length;
						equippedSkills.push(equippedSkill);
					}
				}
			}

			const equippedSetBonus = new EquippedSetBonusModel();
			equippedSetBonus.id = setBonus.id;
			equippedSetBonus.name = setBonus.name;
			equippedSetBonus.equippedCount = setCounts[setBonusName];
			equippedSetBonus.headCount = headCount;
			equippedSetBonus.chestCount = chestCount;
			equippedSetBonus.handsCount = handsCount;
			equippedSetBonus.legsCount = legsCount;
			equippedSetBonus.feetCount = feetCount;
			equippedSetBonus.details = [];

			for (const bonusLevel of setBonus.setLevels) {
				const detail = new EquippedSetBonusDetailModel();
				detail.requiredCount = bonusLevel.pieces;
				detail.skill = this.dataService.getSkill(bonusLevel.id);
				equippedSetBonus.details.push(detail);
			}
			equippedSetBonuses.push(equippedSetBonus);
		}
	}

	private addAugmentationSkills(augmentations: AugmentationModel[], equippedSkills: EquippedSkillModel[]) {
		const augGroups = _.groupBy(augmentations, 'id');

		for (const key in augGroups) {
			const value = augGroups[key];

			const level = value[0].levels[value.length - 1];
			if (level && level.skills) {
				for (const skillRef of level.skills) {

					let equippedSkill = _.find(equippedSkills, es => es.id == skillRef.id);

					// Augmentation skills (as of this writing) do not build on skills from other sources. If the augmentation skill level is higher, it overwrites.
					if (!equippedSkill) {
						const skill = this.dataService.getSkill(skillRef.id);
						equippedSkill = new EquippedSkillModel();
						equippedSkill.skill = skill;
						equippedSkill.id = skill.id;
						equippedSkill.name = skill.name;
						equippedSkill.description = skill.description;
						equippedSkill.equippedCount = skillRef.level;
						equippedSkill.totalLevelCount = skill.levels.length;
						equippedSkills.push(equippedSkill);
					} else if (equippedSkill.equippedCount < skillRef.level) {
						equippedSkill.equippedCount = skillRef.level;
					}
				}
			}
		}
	}

	private countSkillItemPart(equippedSkill: EquippedSkillModel, actualCount: number, itemType: ItemType) {
		if (itemType == ItemType.Weapon) {
			equippedSkill.weaponCount += actualCount;
		} else if (itemType == ItemType.Head) {
			equippedSkill.headCount += actualCount;
		} else if (itemType == ItemType.Chest) {
			equippedSkill.chestCount += actualCount;
		} else if (itemType == ItemType.Hands) {
			equippedSkill.handsCount += actualCount;
		} else if (itemType == ItemType.Legs) {
			equippedSkill.legsCount += actualCount;
		} else if (itemType == ItemType.Feet) {
			equippedSkill.feetCount += actualCount;
		} else if (itemType == ItemType.Charm) {
			equippedSkill.charmCount += actualCount;
		}
	}
}

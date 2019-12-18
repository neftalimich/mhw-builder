import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AugmentationModel } from '../models/augmentation.model';
import { DecorationModel } from '../models/decoration.model';
import { EquippedSkillModel } from '../models/equipped-skill.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { ModificationModel } from '../models/modification.model';
import { UpgradeContainerModel } from '../models/upgrade-container.model';
import { AilmentType } from '../types/ailment.type';
import { ElementType } from '../types/element.type';
import { ItemType } from '../types/item.type';
import { SkillService } from './skill.service';
import { StatService } from './stat.service';

@Injectable()
export class EquipmentService {
	public skills: EquippedSkillModel[];
	public items: ItemModel[];
	public decorations: DecorationModel[];
	public augmentations: AugmentationModel[];
	public upgradeContainer: UpgradeContainerModel;
	public modifications: ModificationModel[];
	public kinsect: KinsectModel;
	private weaponName = '';

	constructor(
		private skillService: SkillService,
		private statService: StatService
	) {
		this.items = [];
		this.decorations = [];
		this.augmentations = [];
		this.modifications = [];

		this.skillService.skillsUpdated$.subscribe(skills => {
			this.skills = skills;
			this.statService.update(skills, this.items, this.augmentations, this.upgradeContainer, this.modifications, this.kinsect);
		});
	}

	addItem(item: ItemModel, updateStats: boolean = true) {
		if (item.itemType == ItemType.Weapon) {
			this.weaponName = item.name;
		}
		this.items.push(item);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addDecoration(decoration: DecorationModel, updateStats: boolean = true) {
		this.decorations.push(decoration);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addAugmentation(augmentation: AugmentationModel, updateStats: boolean = true) {
		this.augmentations.push(augmentation);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addUpgrade(upgradeContainer: UpgradeContainerModel, updateStats: boolean = true) {
		this.upgradeContainer = upgradeContainer;
		if (updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.modifications, this.kinsect);
		}
	}

	changeElement(element: ElementType, elementAttack: number, updateStats: boolean = true) {
		let weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		if (element != ElementType.None) {
			weapon.element = element;
			weapon.elementBaseAttack = elementAttack;
		} else {
			weapon.element = null;
			weapon.elementBaseAttack = null;
		}
		if (updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.modifications, this.kinsect);
		}
	}

	changeAilment(ailment: AilmentType, ailmentAttack:number, updateStats: boolean = true) {
		let weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		if (ailment != AilmentType.None) {
			weapon.ailment = ailment;
			weapon.ailmentBaseAttack = ailmentAttack;
		} else {
			weapon.ailment = null;
			weapon.ailmentBaseAttack = null;
		}
		if (updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.modifications, this.kinsect);
		}
	}

	changeWeaponName(weaponName: string) {
		let weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		weapon.name = this.weaponName + weaponName;
	}

	addModification(modification: ModificationModel, updateStats: boolean = true) {
		this.modifications.push(modification);
		if (updateStats) {
			if (modification.id < 4) {
				this.updateSkills();
			}
		}
	}

	addKinsect(kinsect: KinsectModel, updateStats: boolean = true) {
		this.kinsect = kinsect;
		if (updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.modifications, this.kinsect);
		}
	}

	removeItem(item: ItemModel) {
		this.items = _.reject(this.items, i => i === item);
		this.updateSkills();
	}

	removeDecoration(decoration: DecorationModel) {
		this.decorations = _.reject(this.decorations, d => d === decoration);
		this.updateSkills();
	}

	removeAugmentation(augmentation: AugmentationModel) {
		this.augmentations = _.reject(this.augmentations, a => a === augmentation);
		this.updateSkills();
	}

	removeUpgrade() {
		this.upgradeContainer = null;
		this.updateSkills();
	}

	removeModification(modification: ModificationModel) {
		this.modifications = _.reject(this.modifications, a => a === modification);
		this.updateSkills();
	}

	removeKinsect() {
		this.kinsect = null;
	}

	updateItemLevel() {
		this.updateSkills();
	}

	updateItemActive() {
		this.updateSkills();
	}

	updateSkillMode(equippedSkills: EquippedSkillModel[]) {
		this.statService.update(equippedSkills, this.items, this.augmentations, this.upgradeContainer, this.modifications, this.kinsect);
	}

	private updateSkills() {
		this.skillService.updateSkills(this.items, this.decorations, this.augmentations);
	}
}

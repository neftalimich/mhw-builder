import { Injectable } from '@angular/core';
import { SkillService } from './skill.service';
import { AugmentationModel } from '../models/augmentation.model';
import { ItemModel } from '../models/item.model';
import { DecorationModel } from '../models/decoration.model';
import * as _ from 'lodash';
import { StatService } from './stat.service';

@Injectable()
export class EquipmentService {
	public items: ItemModel[];
	public decorations: DecorationModel[];
	public augmentations: AugmentationModel[];

	constructor(
		private skillService: SkillService,
		private statService: StatService
	) {
		this.items = [];
		this.decorations = [];
		this.augmentations = [];

		this.skillService.skillsUpdated$.subscribe(skills => {
			this.statService.update(skills, this.items, this.augmentations);
		});
	}

	addItem(item: ItemModel) {
		this.items.push(item);
		this.updateSkills();
	}

	addDecoration(decoration: DecorationModel) {
		this.decorations.push(decoration);
		this.updateSkills();
	}

	addAugmentation(augmentation: AugmentationModel) {
		this.augmentations.push(augmentation);
		this.updateSkills();
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

	updateItemLevel() {
		this.updateSkills();
	}

	private updateSkills() {
		this.skillService.updateSkills(this.items, this.decorations, this.augmentations);
	}
}

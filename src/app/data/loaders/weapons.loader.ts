import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ItemModel } from '../../models/item.model';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { ItemType } from '../../types/item.type';
import { CapacitiesParser } from '../parsers/capacities.parser';
import { SharpnessLevelsParser } from '../parsers/sharpness-levels.parser';
import { SkillReferencesParser } from '../parsers/skill-references.parser';
import { SlotsParser } from '../parsers/slots.parser';
import { TagsParser } from '../parsers/tags.parser';
import { DataLoader } from './data.loader';

@Injectable()
export class WeaponsLoader extends DataLoader<ItemModel> {

	constructor(
		protected http: HttpClient
	) {
		super(http);
	}

	protected parse(content: string): ItemModel[] {
		const items = this.parseTextContent(content, [
			{
				columnName: 'slots',
				parser: new SlotsParser()
			},
			{
				columnName: 'tags',
				parser: new TagsParser()
			},
			{
				columnName: 'sharpnessLevels',
				parser: new SharpnessLevelsParser()
			},
			{
				columnName: 'skills',
				parser: new SkillReferencesParser()
			},
			{
				columnName: 'sharpnessLevelsBar',
				parser: new CapacitiesParser()
			}
		]);

		_.each(items, item => {
			item.equipmentCategory = EquipmentCategoryType.Weapon;
			item.itemType = ItemType.Weapon;
		});

		return items;
	}
}

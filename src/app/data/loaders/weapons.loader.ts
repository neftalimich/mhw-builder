import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ItemModel } from '../../models/item.model';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { ItemType } from '../../types/item.type';
import { OtherDataParser } from '../parsers/other-data.parser';
import { SkillReferencesParser } from '../parsers/skill-references.parser';
import { SlotsParser } from '../parsers/slots.parser';
import { TagsParser } from '../parsers/tags.parser';
import { ValuesParser } from '../parsers/values.parser';
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
				columnName: 'defense',
				parser: new ValuesParser()
			},
			{
				columnName: 'slots',
				parser: new SlotsParser()
			},
			{
				columnName: 'sharpnessLevelsBar',
				parser: new ValuesParser()
			},
			{
				columnName: 'monsters',
				parser: new TagsParser()
			},
			{
				columnName: 'tags',
				parser: new TagsParser()
			},
			{
				columnName: 'skills',
				parser: new SkillReferencesParser()
			},
			{
				columnName: 'otherData',
				parser: new OtherDataParser()
			}
		]);

		items.forEach(item => {
			item.equipmentCategory = EquipmentCategoryType.Weapon;
			item.itemType = ItemType.Weapon;
			if (item.sharpnessLevelsBar && !isNaN(item.sharpnessLevelsBar[0])) {
				const total = item.sharpnessLevelsBar.reduce((a, b) => a + b, 0);
				const over = total - 40;
				for (let i = item.sharpnessLevelsBar.length - 1; i >= 0; i--) {
					const level = item.sharpnessLevelsBar[i];
					if (level > 0) {
						item.sharpnessMaxLevel = level - over;
						item.sharpnessMaxColorIndex = i;
						break;
					}
				}
			}
		});
		return items;
	}
}

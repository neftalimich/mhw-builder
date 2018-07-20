import { HttpClient } from '@angular/common/http';
import { DataLoader } from './data.loader';
import { ItemModel } from '../../models/item.model';
import { SlotsParser } from '../parsers/slots.parser';
import { TagsParser } from '../parsers/tags.parser';
import { SkillReferencesParser } from '../parsers/skill-references.parser';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ItemType } from '../../types/item.type';
import { EquipmentCategoryType } from '../../types/equipment-category.type';

@Injectable()
export class CharmsLoader extends DataLoader<ItemModel> {

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
				columnName: 'skills',
				parser: new SkillReferencesParser()
			},
		]);

		_.each(items, charm => {
			charm.itemType = ItemType.Charm;
			charm.equipmentCategory = EquipmentCategoryType.Charm;
		});

		return items;
	}
}

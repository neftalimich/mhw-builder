import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ToolModel } from '../../models/tool.model';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { SlotsParser } from '../parsers/slots.parser';
import { DataLoader } from './data.loader';

@Injectable()
export class ToolLoader extends DataLoader<ToolModel> {

	constructor(
		protected http: HttpClient
	) {
		super(http);
	}

	protected parse(content: string): ToolModel[] {
		const items = this.parseTextContent(content, [
			{
				columnName: 'slots',
				parser: new SlotsParser()
			}
		]);
		_.each(items, tool => {
			tool.equipmentCategory = EquipmentCategoryType.Tool;
		});
		return items;
	}
}

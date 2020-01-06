import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemModel } from '../../models/item.model';
import { SkillReferencesParser } from '../parsers/skill-references.parser';
import { DataLoader } from './data.loader';
import { DecorationModel } from 'src/app/models/decoration.model';

@Injectable()
export class DecorationsLoader extends DataLoader<DecorationModel> {

	constructor(
		protected http: HttpClient
	) {
		super(http);
	}

	protected parse(content: string): DecorationModel[] {
		return this.parseTextContent(content, [
			{
				columnName: 'skills',
				parser: new SkillReferencesParser()
			},
		]);
	}
}

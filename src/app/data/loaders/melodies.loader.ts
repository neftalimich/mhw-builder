import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MelodiesModel } from '../../models/melodies.model';
import { MelodiesEffectParser } from '../parsers/melodies-effect.parser';
import { MelodiesParser } from '../parsers/melodies.parser';
import { TagsParser } from '../parsers/tags.parser';
import { DataLoader } from './data.loader';

@Injectable()
export class MelodiesLoader extends DataLoader<MelodiesModel> {

	constructor(
		protected http: HttpClient
	) {
		super(http);
	}

	protected parse(content: string): MelodiesModel[] {
		const melodies = this.parseTextContent(content, [
			{
				columnName: 'notes',
				parser: new TagsParser()
			},
			{
				columnName: 'melodies',
				parser: new MelodiesParser()
			}
			,
			{
				columnName: 'melodiesEffect',
				parser: new MelodiesEffectParser()
			}
		]);

		return melodies;
	}
}

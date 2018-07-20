import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MelodyEffectModel } from '../../models/melody-effect.model';
import { DataLoader } from './data.loader';

@Injectable()
export class MelodyEffectLoader extends DataLoader<MelodyEffectModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}

	protected parse(content: string): MelodyEffectModel[] {
		const melodyEffect = this.parseTextContent(content, []);

		return melodyEffect;
	}
}


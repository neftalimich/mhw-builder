import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KinsectModel } from '../../models/kinsect.model';
import { DataLoader } from './data.loader';

@Injectable()
export class KinsectsLoader extends DataLoader<KinsectModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}

	protected parse(content: string): KinsectModel[] {
		return this.parseTextContent(content);
	}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataLoader } from './data.loader';
import { SharpnessModifierModel } from '../../models/sharpness-modifier.model';

@Injectable()
export class SharpnessModifiersLoader extends DataLoader<SharpnessModifierModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharpnessModifierModel } from '../../models/sharpness-modifier.model';
import { DataLoader } from './data.loader';

@Injectable()
export class SharpnessModifiersLoader extends DataLoader<SharpnessModifierModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

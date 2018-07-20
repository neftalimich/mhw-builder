import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataLoader } from './data.loader';
import { WeaponModifierModel } from '../../models/weapon-modifier.model';

@Injectable()
export class WeaponModifiersLoader extends DataLoader<WeaponModifierModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

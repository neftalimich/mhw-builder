import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeaponModifierModel } from '../../models/weapon-modifier.model';
import { DataLoader } from './data.loader';

@Injectable()
export class WeaponModifiersLoader extends DataLoader<WeaponModifierModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AmmoCapacitiesModel } from '../../models/ammo-capacities.model';
import { CapacitiesParser } from '../parsers/capacities.parser';
import { DataLoader } from './data.loader';

@Injectable()
export class AmmoCapacitiesLoader extends DataLoader<AmmoCapacitiesModel> {

	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

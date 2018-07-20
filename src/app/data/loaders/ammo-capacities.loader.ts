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

	protected parse(content: string): AmmoCapacitiesModel[] {
		const capacities = this.parseTextContent(content, [
			{
				columnName: 'normal',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'piercing',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'spread',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'sticky',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'cluster',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'recover',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'poison',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'paralysis',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'sleep',
				parser: new CapacitiesParser()
			},
			{
				columnName: 'exhaust',
				parser: new CapacitiesParser()
			}
		]);

		return capacities;
	}
}

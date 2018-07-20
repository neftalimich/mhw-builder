import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataLoader } from './data.loader';
import { SetBonusModel } from '../../models/set-bonus.model';

@Injectable()
export class SetBonusesLoader extends DataLoader<SetBonusModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

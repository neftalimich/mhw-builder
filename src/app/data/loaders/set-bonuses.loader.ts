import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SetBonusModel } from '../../models/set-bonus.model';
import { DataLoader } from './data.loader';

@Injectable()
export class SetBonusesLoader extends DataLoader<SetBonusModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

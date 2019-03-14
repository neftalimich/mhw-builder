import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModificationModel } from '../../models/modification.model';
import { DataLoader } from './data.loader';

@Injectable()
export class ModificationsLoader extends DataLoader<ModificationModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataLoader } from './data.loader';
import { SkillModel } from '../../models/skill.model';

@Injectable()
export class SkillsLoader extends DataLoader<SkillModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SkillModel } from '../../models/skill.model';
import { DataLoader } from './data.loader';

@Injectable()
export class SkillsLoader extends DataLoader<SkillModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

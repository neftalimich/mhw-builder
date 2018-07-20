import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DecorationModel } from '../../models/decoration.model';
import { SkillModel } from '../../models/skill.model';
import { DataService } from '../../services/data.service';

@Component({
	selector: 'mhw-builder-decoration-details',
	templateUrl: './decoration-details.component.html',
	styleUrls: ['./decoration-details.component.scss']
})
export class DecorationDetailsComponent implements OnInit {
	private _decoration: DecorationModel;

	@Input()
	set decoration(decoration: DecorationModel) {
		this._decoration = decoration;
		if (decoration) {
			this.loadSkills();
		} else {
			this.skills = new Array<SkillModel>();
		}
	}
	get decoration(): DecorationModel {
		return this._decoration;
	}

	skills: SkillModel[];

	constructor(
		private dataService: DataService
	) { }

	ngOnInit() { }

	loadSkills() {
		this.skills = this.dataService.getSkills(this.decoration.skills);
	}

	getSkillCount(skill: SkillModel): string {
		const itemSkill = _.find(this.decoration.skills, s => s.id == skill.id);
		const result = `${itemSkill.level}/${skill.levels.length}`;
		return result;
	}
}

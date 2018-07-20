import { SkillReferenceModel } from '../../models/skill-reference.model';
import { DataParser } from './data-parser';

export class SkillReferencesParser extends DataParser<SkillReferenceModel> {
	parse(data: string): SkillReferenceModel[] {
		const values = data.split(';');
		const skillRefs: SkillReferenceModel[] = [];
		if (data) {
			for (const skill of values) {
				const parts = skill.split('-');
				skillRefs.push({
					id: parts[0],
					level: parts.length > 1 ? Number(parts[1]) : null
				});
			}
		}
		return skillRefs;
	}
}

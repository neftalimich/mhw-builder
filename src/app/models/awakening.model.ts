import { SkillReferenceModel } from './skill-reference.model';

export class AwakeningModel {
	id: number;
	type: string;
	awakenings?: number[][];
	safiElements?: number[];
	safiAilments?: number[][];
	skills?: SkillReferenceModel[];
}

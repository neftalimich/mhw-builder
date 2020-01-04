import { AwakeningType } from '../types/awakening.type';
import { SkillReferenceModel } from './skill-reference.model';

export class AwakeningModel {
	id: number;
	type: AwakeningType;
	name: string;
	awakenings?: number[][];
	safiElements?: number[];
	safiAilments?: number[][];
	skills?: SkillReferenceModel[];
	minLevel?: number;
	maxLevel?: number;
	max?: number;
}

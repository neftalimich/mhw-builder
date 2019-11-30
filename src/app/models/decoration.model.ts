import { ItemType } from '../types/item.type';
import { SkillReferenceModel } from './skill-reference.model';

export class DecorationModel {
	id: number;
	name: string;
	level: number;
	rarity: number;
	priority: number;
	skills: SkillReferenceModel[];

	itemId: number;
	itemType: ItemType;
	active: boolean;
}

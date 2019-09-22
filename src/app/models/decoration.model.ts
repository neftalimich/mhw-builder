import { SkillReferenceModel } from './skill-reference.model';
import { ItemType } from '../types/item.type';

export class DecorationModel {
	id: number;
	name: string;
	level: number;
	skills: SkillReferenceModel[];
	rarity: number;

	itemId: number;
	itemType: ItemType;
	active: boolean;
}

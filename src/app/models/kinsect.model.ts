import { AttackType } from '../types/attack.type';
import { DustEffectType } from '../types/dust-effect.type';
import { ElementType } from '../types/element.type';
import { KinsectType } from '../types/kinsect.type';

export class KinsectModel {
	id: number;
	rarity: number;
	type: KinsectType;
	name: string;
	attackType: AttackType;
	dustEffect: DustEffectType;
	element: ElementType;
	power: number;
	speed: number;
	heal: number;
}

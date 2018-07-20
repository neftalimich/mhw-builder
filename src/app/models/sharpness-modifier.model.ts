import { DamageType } from '../types/damage.type';
import { SharpnessType } from '../types/sharpness.type';

export class SharpnessModifierModel {
	damageType: DamageType;
	sharpnessType: SharpnessType;
	value: number;
}

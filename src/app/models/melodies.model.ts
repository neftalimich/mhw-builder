import { MelodyEffectModel } from './melody-effect.model';

export class MelodiesModel {
	id: number;
	notes: string[];
	melodies: number[][];
	melodiesEffect: number[];
	melodyEffect: MelodyEffectModel[];
}

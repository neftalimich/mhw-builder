import { MelodyEffectModel } from './melody-effect.model';

export class MelodiesModel {
	id: number;
	notes: string[];
	melodies: number[][];
	melodiesEffect: MelodyEffectModel[];
	melodyEffects: MelodiesDetailModel[];
}

export class MelodiesDetailModel {
	melody: number[];
	effects: MelodyEffectModel[];
}

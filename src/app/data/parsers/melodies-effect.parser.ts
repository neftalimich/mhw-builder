import { MelodyEffectModel } from '../../models/melody-effect.model';
import { DataParser } from './data-parser';

export class MelodiesEffectParser extends DataParser<MelodyEffectModel> {
	parse(data: string): MelodyEffectModel[] {
		const effects = data.split(';');
		const melodiesEffect: MelodyEffectModel[] = [];
		let count = 0;
		for (const effect of effects) {
			const melodies = effect.split('+');

			for (const melody of melodies) {
				const values = melody.split('-');
				melodiesEffect.push({
					id: values[0],
					level: values.length == 2 ? values[1] : null,
					index: count
				});
			}
			count += 1;
		}
		return melodiesEffect;
	}
}

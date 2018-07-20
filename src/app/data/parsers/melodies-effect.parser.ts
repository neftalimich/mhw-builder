import { DataParser } from './data-parser';

export class MelodiesEffectParser extends DataParser<number> {
	parse(data: string): number[] {
		const result = [];
		const effects = data.split(';');
		for (let i = 0; i < effects.length; i++) {
			result.push(parseInt(effects[i], 10));
		}
		return result;
	}
}

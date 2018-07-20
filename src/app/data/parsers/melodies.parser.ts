import { DataParser } from './data-parser';

export class MelodiesParser extends DataParser<number[]> {
	parse(data: string): number[][] {
		const result = [];
		const melodies = data.split('|');
		for (let i = 0; i < melodies.length; i++) {
			const notes = melodies[i].split(';');
			const aux = [];
			for (let j = 0; j < notes.length; j++) {
				aux.push(parseInt(notes[j], 10));
			}
			result.push(aux);
		}
		return result;
	}
}

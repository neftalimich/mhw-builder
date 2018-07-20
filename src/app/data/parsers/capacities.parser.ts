import { DataParser } from './data-parser';

export class CapacitiesParser extends DataParser<number> {
	parse(data: string): number[] {
		const result = [];
		const aux = data.split(';');
		for (let i = 0; i < aux.length; i++) {
			result.push(parseInt(aux[i], 10));
		}
		return result;
	}
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'maxSharpness'
})
export class MaxSharpnessPipe implements PipeTransform {
	transform(value: number[], color?: boolean): any {
		if (value.length > 1) {
			let over = value.reduce((a, b) => a + b, 0) - 40;
			let result = '';
			for (let i = value.length - 1; i >= 0; i--) {
				if (value[i] > 0) {
					if (color) {
						result = '' + i;
					} else {
						result = (value[i] - over).toString();
					}
					break;
				}
			}
			return result;
		} else {
			return '';
		}
	}
}

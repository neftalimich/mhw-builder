import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'maxSharpness'
})
export class MaxSharpnessPipe implements PipeTransform {
	transform(value: any[], color?: boolean): any {
		if (value.length > 1) {
			let result = '';
			for (let i = value.length - 1; i >= 0; i--) {
				if (value[i] > 0) {
					if (color) {
						result = '' + i;
					} else {
						result = value[i];
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

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter'
})
export class FilterPipe implements PipeTransform {
	transform(items: any[], field: string, value: string): any[] {
		if (!items) return [];

		if (!value || value.length == 0) return items;
		let test = items.filter(item => {
			return item[field].toString().indexOf(value) != -1;
		});
		console.log(field, value, test);
		return test;
	}
}

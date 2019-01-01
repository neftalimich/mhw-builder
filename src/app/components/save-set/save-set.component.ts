import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BuildService } from 'src/app/services/build.service';

@Component({
	selector: 'mhw-builder-save-set',
	templateUrl: './save-set.component.html',
	styleUrls: ['./save-set.component.scss']
})
export class SaveSetComponent implements OnInit {

	constructor(private location: Location, private buildService: BuildService) { }
	sets: { id: string, data: string, state: number }[] = [];

	ngOnInit() {
		let stringSets = localStorage.getItem('mhwSets');
		if (stringSets) {
			try {
				this.sets = JSON.parse(stringSets);
				console.log(this.sets);
			} catch (err) {
				console.log(stringSets);
				//localStorage.setItem('mhwSets', '');
			}
		}
	}

	save(setId: string) {
		let item1 = this.sets.find(s => s.id === setId);
		if (item1) {
			item1.data = location.hash;
			item1.state = 1;
		} else {
			this.sets.push({ id: setId, data: location.hash, state: 0 });
		}
		localStorage.setItem('mhwSets', JSON.stringify(this.sets));

		setTimeout(function () {
			if (item1) {
				item1.state = 0;
				localStorage.setItem('mhwSets', JSON.stringify(this.sets));
			}
		}, 5000);
	}

	remove(index: number) {
		this.sets.splice(index, 1);
		localStorage.setItem('mhwSets', JSON.stringify(this.sets));
	}

	select(set: any, setId: any) {
		this.location.replaceState(this.location.path(false), set.data);
		this.buildService.loadBuild(location.hash);
		setId.value = set.id;
	}
}

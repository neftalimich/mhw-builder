import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { SavedSetModel } from 'src/app/models/saved-set.model';
import { SetService } from 'src/app/services/set.service';
import { WeaponType } from 'src/app/types/weapon.type';

@Component({
	selector: 'mhw-builder-set-list',
	templateUrl: './set-list.component.html',
	styleUrls: ['./set-list.component.scss']
})
export class SetListComponent implements OnInit, AfterViewInit {
	sets: SavedSetModel[] = [];
	virtualItems: SavedSetModel[];
	filteredItems: SavedSetModel[];
	selectedSetIndex = -1;
	loading = 0;

	@ViewChild('saveBox', { static: true }) saveBox: ElementRef;

	weaponTypeFilter?: WeaponType;
	hideFilterContainer = true;

	constructor(
		private setService: SetService
	) {
		this.setService.setsUpdated$.subscribe(sets => {
			this.sets = sets;
			if (this.weaponTypeFilter) {
				this.filteredItems = _.reject(this.sets, item => item.weaponType != this.weaponTypeFilter);
			} else {
				this.filteredItems = this.sets;
			}
		});
	}

	ngOnInit() {
		this.sets = this.setService.getSets();
		this.filteredItems = this.sets;
	}

	ngAfterViewInit() {
		this.setService.importSet();
	}

	save(setName: string) {
		if (setName) {
			this.loading = 1;
			this.selectedSetIndex = this.setService.save(setName);
			setTimeout(() => {
				this.loading = 0;
			}, 500);
		}
	}

	saveSets() {
		this.loading = 2;
		this.setService.saveSets();
		setTimeout(() => {
			this.loading = 0;
		}, 500);
	}

	sortSets() {
		this.loading = 3;
		this.setService.sortSets();
		setTimeout(() => {
			this.loading = 0;
		}, 500);
	}

	remove(index: number) {
		this.setService.remove(this.sets.indexOf(this.filteredItems[index]));
	}

	select(set: SavedSetModel, index: number = 0) {
		this.setService.select(set);
		this.selectedSetIndex = index;
		this.saveBox.nativeElement.value = set.setName;
	}

	weaponFilterClicked(weaponType?: WeaponType) {
		this.selectedSetIndex = -1;
		if (!this.weaponTypeFilter || this.weaponTypeFilter != weaponType) {
			this.weaponTypeFilter = weaponType;
			this.filteredItems = _.reject(this.sets, item => item.weaponType != this.weaponTypeFilter);
		} else if (this.weaponTypeFilter == weaponType) {
			this.weaponTypeFilter = null;
			this.filteredItems = this.sets;
		}
	}

	downloadHtmlFile() {
		const dateNow = new Date().toLocaleDateString('en-GB', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
		const fileName = `mhw-builder-save(${dateNow}).html`;
		const fileString = `
<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml" ng-app="mhwApp">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>MHWorld-Builder SetList</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.7/angular.min.js" crossorigin="anonymous"></script>
    <style>
        a {
            color: cornflowerblue;
        }
        .Fire {
            color: #ff6666;
        }
        .Water {
            color: #66ccff;
        }
        .Thunder {
            color: #ff9900;
        }
        .Ice {
            color: #0099ff;
        }
        .Dragon {
            color: #3cb05d;
        }
        .Poison {
            color: #cc44ff;
        }
        .Sleep {
            color: #9999ff;
        }
        .Paralysis {
            color: #e6cb00;
        }
        .Blast {
            color: #E6A400;
        }
    </style>
</head>
<body>
    <div class="container-fluid" ng-controller="SetListController">
        <div class="row">
            <div class="col-12">
                <h2>MHWorld-Builder</h2>
                <div class="input-group mb-2">
                    <select class="custom-select" id="weaponFilter" ng-model="weaponFilter">
                        <option value="" selected></option>
                        <option value="GreatSword">GreatSword</option>
                        <option value="SwordAndShield">SwordAndShield</option>
                        <option value="DualBlades">DualBlades</option>
                        <option value="LongSword">LongSword</option>
                        <option value="Hammer">Hammer</option>
                        <option value="HuntingHorn">HuntingHorn</option>
                        <option value="Lance">Lance</option>
                        <option value="Gunlance">Gunlance</option>
                        <option value="SwitchAxe">SwitchAxe</option>
                        <option value="ChargeBlade">ChargeBlade</option>
                        <option value="InsectGlaive">InsectGlaive</option>
                        <option value="Bow">Bow</option>
                        <option value="HeavyBowgun">HeavyBowgun</option>
                        <option value="LightBowgun">LightBowgun</option>
                    </select>
                    <div class="input-group-append">
                        <label class="input-group-text" for="inputGroupSelect02">Weapon</label>
                    </div>
                </div>
                <div class="card-columns">
                    <div class="card" ng-repeat="(key,item) in sets | filter:(weaponFilter? {weaponType:weaponFilter}: ''):(weaponFilter? true: false) track by $index" style="margin-bottom:.5rem;">
                        <div class="card-body" style="padding:6px;">
                            <h6 class="card-title" style="margin:0px;">
                                <a href="https://neftalimich.github.io/mhw-builder-page?{{item.hashString}}" class="text-decoration-none" target="_blank">
                                    {{item.setName}}
                                </a>
                                <span style="font-size:14px;">
                                    <a class="float-right ml-1 text-secondary" href="https://neftalimich.github.io/mhw-builder-page?{{item.hashString}}i{{item.setName | uppercase}}"
										target="_blank" title="Import">
                                        <i class="fas fa-cloud-upload-alt fa-sm"></i>
                                    </a>
                                    <span class="float-right">
                                        <span>{{item.totalAttack}}</span>
                                        <span ng-show="item.element || item.ailment">
											(<span class="{{item.element}}" title="{{item.element}}">{{item.element ? item.elementAttack : ''}}</span><!--
											-->{{item.ailment && item.element ? '/' : ''}}<!--
											--><span class="{{item.ailment}}" title="{{item.ailment}}">{{item.ailment ? item.ailmentAttack : ''}}</span>)
                                        </span>
										<span class="text-muted" style="font-size:12px;">
											{{item.affinity}}%
										</span>
                                    </span>
                                </span>
                            </h6>
                            <p class="card-text">
                                <small class="text-muted text-capitalize">
                                    {{item.weaponType}}
                                </small>
								<span style="font-size:10px;">
									<span class="float-right text-muted mt-2" ng-show="item.resistances.length > 0">
										[
										<span class="Fire">{{item.resistances[0]}}</span>,
										<span class="Water">{{item.resistances[1]}}</span>,
										<span class="Thunder">{{item.resistances[2]}}</span>,
										<span class="Ice">{{item.resistances[3]}}</span>,
										<span class="Dragon">{{item.resistances[4]}}</span>
										] ➟ <span>{{item.defense[2]}} DEF</span>
									</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <span class="text-muted float-right" style="font-size:11px">
					By Neftalí Michelet (neftalimich)
					<a href="https://neftalimich.github.io/mhw-builder-page/">Site</a>.
				</span>
            </div>
        </div>
    </div>
    <script>
        var json = ${JSON.stringify(this.sets)};
        var mhwApp = angular.module('mhwApp', []);
        mhwApp.controller('SetListController', [
            '$scope',
            function ($scope) {
                $scope.sets = json;
            }
        ]);
    </script>
</body>
</html>
		`;
		const blob = new Blob([fileString], { type: 'text/html' });
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, fileName);
		} else {
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}

	downloadJsonFile() {
		const dateNow = new Date().toLocaleDateString('en-GB', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
		const fileName = `mhw-builder-data(${dateNow}).json`;
		const fileString = JSON.stringify(this.sets);
		const blob = new Blob([fileString], { type: 'application/json' });
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, fileName);
		} else {
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
}

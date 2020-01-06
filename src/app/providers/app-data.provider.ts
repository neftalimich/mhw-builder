import { Injectable } from '@angular/core';
import { forkJoin, Observable, Observer } from 'rxjs';
import { AmmoCapacitiesLoader } from '../data/loaders/ammo-capacities.loader';
import { ArmorLoader } from '../data/loaders/armor.loader';
import { AugmentationsLoader } from '../data/loaders/augmentations.loader';
import { AwakeningsLoader } from '../data/loaders/awakenings.loader';
import { CharmsLoader } from '../data/loaders/charms.loader';
import { DecorationsLoader } from '../data/loaders/decorations.loader';
import { KinsectsLoader } from '../data/loaders/kinsects.loader';
import { MelodiesLoader } from '../data/loaders/melodies.loader';
import { MelodyEffectLoader } from '../data/loaders/melodyEffect.loader';
import { ModificationsLoader } from '../data/loaders/modifications.loader';
import { SetBonusesLoader } from '../data/loaders/set-bonuses.loader';
import { SharpnessModifiersLoader } from '../data/loaders/sharpness-modifiers.loader';
import { SkillsLoader } from '../data/loaders/skills.loader';
import { ToolsLoader } from '../data/loaders/tools.loader';
import { UpgradesLoader } from '../data/loaders/upgrades.loader';
import { WeaponModifiersLoader } from '../data/loaders/weapon-modifiers.loader';
import { WeaponsLoader } from '../data/loaders/weapons.loader';
import { AppDataModel } from '../models/app-data.model';
import { map } from 'rxjs/operators';

@Injectable()
export class AppDataProvider {
	public appData: AppDataModel;

	constructor(
		private weaponLoader: WeaponsLoader,
		private armorLoader: ArmorLoader,
		private charmsLoader: CharmsLoader,
		private decorationsLoader: DecorationsLoader,
		private augmentationsLoader: AugmentationsLoader,
		private modificationsLoader: ModificationsLoader,
		private kinsectsLoader: KinsectsLoader,
		private skillsLoader: SkillsLoader,
		private setBonusesLoader: SetBonusesLoader,
		private sharpnessModifiersLoader: SharpnessModifiersLoader,
		private weaponModifiersLoader: WeaponModifiersLoader,
		private ammoCapacitiesLoader: AmmoCapacitiesLoader,
		private melodiesLoader: MelodiesLoader,
		private melodyEffectLoader: MelodyEffectLoader,
		private toolsLoader: ToolsLoader,
		private upgradesLoader: UpgradesLoader,
		private awakeningsLoader: AwakeningsLoader
	) {
		this.appData = new AppDataModel();
	}

	load(): Observable<boolean> {
		return new Observable((observer: Observer<boolean>) => {
			Promise.all([
				this.weaponLoader.load('weapons.tsv', false).toPromise(),
				this.armorLoader.load('armor.tsv', false).toPromise(),
				this.charmsLoader.load('charms.tsv', false).toPromise(),
				this.decorationsLoader.load('decorations.tsv', false).toPromise(),
				this.augmentationsLoader.load('augmentations.json', false).toPromise(),
				this.modificationsLoader.load('modifications.json', false).toPromise(),
				this.kinsectsLoader.load('kinsects.tsv', false).toPromise(),
				this.skillsLoader.load('skills.json', false).toPromise(),
				this.setBonusesLoader.load('set-bonuses.json', false).toPromise(),
				this.sharpnessModifiersLoader.load('sharpness-modifiers.json', false).toPromise(),
			]).then(results => {
				this.appData.weapons = results[0];
				this.appData.armors = results[1];
				this.appData.charms = results[2];
				this.appData.decorations = results[3];
				this.appData.augmentations = results[4];
				this.appData.modifications = results[5];
				this.appData.kinsects = results[6];
				this.appData.skills = results[7];
				this.appData.setBonuses = results[8];
				this.appData.sharpnessModifiers = results[9];

				Promise.all([
					this.weaponModifiersLoader.load('weapon-modifiers.json', false).toPromise(),
					this.ammoCapacitiesLoader.load('ammo-capacities.json', false).toPromise(),
					this.melodiesLoader.load('melodies.tsv', false).toPromise(),
					this.melodyEffectLoader.load('melody-effect.tsv', false).toPromise(),
					this.toolsLoader.load('tools.tsv', false).toPromise(),
					this.upgradesLoader.load('upgrades.json', false).toPromise(),
					this.awakeningsLoader.load('awakenings.json', false).toPromise()
				]).then(results2 => {
					this.appData.weaponModifiers = results2[0];
					this.appData.ammoCapacities = results2[1];
					this.appData.melodies = results2[2];
					this.appData.melodyEffect = results2[3];
					this.appData.tools = results2[4];
					this.appData.upgrades = results2[5];
					this.appData.awakenings = results2[6];

					observer.next(true);
					observer.complete();
				});
			});
		});
	}
}

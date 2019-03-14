import { Injectable } from '@angular/core';
import { forkJoin, Observable, Observer } from 'rxjs';
import { AmmoCapacitiesLoader } from '../data/loaders/ammo-capacities.loader';
import { ArmorLoader } from '../data/loaders/armor.loader';
import { AugmentationsLoader } from '../data/loaders/augmentations.loader';
import { CharmsLoader } from '../data/loaders/charms.loader';
import { DecorationsLoader } from '../data/loaders/decorations.loader';
import { MelodiesLoader } from '../data/loaders/melodies.loader';
import { MelodyEffectLoader } from '../data/loaders/melodyEffect.loader';
import { ModificationsLoader } from '../data/loaders/modifications.loader';
import { SetBonusesLoader } from '../data/loaders/set-bonuses.loader';
import { SharpnessModifiersLoader } from '../data/loaders/sharpness-modifiers.loader';
import { SkillsLoader } from '../data/loaders/skills.loader';
import { WeaponModifiersLoader } from '../data/loaders/weapon-modifiers.loader';
import { WeaponsLoader } from '../data/loaders/weapons.loader';
import { AppDataModel } from '../models/app-data.model';

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
		private skillsLoader: SkillsLoader,
		private setBonusesLoader: SetBonusesLoader,
		private sharpnessModifiersLoader: SharpnessModifiersLoader,
		private weaponModifiersLoader: WeaponModifiersLoader,
		private ammoCapacitiesLoader: AmmoCapacitiesLoader,
		private melodiesLoader: MelodiesLoader,
		private melodyEffectLoader: MelodyEffectLoader
	) {
		this.appData = new AppDataModel();
	}

	load(): Observable<boolean> {
		return Observable.create((observer: Observer<boolean>) => {
			forkJoin<any>(
				this.weaponLoader.load('weapons.tsv'),
				this.armorLoader.load('armor.tsv'),
				this.charmsLoader.load('charms.tsv'),
				this.decorationsLoader.load('decorations.tsv'),
				this.augmentationsLoader.load('augmentations.json'),
				this.modificationsLoader.load('modifications.json'),
				this.skillsLoader.load('skills.json'),
				this.setBonusesLoader.load('set-bonuses.json'),
				this.sharpnessModifiersLoader.load('sharpness-modifiers.json', false),
				this.weaponModifiersLoader.load('weapon-modifiers.json', false),
				this.ammoCapacitiesLoader.load('ammo-capacities.json', false),
				this.melodiesLoader.load('melodies.tsv', false),
				this.melodyEffectLoader.load('melody-effect.tsv', false)
			).subscribe(results => {
				this.appData.weapons = results[0];
				this.appData.armor = results[1];
				this.appData.charms = results[2];
				this.appData.decorations = results[3];
				this.appData.augmentations = results[4];
				this.appData.modifications = results[5];
				this.appData.skills = results[6];
				this.appData.setBonuses = results[7];
				this.appData.sharpnessModifiers = results[8];
				this.appData.weaponModifiers = results[9];
				this.appData.ammoCapacities = results[10];
				this.appData.melodies = results[11];
				this.appData.melodyEffect = results[12];

				observer.next(true);
				observer.complete();
			});
		});
	}
}

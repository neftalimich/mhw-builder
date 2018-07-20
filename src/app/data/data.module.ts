import { NgModule } from '@angular/core';
import { AmmoCapacitiesLoader } from './loaders/ammo-capacities.loader';
import { ArmorLoader } from './loaders/armor.loader';
import { AugmentationsLoader } from './loaders/augmentations.loader';
import { CharmsLoader } from './loaders/charms.loader';
import { DecorationsLoader } from './loaders/decorations.loader';
import { MelodiesLoader } from './loaders/melodies.loader';
import { MelodyEffectLoader } from './loaders/melodyEffect.loader';
import { SetBonusesLoader } from './loaders/set-bonuses.loader';
import { SharpnessModifiersLoader } from './loaders/sharpness-modifiers.loader';
import { SkillsLoader } from './loaders/skills.loader';
import { WeaponModifiersLoader } from './loaders/weapon-modifiers.loader';
import { WeaponsLoader } from './loaders/weapons.loader';

@NgModule({
	providers: [
		WeaponsLoader,
		ArmorLoader,
		CharmsLoader,
		DecorationsLoader,
		AugmentationsLoader,
		SkillsLoader,
		SetBonusesLoader,
		SharpnessModifiersLoader,
		WeaponModifiersLoader,
		AmmoCapacitiesLoader,
		MelodiesLoader,
		MelodyEffectLoader
	],
})
export class DataModule { }

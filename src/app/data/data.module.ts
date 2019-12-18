import { NgModule } from '@angular/core';
import { AmmoCapacitiesLoader } from './loaders/ammo-capacities.loader';
import { ArmorLoader } from './loaders/armor.loader';
import { AugmentationsLoader } from './loaders/augmentations.loader';
import { AwakeningsLoader } from './loaders/awakenings.loader';
import { CharmsLoader } from './loaders/charms.loader';
import { DecorationsLoader } from './loaders/decorations.loader';
import { KinsectsLoader } from './loaders/kinsects.loader';
import { MelodiesLoader } from './loaders/melodies.loader';
import { MelodyEffectLoader } from './loaders/melodyEffect.loader';
import { ModificationsLoader } from './loaders/modifications.loader';
import { SetBonusesLoader } from './loaders/set-bonuses.loader';
import { SharpnessModifiersLoader } from './loaders/sharpness-modifiers.loader';
import { SkillsLoader } from './loaders/skills.loader';
import { ToolsLoader } from './loaders/tools.loader';
import { UpgradesLoader } from './loaders/upgrades.loader';
import { WeaponModifiersLoader } from './loaders/weapon-modifiers.loader';
import { WeaponsLoader } from './loaders/weapons.loader';

@NgModule({
	providers: [
		WeaponsLoader,
		ArmorLoader,
		CharmsLoader,
		DecorationsLoader,
		AugmentationsLoader,
		ModificationsLoader,
		KinsectsLoader,
		SkillsLoader,
		SetBonusesLoader,
		SharpnessModifiersLoader,
		WeaponModifiersLoader,
		AmmoCapacitiesLoader,
		MelodiesLoader,
		MelodyEffectLoader,
		ToolsLoader,
		UpgradesLoader,
		AwakeningsLoader
	],
})
export class DataModule { }

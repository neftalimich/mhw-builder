import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AmmoCapacitiesModel } from '../models/ammo-capacities.model';
import { CalculationVariableModel } from '../models/calculation-variable.model';
import { ExtraDataModel } from '../models/extra-data.model';
import { KinsectModel } from '../models/kinsect.model';
import { SharpnessBarModel } from '../models/sharpness-bar.model';
import { StatDetailModel } from '../models/stat-detail.model';
import { StatsModel } from '../models/stats.model';
import { AttackType } from '../types/attack.type';

@Injectable()
export class CalculationService {
	public attackCalcsUpdated$ = new Subject<StatDetailModel[]>();
	public defenseCalcsUpdated$ = new Subject<StatDetailModel[]>();
	public ammoUpdated$ = new Subject<AmmoCapacitiesModel>();
	public kinsectUpdated$ = new Subject<KinsectModel>();
	public sharpnessUpdated$ = new Subject<SharpnessBarModel>();
	public extraDataUpdated$ = new Subject<ExtraDataModel>();

	attackCalcs = new Array<StatDetailModel>();
	defenseCalcs = new Array<StatDetailModel>();
	sharpnessBar = new SharpnessBarModel;
	extraData = new ExtraDataModel;

	constructor() {
		this.defenseCalcs.push({
			name: 'Defense',
			value: '',
			icon: 'defense'
		});

		this.defenseCalcs.push({
			name: 'Health',
			value: '100',
			icon: 'health'
		});

		this.defenseCalcs.push({
			name: 'Stamina',
			value: '100',
			icon: 'stamina'
		});

		this.defenseCalcs.push({
			name: 'Fire Resist',
			value: '',
			icon: 'fire'
		});

		this.defenseCalcs.push({
			name: 'Water Resist',
			value: '',
			icon: 'water'
		});

		this.defenseCalcs.push({
			name: 'Thunder Resist',
			value: '',
			icon: 'thunder'
		});

		this.defenseCalcs.push({
			name: 'Ice Resist',
			value: '',
			icon: 'ice'
		});

		this.defenseCalcs.push({
			name: 'Dragon Resist',
			value: '',
			icon: 'dragon'
		});
	}

	updateCalcs(stats: StatsModel) {
		this.buildAttackCalcs(stats);
		this.buildDefenseCalcs(stats);
		this.buildAmmoCapacities(stats);
		this.buildKinsect(stats);
		this.getSharpnessBar(stats);
		this.getExtraData(stats);

		this.attackCalcsUpdated$.next(this.attackCalcs);
		this.defenseCalcsUpdated$.next(this.defenseCalcs);

		this.ammoUpdated$.next(stats.ammoCapacitiesUp);
		this.kinsectUpdated$.next(stats.kinsect);
		this.sharpnessUpdated$.next(this.sharpnessBar);
		this.extraDataUpdated$.next(this.extraData);
	}

	private buildAttackCalcs(stats: StatsModel) {
		this.attackCalcs = [];

		this.attackCalcs.push(this.getAttack(stats));
		if (stats.activeAttack || stats.effectivePhysicalSharpnessModifier) {
			this.attackCalcs.push(this.getAttackPotential(stats));
		}

		this.attackCalcs.push(this.getAffinity(stats));
		if (stats.activeAffinity || stats.weakPointAffinity) {
			this.attackCalcs.push(this.getAffinityPotential(stats));
		}

		this.attackCalcs.push(this.getCriticalBoost(stats));

		if (stats.ailment) {
			const ailmentCalc = this.getAilment(stats);
			// this.attackCalcs.push(ailmentCalc);
			this.attackCalcs.push(this.getAilmentAttack(stats, ailmentCalc));
		}

		if (stats.element) {
			const elementCalc = this.getElement(stats);
			// this.attackCalcs.push(elementCalc);
			this.attackCalcs.push(this.getElementAttack(stats, elementCalc));
		}

		if (stats.element) {
			if (stats.trueCriticalElement) {
				this.attackCalcs.push({
					name: 'Elemental Critical Boost',
					value: stats.trueCritElementModifier * 100 + '%',
					icon: stats.element.toLowerCase() + '-gray'
				});
			} else if (stats.criticalElement) {
				this.attackCalcs.push({
					name: 'Elemental Critical Boost',
					value: stats.critElementModifier * 100 + '%',
					icon: stats.element.toLowerCase() + '-gray'
				});
			}
		}

		if (stats.ailment) {
			if (stats.trueCriticalStatus) {
				this.attackCalcs.push({
					name: 'Ailment Critical Boost',
					value: stats.trueCritStatusModifier * 100 + '%',
					icon: stats.ailment.toLowerCase() + '-gray'
				});
			} else if (stats.criticalStatus) {
				this.attackCalcs.push({
					name: 'Ailment Critical Boost',
					value: stats.critStatusModifier * 100 + '%',
					icon: stats.ailment.toLowerCase() + '-gray'
				});
			}
		}

		if (stats.elderseal) {
			this.attackCalcs.push(this.getElderseal(stats));
		}

		if (stats.healOnHitPercent) {
			this.attackCalcs.push({
				name: 'Heal on Hit',
				value: stats.healOnHitPercent + '%'
			});
		}
		if (stats.hastenRecovery != null) {
			this.attackCalcs.push({
				name: 'Heal every 5 Hits',
				value: stats.hastenRecovery + 'HP'
			});
		}
		if (stats.frostcraft != null) {
			this.attackCalcs.push({
				name: 'Frostcraft',
				value: `+[${stats.frostcraft.join(', ')}]% ATK`
			});
		}
		this.attackCalcs.push(this.getRawAttack(stats));
		this.attackCalcs.push(this.getRawAttackCritical(stats));
		this.attackCalcs.push(this.getRawAttackAverage(stats));
	}

	private getAttack(stats: StatsModel): StatDetailModel {
		const attackCalc: StatDetailModel = {
			name: 'Attack',
			value: stats.totalAttack,
			calculationVariables: [
				{
					displayName: 'Base Raw Attack',
					name: 'attack',
					value: Math.round(stats.attack / stats.weaponAttackModifier),
					colorClass: 'blue'
				},
				{
					displayName: 'Upgrade Attack',
					name: 'upgrade',
					value: stats.upgradeAttack,
					colorClass: 'green'
				},
				{
					displayName: 'Passive Attack',
					name: 'passiveAttack',
					value: stats.passiveAttack,
					colorClass: 'yellow'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier,
					colorClass: 'ogreen'
				}
			]
		};

		if (stats.elementless) {
			attackCalc.calculationVariables.push(this.getElementlessVariable(stats));
			attackCalc.calculationTemplate =
				`({attack} × {elementlessBoostPercent} + {upgrade}${stats.awakeningAttack ? ' + {awakening}' : ''} + {passiveAttack}) × {weaponModifier} ≈ ${stats.totalAttack}`;
		} else {
			attackCalc.calculationTemplate =
				`({attack} + {upgrade}${stats.awakeningAttack ? ' + {awakening}' : ''} + {passiveAttack}) × {weaponModifier} ≈ ${stats.totalAttack}`;
		}

		if (stats.awakeningAttack > 0) {
			attackCalc.calculationVariables.splice(2, 0, this.getAwakeningVariable(stats));
		}

		return attackCalc;
	}

	private getAttackPotential(stats: StatsModel): StatDetailModel {
		const attackPotentialCalc: StatDetailModel = {
			name: 'Attack Potential',
			value: stats.totalAttackPotential,
			calculationVariables: [
				{
					displayName: 'Base Raw Attack',
					name: 'attack',
					value: Math.round(stats.attack / stats.weaponAttackModifier),
					colorClass: 'blue'
				},
				{
					displayName: 'Upgrade Attack',
					name: 'upgrade',
					value: stats.upgradeAttack,
					colorClass: 'green'
				},
				{
					displayName: 'Passive Attack',
					name: 'passiveAttack',
					value: stats.passiveAttack,
					colorClass: 'yellow'
				},
				{
					displayName: 'Active Attack',
					name: 'activeAttack',
					value: stats.activeAttack,
					colorClass: 'orange'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier,
					colorClass: 'ogreen'
				},
				{
					displayName: 'Physical Sharpness Modifier',
					name: 'sharpnessModifier',
					value: stats.effectivePhysicalSharpnessModifier,
					colorClass: 'purple'
				}
			]
		};

		if (stats.elementlessBoostPercent > 0 && stats.totalAilmentAttack == 0 && stats.totalElementAttack == 0) {
			attackPotentialCalc.calculationTemplate =
				(stats.activeAttackPercent > 0 ? `(` : ``)
				+ `({attack} × {elementlessBoostPercent}`
				+ ` + {upgrade}${stats.awakeningAttack ? ` + {awakening}` : ``}`
				+ (stats.activeAttackPercent > 0 ? `) × {activeAttackPercent}` : ``)
				+ ` + {passiveAttack} + {activeAttack})`
				+ `<br> × {weaponModifier} × {sharpnessModifier}`
				+ `<br>≈<br>${Math.round(stats.totalAttackPotential * stats.effectivePhysicalSharpnessModifier)}`;
			attackPotentialCalc.calculationVariables.push(this.getElementlessVariable(stats));
		} else {
			attackPotentialCalc.calculationTemplate =
				(stats.activeAttackPercent > 0 ? `(` : ``)
				+ `({attack}`
				+ ` + {upgrade}${stats.awakeningAttack ? ` + {awakening}` : ``}`
				+ (stats.activeAttackPercent > 0 ? `) × {activeAttackPercent}` : ``)
				+ ` + {passiveAttack} + {activeAttack})`
				+ ` × {weaponModifier} × {sharpnessModifier}`
				+ `<br>≈<br>${Math.round(stats.totalAttackPotential * stats.effectivePhysicalSharpnessModifier)}`;
		}

		if (stats.activeAttackPercent > 0) {
			attackPotentialCalc.calculationVariables.splice(4, 0, {
				displayName: 'Active Attack Percent',
				name: 'activeAttackPercent',
				value: stats.activeAttackPercent / 100,
				colorClass: 'red'
			});
		}

		if (stats.awakeningAttack > 0) {
			attackPotentialCalc.calculationVariables.splice(2, 0, this.getAwakeningVariable(stats));
		}

		return attackPotentialCalc;
	}

	private getElementlessVariable(stats: StatsModel): CalculationVariableModel {
		return {
			displayName: 'Elementless Boost Modifier',
			name: 'elementlessBoostPercent',
			value: (1 + stats.elementlessBoostPercent / 100).toFixed(2),
			colorClass: 'kakhi'
		};
	}

	private getAwakeningVariable(stats: StatsModel): CalculationVariableModel {
		return {
			displayName: 'Awakening Attack',
			name: 'awakening',
			value: stats.awakeningAttack,
			colorClass: 'green'
		};
	}

	private getSharpnessBar(stats: StatsModel) {
		if (stats.sharpnessLevelsBar && !isNaN(stats.sharpnessLevelsBar[0])) {
			this.sharpnessBar.levels = JSON.parse(JSON.stringify(stats.sharpnessLevelsBar));
			this.sharpnessBar.handicraftLevel = (stats.passiveSharpness / 10);
			this.sharpnessBar.sharpnessDataNeeded = stats.sharpnessDataNeeded;
		} else {
			this.sharpnessBar.levels = null;
		}
	}

	private getExtraData(stats: StatsModel) {
		this.extraData = stats.extraData;
	}

	private getAffinity(stats: StatsModel): StatDetailModel {
		const affinityValue = `${stats.affinity + stats.passiveAffinity}%`;
		const affinityCalc: StatDetailModel = {
			name: 'Affinity',
			value: affinityValue,
			calculationTemplate: `{affinity} + {passiveAffinity} = ${affinityValue}`,
			calculationVariables: [
				{
					displayName: 'Weapon Base Affinity',
					name: 'affinity',
					value: stats.affinity,
					colorClass: 'green'
				},
				{
					displayName: 'Passive Affinity',
					name: 'passiveAffinity',
					value: stats.passiveAffinity,
					colorClass: 'blue'
				}
			]
		};

		return affinityCalc;
	}

	private getAffinityPotential(stats: StatsModel): StatDetailModel {
		const affinityTotal = stats.affinity + stats.passiveAffinity + stats.weakPointAffinity + stats.activeAffinity;
		const value = `${affinityTotal}%`;
		const affinityPotentialCalc: StatDetailModel = {
			name: 'Affinity Potential',
			value: value,
			calculationTemplate: `Base: {base} + {passive} + {weakPoint} + {active} = ${value}`,
			calculationVariables: [
				{
					displayName: 'Weapon Base Affinity',
					name: 'base',
					value: stats.affinity,
					colorClass: 'green'
				},
				{
					displayName: 'Passive Affinity',
					name: 'passive',
					value: stats.passiveAffinity,
					colorClass: 'yellow'
				},
				{
					displayName: 'Weak Point Affinity',
					name: 'weakPoint',
					value: stats.weakPointAffinity,
					colorClass: 'blue'
				},
				{
					displayName: 'Active Affinity',
					name: 'active',
					value: stats.activeAffinity,
					colorClass: 'orange'
				}
			]
		};

		return affinityPotentialCalc;
	}

	private getCriticalBoost(stats: StatsModel): StatDetailModel {
		const critBoostValue = `${125 + stats.passiveCriticalBoostPercent}%`;
		const critBoostCalc: StatDetailModel = {
			name: 'Critical Boost',
			value: critBoostValue,
			calculationTemplate: `{base} + {passive} = ${critBoostValue}`,
			calculationVariables: [
				{
					displayName: 'Base Critical Boost',
					name: 'base',
					value: '125',
					colorClass: 'green'
				},
				{
					displayName: 'Passive Critical Boost',
					name: 'passive',
					value: stats.passiveCriticalBoostPercent,
					colorClass: 'blue'
				}
			]
		};

		return critBoostCalc;
	}

	private getAilment(stats: StatsModel): StatDetailModel {
		const ailmentCalc: StatDetailModel = {
			name: 'Ailment',
			value: stats.ailment,
			info: []
		};

		if (stats.ailmentCapped) {
			ailmentCalc.info.push('Ailment attack is capped.');
			ailmentCalc.color = 'yellow';
		}

		if (stats.ailmentHidden && stats.elementAttackMultiplier < 1) {
			ailmentCalc.info.push('Effectiveness reduced due to hidden ailment.');
			ailmentCalc.color = !stats.elementAttackMultiplier ? 'gray' : 'lightgray';
		}

		return ailmentCalc;
	}

	private getAilmentAttack(stats: StatsModel, ailmentCalc: StatDetailModel): StatDetailModel {
		let value = `${Math.round(stats.totalAilmentAttack)}`;
		if (stats.totalAilmentAttack != stats.totalAilmentAttackPotential) {
			value = `${stats.totalAilmentAttack} | ${stats.totalAilmentAttackPotential}`;
		}
		const ailmentAttackCalc: StatDetailModel = {
			name: 'Ailment Attack',
			value: value,
			valueColor: ailmentCalc.color,
			icon: stats.ailment.toLowerCase() + (stats.effectiveAilmentAttack == 0 ? '-gray' : ''),
			color: ailmentCalc.color,
			info: ailmentCalc.info,
			calculationVariables: [
				{
					displayName: 'Weapon Base Ailment Attack',
					name: 'base',
					value: stats.baseAilmentAttack - stats.upgradeAilmentAttack - stats.awakeningAilmentAttack,
					colorClass: 'blue'
				},
				{
					displayName: 'Weapon Upgrade Ailment Attack',
					name: 'upgrade',
					value: stats.upgradeAilmentAttack,
					colorClass: 'green'
				},
				{
					displayName: 'Weapon Awakening Ailment Attack',
					name: 'awakening',
					value: stats.awakeningAilmentAttack,
					colorClass: 'green'
				},
				{
					displayName: 'Passive Ailment Buildup Percent',
					name: 'passiveBuildup',
					value: stats.effectivePassiveAilmentBuildupPercent / 100,
					colorClass: 'oyellow'
				},
				{
					displayName: 'Passive Ailment Attack',
					name: 'passive',
					value: stats.effectivePassiveAilmentAttack,
					colorClass: 'yellow'
				},
				{
					displayName: 'Active Ailment Attack',
					name: 'active',
					value: stats.activeAilmentAttack,
					colorClass: 'orange'
				},
				{
					displayName: 'Active Ailment Buildup Percent',
					name: 'activeBuildup',
					value: stats.activeAilmentAttackBuildUpPercent / 100,
					colorClass: 'red'
				}
			]
		};

		if (stats.ailmentHidden) {
			ailmentAttackCalc.calculationVariables.push({
				displayName: 'Hidden Ailment Multiplier',
				name: 'multiplier',
				value: stats.elementAttackMultiplier,
				colorClass: 'kakhi'
			});

			if (stats.elementAttackMultiplier) {
				ailmentAttackCalc.calculationTemplate =
					`(({base} + {upgrade} + {awakening}) × {multiplier} (1 + {passiveBuildup} + {activeBuildup}) + {passive} + {active} ≈ ${stats.totalAilmentAttackPotential}`;
			} else {
				ailmentAttackCalc.calculationTemplate =
					`(({base} + {upgrade} + {awakening}) × (1 + {passiveBuildup} + {activeBuildup}) + {passive} + {active}) × {multiplier} ≈ ${stats.totalAilmentAttackPotential}`;
			}
		} else {
			ailmentAttackCalc.calculationTemplate =
				`({base} + {upgrade} + {awakening}) × (1 + {passiveBuildup} + {activeBuildup}) + {passive} + {active} ≈ ${stats.totalAilmentAttackPotential}`;
		}

		return ailmentAttackCalc;
	}

	private getElement(stats: StatsModel): StatDetailModel {
		const elementCalc: StatDetailModel = {
			name: 'Element',
			value: stats.element,
			info: []
		};

		if (stats.elementCapped) {
			elementCalc.info.push('Element attack is capped.');
			elementCalc.color = 'yellow';
		}

		if (stats.elementHidden && stats.elementAttackMultiplier < 1) {
			elementCalc.info.push('Effectiveness reduced due to hidden element.');
			elementCalc.color = !stats.elementAttackMultiplier ? 'gray' : 'lightgray';
		}

		return elementCalc;
	}

	private getElementAttack(stats: StatsModel, elementCalc: StatDetailModel): StatDetailModel {
		let value = `${Math.round(stats.totalElementAttack)}`;
		if (stats.totalElementAttack != stats.totalElementAttackPotential) {
			value = `${stats.totalElementAttack} | ${stats.totalElementAttackPotential}`;
		}
		const elementAttackCalc: StatDetailModel = {
			name: 'Elment Attack',
			value: value,
			valueColor: elementCalc.color,
			icon: stats.element.toLowerCase() + (stats.effectiveElementAttack == 0 ? '-gray' : ''),
			color: elementCalc.color,
			info: elementCalc.info,
			calculationVariables: [
				{
					displayName: 'Weapon Base Element Attack',
					name: 'base',
					value: stats.baseElementAttack - stats.upgradeElementAttack - stats.awakeningElementAttack,
					colorClass: 'blue'
				},
				{
					displayName: 'Weapon Upgrade Element Attack',
					name: 'upgrade',
					value: stats.upgradeElementAttack,
					colorClass: 'green'
				},
				{
					displayName: 'Weapon Awakening Element Attack',
					name: 'awakening',
					value: stats.awakeningElementAttack,
					colorClass: 'green'
				},
				{
					displayName: 'Passive Element Attack',
					name: 'passive',
					value: stats.effectivePassiveElementAttack,
					colorClass: 'yellow'
				},
				{
					displayName: 'Active Element Attack',
					name: 'active',
					value: stats.activeElementAttack,
					colorClass: 'orange'
				}
			]
		};

		if (stats.elementHidden) {
			elementAttackCalc.calculationVariables.push({
				displayName: 'Hidden Element Multiplier',
				name: 'multiplier',
				value: stats.elementAttackMultiplier,
				colorClass: 'kakhi'
			});

			if (stats.elementAttackMultiplier) {
				elementAttackCalc.calculationTemplate = `({base} + {upgrade} + {awakening}) × {multiplier} + {passive} + {active} ≈ ${stats.totalElementAttackPotential}`;
			} else {
				elementAttackCalc.calculationTemplate = `({base + {upgrade} + {awakening}} + {passive} + {active}) × {multiplier} ≈ ${stats.totalElementAttackPotential}`;
			}
		} else {
			elementAttackCalc.calculationTemplate = `{base} + {upgrade} + {awakening} + {passive} + {active} = ${stats.totalElementAttackPotential}`;
		}

		return elementAttackCalc;
	}

	private getElderseal(stats: StatsModel): StatDetailModel {
		return {
			name: 'Elderseal',
			value: stats.elderseal
		};
	}

	private getRawAttack(stats: StatsModel): StatDetailModel {
		const totalAffinityPotential =
			Math.min(stats.affinity + stats.passiveAffinity + stats.weakPointAffinity + stats.activeAffinity, 100);

		const auxDivider = (stats.ailment && stats.element) ? 2 : 1;

		const trueElement =
			this.getElementAverage(
				stats.totalElementAttack, // Attack
				0, // Affinity
				0, // Critical Modifier
				stats.effectiveElementalSharpnessModifier, // Weaponn Modifier
				auxDivider // Divider
			);

		const trueAilment =
			this.getAilmentAverage(
				stats.totalAilmentAttack, // Attack
				0, // Affinity
				0, // Critical Modifier
				stats.effectiveElementalSharpnessModifier, // Weapon Modifier
				auxDivider // Divider
			);

		const rawAttackAveragePotentialCalc: StatDetailModel = {
			name: 'True Raw',
			value: Number.isInteger(stats.totalAttackPotential) ?
				`${Math.round(stats.totalAttackPotential * stats.effectivePhysicalSharpnessModifier / stats.weaponAttackModifier)}`
				: 0,
			extra1: stats.ailment && trueAilment ? trueAilment : null,
			class1: stats.ailment && trueAilment ? stats.ailment : null,
			extra2: stats.element && trueElement ? trueElement : null,
			class2: stats.element && trueElement ? stats.element : null,
			calculationTemplate:
				`{totalAttackPotential} × {sharpnessModifier} ÷ {weaponModifier} ≈ ${Math.round(stats.totalAttackPotential * stats.effectivePhysicalSharpnessModifier / stats.weaponAttackModifier)}`,
			calculationVariables: [
				{
					displayName: 'Total Attack Potential',
					name: 'totalAttackPotential',
					value: stats.totalAttackPotential,
					colorClass: 'green'
				},
				{
					displayName: 'Total Affinity Potential',
					name: 'totalAffinityPotential',
					value: (totalAffinityPotential / 100).toFixed(2),
					colorClass: 'blue'
				},
				{
					displayName: 'Physical Sharpness Modifier',
					name: 'sharpnessModifier',
					value: stats.effectivePhysicalSharpnessModifier,
					colorClass: 'purple'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier.toFixed(2),
					colorClass: 'ogreen'
				}
			]
		};

		return rawAttackAveragePotentialCalc;
	}

	private getRawAttackCritical(stats: StatsModel): StatDetailModel {
		const totalAffinityPotential = Math.min(stats.affinity + stats.passiveAffinity + stats.weakPointAffinity + stats.activeAffinity, 100);

		const auxDivider = (stats.ailment && stats.element) ? 2 : 1;

		let elementCriticalBoost = 1;
		if (stats.trueCriticalElement) {
			elementCriticalBoost = stats.trueCritElementModifier;
		} else if (stats.criticalElement) {
			elementCriticalBoost = stats.critElementModifier;
		}
		const trueElement =
			this.getElementAverage(
				stats.totalElementAttackPotential,
				100,
				elementCriticalBoost,
				stats.effectiveElementalSharpnessModifier,
				auxDivider
			);

		let ailmentCriticalBoost = 1;
		if (stats.trueCriticalStatus) {
			ailmentCriticalBoost = stats.trueCritStatusModifier;
		} else if (stats.criticalStatus) {
			ailmentCriticalBoost = stats.critStatusModifier;
		}
		const trueAilment =
			this.getAilmentAverage(
				stats.totalAilmentAttackPotential,
				100,
				ailmentCriticalBoost,
				stats.effectiveElementalSharpnessModifier,
				auxDivider
			);

		const rawAttackAveragePotentialCalc: StatDetailModel = {
			name: 'True Critical Raw',
			value: Number.isInteger(stats.totalAttackPotential) ?
				`${Math.round(stats.totalAttackPotential * (1.25 + stats.passiveCriticalBoostPercent / 100) * stats.effectivePhysicalSharpnessModifier / stats.weaponAttackModifier)}`
				: 0,
			extra1: stats.ailment && trueAilment ? trueAilment : null,
			class1: stats.ailment && trueAilment ? stats.ailment : null,
			extra2: stats.element && trueElement ? trueElement : null,
			class2: stats.element && trueElement ? stats.element : null,
			calculationTemplate:
				`{totalAttackPotential} × {criticalBoost} × {sharpnessModifier} ÷ {weaponModifier} ≈ ${Math.round(stats.totalAttackPotential * (1.25 + stats.passiveCriticalBoostPercent / 100) * stats.effectivePhysicalSharpnessModifier / stats.weaponAttackModifier)}`,
			calculationVariables: [
				{
					displayName: 'Total Attack Potential',
					name: 'totalAttackPotential',
					value: stats.totalAttackPotential,
					colorClass: 'green'
				},
				{
					displayName: 'Total Affinity Potential',
					name: 'totalAffinityPotential',
					value: (totalAffinityPotential / 100).toFixed(2),
					colorClass: 'blue'
				},
				{
					displayName: 'Total Critical Boost',
					name: 'criticalBoost',
					value: ((stats.passiveCriticalBoostPercent + 125) / 100).toFixed(2),
					colorClass: 'oblue'
				},
				{
					displayName: 'Physical Sharpness Modifier',
					name: 'sharpnessModifier',
					value: stats.effectivePhysicalSharpnessModifier,
					colorClass: 'purple'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier.toFixed(2),
					colorClass: 'ogreen'
				}
			]
		};

		return rawAttackAveragePotentialCalc;
	}

	private getRawAttackAverage(stats: StatsModel): StatDetailModel {
		const totalAffinityPotential = Math.min(stats.affinity + stats.passiveAffinity + stats.weakPointAffinity + stats.activeAffinity, 100);
		const rawAttackAveragePotential =
			this.getRawAverage(
				stats.totalAttackPotential,
				totalAffinityPotential,
				stats.passiveCriticalBoostPercent,
				stats.weaponAttackModifier
			);

		const auxDivider = (stats.ailment && stats.element) ? 2 : 1;

		let elementCriticalBoost = 1;
		if (stats.trueCriticalElement) {
			elementCriticalBoost = stats.trueCritElementModifier;
		} else if (stats.criticalElement) {
			elementCriticalBoost = stats.critElementModifier;
		}
		const trueElementPotential =
			this.getElementAverage(
				stats.totalElementAttackPotential,
				Math.max(totalAffinityPotential, 0),
				elementCriticalBoost,
				stats.effectiveElementalSharpnessModifier,
				auxDivider
			);

		let ailmentCriticalBoost = 1;
		if (stats.trueCriticalStatus) {
			ailmentCriticalBoost = stats.trueCritStatusModifier;
		} else if (stats.criticalStatus) {
			ailmentCriticalBoost = stats.critStatusModifier;
		}
		const trueAilmentPotential =
			this.getAilmentAverage(
				stats.totalAilmentAttackPotential,
				Math.max(totalAffinityPotential, 0),
				ailmentCriticalBoost,
				stats.effectiveElementalSharpnessModifier,
				auxDivider
			);

		const rawAttackAveragePotentialCalc: StatDetailModel = {
			name: 'True Average Raw',
			value: Number.isInteger(rawAttackAveragePotential) ? Math.round(rawAttackAveragePotential * stats.effectivePhysicalSharpnessModifier) : 0,
			calculationTemplate:
				`<i class="fas fa-bullseye fa-sm"></i> ({totalAttackPotential} × {totalAffinityPotential} × {criticalBoost} + {totalAttackPotential} × (1 - {totalAffinityPotential}))`
				+ `<br>× {sharpnessModifier} ÷ {weaponModifier} ≈ ${rawAttackAveragePotential}`,
			calculationVariables: [
				{
					displayName: 'Total Attack Potential',
					name: 'totalAttackPotential',
					value: stats.totalAttackPotential,
					colorClass: 'green'
				},
				{
					displayName: 'Total Affinity Potential',
					name: 'totalAffinityPotential',
					value: (totalAffinityPotential / 100).toFixed(2),
					colorClass: 'blue'
				},
				{
					displayName: 'Total Critical Boost',
					name: 'criticalBoost',
					value: ((stats.passiveCriticalBoostPercent + 125) / 100).toFixed(2),
					colorClass: 'oblue'
				},
				{
					displayName: 'Physical Sharpness Modifier',
					name: 'sharpnessModifier',
					value: stats.effectivePhysicalSharpnessModifier,
					colorClass: 'purple'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier.toFixed(2),
					colorClass: 'ogreen'
				}
			]
		};

		if (stats.ailment && trueAilmentPotential) {
			rawAttackAveragePotentialCalc.extra1 = trueAilmentPotential;
			rawAttackAveragePotentialCalc.class1 = stats.ailment;
			rawAttackAveragePotentialCalc.calculationTemplate +=
				`<br><i class="fas fa-bullseye fa-xs"></i> ({totalAilmentPotential} × {totalAffinityPotential} × {criticalAilmentBoost} + {totalAilmentPotential} × (1 - {totalAffinityPotential}))`
				+ `<br> × {elementSharpnessModifier} ÷ 30${auxDivider == 2 ? ' ÷ 2' : ''} ≈ ${trueAilmentPotential}`;
			rawAttackAveragePotentialCalc.calculationVariables.push(
				{
					displayName: 'Ailement Attack Potential',
					name: 'totalAilmentPotential',
					value: stats.totalAilmentAttackPotential,
					colorClass: 'green'
				},
				{
					displayName: 'Ailment Critical Boost',
					name: 'criticalAilmentBoost',
					value: ailmentCriticalBoost.toFixed(2),
					colorClass: 'oblue'
				}
			);
		}
		if (stats.element && trueElementPotential) {
			rawAttackAveragePotentialCalc.extra2 = trueElementPotential;
			rawAttackAveragePotentialCalc.class2 = stats.element;
			rawAttackAveragePotentialCalc.calculationTemplate +=
				`<br><i class="fas fa-bullseye fa-xs"></i> ({totalElementPotential} × {totalAffinityPotential} × {criticalElementBoost} + {totalElementPotential} × (1 - {totalAffinityPotential}))`
				+ `<br> × {elementSharpnessModifier} ÷ 10${auxDivider == 2 ? ' ÷ 2' : ''} ≈ ${trueElementPotential}`;
			rawAttackAveragePotentialCalc.calculationVariables.push(
				{
					displayName: 'Element Attack Potential',
					name: 'totalElementPotential',
					value: stats.totalElementAttackPotential,
					colorClass: 'green'
				},
				{
					displayName: 'Element Critical Boost',
					name: 'criticalElementBoost',
					value: elementCriticalBoost.toFixed(2),
					colorClass: 'oblue'
				}
			);
		}

		if (stats.ailment && trueAilmentPotential || stats.element && trueElementPotential) {
			rawAttackAveragePotentialCalc.calculationVariables.push({
				displayName: 'Element Sharpness Modifier',
				name: 'elementSharpnessModifier',
				value: stats.effectiveElementalSharpnessModifier.toFixed(2),
				colorClass: 'purple'
			});
		}

		return rawAttackAveragePotentialCalc;
	}

	private buildDefenseCalcs(stats: StatsModel) {
		let defValue = '';
		for (let i = 0; i < stats.defense.length; i++) {
			defValue += Math.round(stats.defense[i] * (1 + stats.passiveDefensePercent / 100) + stats.passiveDefense + stats.activeDefense);
			if (i < stats.defense.length - 2) {
				defValue += ' ➝ ';
			} else if (i < stats.defense.length - 1) {
				defValue += ' ➟ ';
			}
		}

		// Defense [0]
		this.defenseCalcs[0].value = defValue;
		// Health [1]
		if (stats.passiveHealth) {
			this.defenseCalcs[1].value = 100 + stats.passiveHealth;
		}
		// Stamina [2]
		if (stats.passiveStamina) {
			this.defenseCalcs[2].value = 100 + stats.passiveStamina;
		}
		// Fire [3]
		this.defenseCalcs[3].value = stats.fireResist + stats.passiveFireResist;
		// Water [4]
		this.defenseCalcs[4].value = stats.waterResist + stats.passiveWaterResist;
		// Thunder [5]
		this.defenseCalcs[5].value = stats.thunderResist + stats.passiveThunderResist;
		// Ice [6]
		this.defenseCalcs[6].value = stats.iceResist + stats.passiveIceResist;
		// Dragon [7]
		this.defenseCalcs[7].value = stats.dragonResist + stats.passiveDragonResist;
	}

	private buildAmmoCapacities(stats: StatsModel) {
		if (stats.ammoCapacities) {
			stats.ammoCapacitiesUp = JSON.parse(JSON.stringify(stats.ammoCapacities));
			if (stats.ammoUp >= 1) {
				for (const ammo of stats.ammoCapacitiesUp.ammo) {
					if (ammo.levels.length == 3) {
						if (ammo.name !== 'sticky' && ammo.name !== 'cluster') {
							ammo.levels[0].capacity
								+= (ammo.levels[0].capacity >= 5 ? 2 : (ammo.levels[0].capacity > 0 ? 1 : 0));
						} else {
							ammo.levels[0].capacity
								+= (ammo.levels[0].capacity < 3 && ammo.levels[0].capacity > 0 ? 1 : 0);
						}
					}
				}
			}
			if (stats.ammoUp >= 2) {
				for (const ammo of stats.ammoCapacitiesUp.ammo) {
					if (ammo.levels.length == 3) {
						if (ammo.name !== 'sticky' && ammo.name !== 'cluster') {
							ammo.levels[1].capacity
								+= (ammo.levels[1].capacity >= 5 ? 2 : (ammo.levels[1].capacity > 0 ? 1 : 0));
						} else {
							ammo.levels[1].capacity
								+= (ammo.levels[1].capacity < 3 && ammo.levels[1].capacity > 0 ? 1 : 0);
						}
					}
					if (ammo.levels.length == 2) {
						ammo.levels[0].capacity
							+= (ammo.levels[0].capacity >= 5 ? 2 : (ammo.levels[0].capacity > 0 ? 1 : 0));
					}
				}
			}
			if (stats.ammoUp >= 3) {
				for (const ammo of stats.ammoCapacitiesUp.ammo) {
					if (ammo.levels.length == 3) {
						if (ammo.name !== 'sticky' && ammo.name !== 'cluster') {
							ammo.levels[2].capacity
								+= (ammo.levels[2].capacity >= 5 ? 2 : (ammo.levels[2].capacity > 0 ? 1 : 0));
						} else {
							ammo.levels[2].capacity
								+= (ammo.levels[2].capacity < 3 && ammo.levels[2].capacity > 0 ? 1 : 0);
						}
					}
					if (ammo.levels.length == 2) {
						ammo.levels[1].capacity
							+= (ammo.levels[1].capacity >= 5 ? 2 : (ammo.levels[1].capacity > 0 ? 1 : 0));
					}
					if (ammo.levels.length == 1) {
						if (ammo.name == 'wyvern') {
						} else if (ammo.name !== 'dragon' && ammo.name !== 'slicing') {
							ammo.levels[0].capacity
								+= (ammo.levels[0].capacity >= 5 ? 2 : (ammo.levels[0].capacity > 0 ? 1 : 0));
						} else {
							ammo.levels[0].capacity
								+= (ammo.levels[0].capacity < 3 && ammo.levels[0].capacity > 0 ? 1 : 0);
						}
					}
				}
			}
		}
	}

	private buildKinsect(stats: StatsModel) {
		if (stats.kinsect) {
			if (stats.extraData) {
				switch (stats.extraData.otherData[0].value) {
					case 'Blunt':
						if (stats.kinsect.attackType == AttackType.Blunt) {
							// stats.kinsect.power += 2;
						}
						break;
					case 'Sever':
						if (stats.kinsect.attackType == AttackType.Sever) {
							// stats.kinsect.power += 2;
						}
						break;
					case 'Element':
						if (stats.kinsect.element) {
							// stats.kinsect.powerElement += 2;
						}
						break;
					case 'Health':
						// stats.kinsect.heal += 2;
						break;
					case 'Speed':
						// stats.kinsect.speed += 2;
						break;
					case 'Stamina':
						break;
					default:
						break;
				}
			}
		}
	}

	private getRawAverage(attack: number, affinity: number, criticalBoostPercent: number, weaponAttackModifier: number): number {
		const attackWithAffinity = attack * (Math.min(affinity, 100) / 100) * (Math.min(affinity, 100) > 0 ? (criticalBoostPercent + 125) / 100 : 1.25);
		const attackWithoutAffinity = attack * (1 - Math.min(affinity, 100) / 100);
		return Math.round((attackWithAffinity + attackWithoutAffinity) / weaponAttackModifier);
	}

	private getAilmentAverage(attack: number, affinity: number, criticalModifier: number, sharpnessModifier: number, auxDivider: number): number {
		const ailmentWithAffinity = attack * (Math.min(affinity, 100) / 100) * (Math.min(affinity, 100) > 0 ? criticalModifier : 1);
		const ailmentWithoutAffinity = attack * (1 - Math.min(affinity, 100) / 100);
		return Math.round((ailmentWithAffinity + ailmentWithoutAffinity) * sharpnessModifier / 30 / (auxDivider ? auxDivider : 1));
	}

	private getElementAverage(attack: number, affinity: number, criticalModifier: number, sharpnessModifier: number, auxDivider: number): number {
		const elementWithAffinity = attack * (Math.min(affinity, 100) / 100) * criticalModifier;
		const elementWithoutAffinity = attack * (1 - Math.min(affinity, 100) / 100);
		return Math.round((elementWithAffinity + elementWithoutAffinity) * sharpnessModifier / 10 / (auxDivider ? auxDivider : 1));
	}
}

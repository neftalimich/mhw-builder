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
			this.attackCalcs.push(this.getHealOnHitPercent(stats));
		}

		this.attackCalcs.push(this.getRawAttackAverage(stats));
		this.attackCalcs.push(this.getRawAttackAveragePotential(stats));
	}

	private getAttack(stats: StatsModel): StatDetailModel {
		const attackCalc: StatDetailModel = {
			name: 'Attack',
			value: stats.totalAttack,
			calculationVariables: [
				{
					displayName: 'Base Weapon Attack',
					name: 'attack',
					value: stats.attack,
					colorClass: 'green'
				},
				{
					displayName: 'Passive Attack',
					name: 'passiveAttack',
					value: stats.passiveAttack,
					colorClass: 'orange'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier,
					colorClass: 'purple'
				}
			]
		};

		if (stats.elementless) {
			attackCalc.calculationVariables.push(this.getElementlessVariable(stats));
			attackCalc.calculationTemplate = `{attack} × (1 + {elementlessBoostPercent}) + {passiveAttack} × {weaponModifier} ≈ ${stats.totalAttack}`;
		} else {
			attackCalc.calculationTemplate = `{attack} + {passiveAttack} × {weaponModifier} ≈ ${stats.totalAttack}`;
		}

		return attackCalc;
	}

	private getAttackPotential(stats: StatsModel): StatDetailModel {
		const attackPotentialCalc: StatDetailModel = {
			name: 'Attack Potential',
			value: stats.totalAttackPotential,
			calculationVariables: [
				{
					displayName: 'Base Weapon Attack',
					name: 'attack',
					value: stats.attack,
					colorClass: 'green'
				},
				{
					displayName: 'Physical Sharpness Modifier',
					name: 'sharpnessModifier',
					value: stats.effectivePhysicalSharpnessModifier,
					colorClass: 'blue'
				},
				{
					displayName: 'Passive Attack',
					name: 'passiveAttack',
					value: stats.passiveAttack,
					colorClass: 'orange'
				},
				{
					displayName: 'Active Attack',
					name: 'activeAttack',
					value: stats.activeAttack,
					colorClass: 'red'
				},
				{
					displayName: 'Active Attack Percent',
					name: 'activeAttackPercent',
					value: stats.activeAttackPercent / 100,
					colorClass: 'red'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier,
					colorClass: 'purple'
				}
			]
		};

		if (stats.elementlessBoostPercent > 0 && stats.totalAilmentAttack == 0 && stats.totalElementAttack == 0) {
			attackPotentialCalc.calculationTemplate = `{attack} × (1 + {elementlessBoostPercent} + {activeAttackPercent}) × {sharpnessModifier} + ({passiveAttack} + {activeAttack}) × {weaponModifier} ≈ ${stats.totalAttackPotential}`;
			attackPotentialCalc.calculationVariables.push(this.getElementlessVariable(stats));
		} else {
			attackPotentialCalc.calculationTemplate = `{attack} × (1 + {activeAttackPercent}) × {sharpnessModifier} + ({passiveAttack} + {activeAttack}) × {weaponModifier} ≈ ${stats.totalAttackPotential}`;
		}

		return attackPotentialCalc;
	}

	private getElementlessVariable(stats: StatsModel): CalculationVariableModel {
		return {
			displayName: 'Elementless Boost Modifier',
			name: 'elementlessBoostPercent',
			value: stats.elementlessBoostPercent / 100,
			colorClass: 'kakhi'
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
		const ailmentAttackCalc: StatDetailModel = {
			name: 'Ailment Attack',
			value: stats.totalAilmentAttack,
			valueColor: ailmentCalc.color,
			icon: stats.ailment.toLowerCase() + (stats.effectiveAilmentAttack == 0 ? '-gray' : ''),
			color: ailmentCalc.color,
			info: ailmentCalc.info,
			calculationVariables: [
				{
					displayName: 'Weapon Base Ailment Attack',
					name: 'base',
					value: stats.baseAilmentAttack,
					colorClass: 'blue'
				},
				{
					displayName: 'Passive Ailment Buildup Percent',
					name: 'passiveBuildup',
					value: stats.effectivePassiveAilmentBuildupPercent / 100,
					colorClass: 'green'
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
				ailmentAttackCalc.calculationTemplate = `({base} × {multiplier} (1 + {passiveBuildup} + {activeBuildup}) + {passive} + {active} ≈ ${stats.totalAilmentAttackPotential}`;
			} else {
				ailmentAttackCalc.calculationTemplate = `({base} × (1 + {passiveBuildup} + {activeBuildup}) + {passive} + {active}) × {multiplier} ≈ ${stats.totalAilmentAttackPotential}`;
			}
		} else {
			ailmentAttackCalc.calculationTemplate = `{base} × (1 + {passiveBuildup} + {activeBuildup}) + {passive} + {active} ≈ ${stats.totalAilmentAttackPotential}`;
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
		const elementAttackCalc: StatDetailModel = {
			name: 'Elment Attack',
			value: stats.totalElementAttack,
			valueColor: elementCalc.color,
			icon: stats.element.toLowerCase() + (stats.effectiveElementAttack == 0 ? '-gray' : ''),
			color: elementCalc.color,
			info: elementCalc.info,
			calculationVariables: [
				{
					displayName: 'Weapon Base Element Attack',
					name: 'base',
					value: stats.baseElementAttack,
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
				colorClass: 'blue'
			});

			if (stats.elementAttackMultiplier) {
				elementAttackCalc.calculationTemplate = `{base} × {multiplier} + {passive} + {active} ≈ ${stats.totalElementAttackPotential}`;
			} else {
				elementAttackCalc.calculationTemplate = `({base} + {passive} + {active}) × {multiplier} ≈ ${stats.totalElementAttackPotential}`;
			}
		} else {
			elementAttackCalc.calculationTemplate = `{base} + {passive} + {active} = ${stats.totalElementAttackPotential}`;
		}

		return elementAttackCalc;
	}

	private getElderseal(stats: StatsModel): StatDetailModel {
		return {
			name: 'Elderseal',
			value: stats.elderseal
		};
	}

	private getHealOnHitPercent(stats: StatsModel): StatDetailModel {
		return {
			name: 'Heal on Hit',
			value: stats.healOnHitPercent + '%'
		};
	}

	private getRawAttackAverage(stats: StatsModel): StatDetailModel {
		const totalAffinity = Math.min(stats.affinity + stats.passiveAffinity, 100);
		const rawAttackAvg =
			this.getRawAverage(
				stats.totalAttack,
				totalAffinity,
				stats.passiveCriticalBoostPercent,
				stats.weaponAttackModifier);
		const auxDivider = stats.totalAilmentAttack && stats.totalElementAttack ? 2 : 1;

		const trueElement =
			this.getElementAverage(
				stats.totalElementAttack,
				0,
				0,
				1,
				auxDivider);

		const trueAilment =
			this.getAilmentAverage(
				stats.totalAilmentAttack,
				0,
				0,
				1,
				auxDivider
			);

		const rawAttackAvgCalc: StatDetailModel = {
			name: 'True Raw Average',
			value: Number.isInteger(rawAttackAvg) ? rawAttackAvg : 0,
			extra1: stats.ailment ? trueAilment : null,
			class1: stats.ailment ? stats.ailment : null,
			extra2: stats.element ? trueElement : null,
			class2: stats.element ? stats.element : null,
			calculationTemplate: `({totalAttack} × {totalAffinity} × {criticalBoost} + {totalAttack} × (100% - {totalAffinity})) <br>÷ {weaponModifier} <br>=<br> [${rawAttackAvg}`,
			calculationVariables: [
				{
					displayName: 'Total Attack',
					name: 'totalAttack',
					value: stats.totalAttack,
					colorClass: 'green'
				},
				{
					displayName: 'Total Affinity',
					name: 'totalAffinity',
					value: totalAffinity,
					colorClass: 'blue'
				},
				{
					displayName: 'Total Critical Boost',
					name: 'criticalBoost',
					value: (stats.passiveCriticalBoostPercent + 125) + '%',
					colorClass: 'kakhi'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier,
					colorClass: 'purple'
				}
			]
		};

		rawAttackAvgCalc.calculationTemplate += ']';
		rawAttackAvgCalc.calculationVariables[1].value += '%';

		return rawAttackAvgCalc;
	}

	private getRawAttackAveragePotential(stats: StatsModel): StatDetailModel {
		const totalAffinityPotential = Math.min(stats.affinity + stats.passiveAffinity + stats.weakPointAffinity + stats.activeAffinity, 100);
		const rawAttackAveragePotential =
			this.getRawAverage(
				stats.totalAttackPotential,
				totalAffinityPotential,
				stats.passiveCriticalBoostPercent,
				stats.weaponAttackModifier);
		const auxDivider = (stats.ailment && stats.element) ? 2 : 1;

		let elementAffinity = totalAffinityPotential;
		let criticalElementModifier = 0;
		if (stats.trueCriticalElement) {
			criticalElementModifier = stats.trueCritElementModifier;
		} else if (stats.criticalElement) {
			criticalElementModifier = stats.critElementModifier;
		} else {
			elementAffinity = 0;
		}
		const trueElementPotential = this.getElementAverage(
			stats.totalElementAttackPotential,
			Math.max(elementAffinity, 0),
			criticalElementModifier,
			stats.effectiveElementalSharpnessModifier,
			auxDivider);

		let ailmentAffinity = totalAffinityPotential;
		let criticalStatusModifier = 0;
		if (stats.trueCriticalStatus) {
			criticalStatusModifier = stats.trueCritStatusModifier;
		} else if (stats.criticalStatus) {
			criticalStatusModifier = stats.critStatusModifier;
		} else {
			ailmentAffinity = 0;
		}
		const trueAilmentPotential =
			this.getAilmentAverage(
				stats.totalAilmentAttackPotential,
				Math.max(ailmentAffinity, 0),
				criticalStatusModifier,
				stats.effectiveElementalSharpnessModifier,
				auxDivider
			);

		const rawAttackAveragePotentialCalc: StatDetailModel = {
			name: 'True Raw Average Potential',
			value: Number.isInteger(rawAttackAveragePotential) ? rawAttackAveragePotential : 0,
			extra1: stats.ailment ? trueAilmentPotential : null,
			class1: stats.ailment ? stats.ailment : null,
			extra2: stats.element ? trueElementPotential : null,
			class2: stats.element ? stats.element : null,
			calculationTemplate:
				`({totalAttackPotential} × {totalAffinityPotential} × {criticalBoost} + {totalAttackPotential} × (100% - {totalAffinityPotential})) <br>÷ {weaponModifier} <br>=<br> [${rawAttackAveragePotential}`,
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
					value: totalAffinityPotential,
					colorClass: 'blue'
				},
				{
					displayName: 'Total Critical Boost',
					name: 'criticalBoost',
					value: stats.passiveCriticalBoostPercent + 125 + '%',
					colorClass: 'kakhi'
				},
				{
					displayName: 'Weapon Modifier',
					name: 'weaponModifier',
					value: stats.weaponAttackModifier,
					colorClass: 'purple'
				}
			]
		};

		rawAttackAveragePotentialCalc.calculationTemplate += ']';
		rawAttackAveragePotentialCalc.calculationVariables[1].value += '%';

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
		const elementWithAffinity = attack * (Math.min(affinity, 100) / 100) * (Math.min(affinity, 100) > 0 ? criticalModifier : 1);
		const elementWithoutAffinity = attack * (1 - Math.min(affinity, 100) / 100);
		return Math.round((elementWithAffinity + elementWithoutAffinity) * sharpnessModifier / 10 / (auxDivider ? auxDivider : 1));
	}
}

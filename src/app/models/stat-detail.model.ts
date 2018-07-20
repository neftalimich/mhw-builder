import { CalculationVariableModel } from './calculation-variable.model';

export class StatDetailModel {
	name: string;
	value: string | number;
	info?: string[];
	calculationTemplate?: string;
	calculationVariables?: CalculationVariableModel[];
	color?: string;
}


import { CalculationVariableModel } from './calculation-variable.model';

export class StatDetailModel {
	name: string;
	value: string | number;
	valueColor?: string;
	info?: string[];
	calculationTemplate?: string;
	calculationVariables?: CalculationVariableModel[];
	color?: string;
	extra1?: string | number;
	extra2?: string | number;
	class1?: string;
	class2?: string;
}


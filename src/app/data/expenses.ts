import { Patients } from './patients';

export class Expenses {	
	expenseFor: {
			_id: String
			patientFirstName: String,
			patientLastName: String
		};
	dateOfEntry: Date;
	expenseDate: Date;
	description: String;
	expenseCategory: String;
	amount: number;
	_id: String;
}
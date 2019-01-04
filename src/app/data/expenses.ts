import { Patients } from './patients';

export class Expenses {	
	expenseFor: {
			_id: String,
			addmissionNo: number,
			patientFirstName: String,
			patientLastName: String
		};
	dateOfEntry: Date;
	expenseDate: Date;
	description: String;
	expenseCategory: String;
	expenseSource: String;
	amount: number;
	_id: String;
}
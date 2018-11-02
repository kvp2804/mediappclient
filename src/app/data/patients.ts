export class Patients {
	addmissionNo: String;
	patientFirstName:String;		
  	patientMiddleName: String;
	patientLastName: String;
	address: String;
	contactPerson: String;
	contactPersonNumber: String;
	dateOfBirth: Date;	
	_id: String;
	patientAddmissionStatus: [{
			status: { type: String, default: 'Admitted' },
			dateOfStatusChange: Date
		}];	
	
}



	


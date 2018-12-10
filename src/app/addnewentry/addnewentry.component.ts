import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, NgForm} from '@angular/forms';
import { PatientsService } from '../services/patients.service'
import { Patients, PatientAddmissionStatus } from '../data/patients';
import { StatusCategories } from './statuscategories';



@Component({
  selector: 'app-addnewentry',
  templateUrl: './addnewentry.component.html',
  styleUrls: ['./addnewentry.component.css']
})
export class AddnewentryComponent implements OnInit {

  @Output() editPatientDialogEvent = new EventEmitter<string>();
  @Input() patientToEdit: Patients;
  isExpanded: boolean = false;
  displayedStatusColumns: string[] = ['status', 'dateOfStatusChange'];


	patientInformation: FormGroup;
   statusCategories: StatusCategories[] = [
      {category: 'Admitted'},
      {category: 'Discharged'}
    ];

  	/*patientFirstName: String;
  	patientMiddleName: String;
	patientLastName: String;
	address: String;
	contactPerson: String;
	contactPersonNumber: String;
	dateOfBirth: Date;*/



  	/*newPatient.patientFirstName = this.patientFirstName;
  	newPatient.patientMiddleName = this.patientMiddleName;
  	newPatient.patientLastName = this.patientLastName;
  	newPatient.address = this.address;
  	newPatient.*/



  constructor(private fb: FormBuilder, private patientService: PatientsService) {
  		this.patientInformation = fb.group({
		  	addmissionNo:[null, Validators.required],
        patientFirstName:[null, Validators.required],
		  	patientMiddleName: [null, Validators.required],
			  patientLastName: [null, Validators.required],
			  address: [null, Validators.required],
			  contactPerson: [null, Validators.required],
			  contactPersonNumber: [null, Validators.required],
			  dateOfBirth: [null, Validators.required],
        status: [null, Validators.required],
        dateOfStatusChange: [null, Validators.required]
		});
   }

  ngOnInit() {
    if(this.patientToEdit){
      let statusLength : number =  this.patientToEdit.patientAddmissionStatus.length;
      this.patientInformation.patchValue({
        addmissionNo: this.patientToEdit.addmissionNo  ,
        patientFirstName: this.patientToEdit.patientFirstName,
        patientMiddleName: this.patientToEdit.patientMiddleName,
        patientLastName: this.patientToEdit.patientLastName,
        address: this.patientToEdit.address,
        contactPerson: this.patientToEdit.contactPerson,
        contactPersonNumber: this.patientToEdit.contactPersonNumber,
        dateOfBirth: this.patientToEdit.dateOfBirth,
        status: this.patientToEdit.patientAddmissionStatus[statusLength - 1].status,
        dateOfStatusChange: this.patientToEdit.patientAddmissionStatus[statusLength - 1].dateOfStatusChange
      });
      this.isExpanded= true;
    }
   }

  onFormSubmit()
  {
  	var newPatient = new Patients();
  	newPatient.addmissionNo = this.patientInformation.get('addmissionNo').value;
    newPatient.patientFirstName = this.patientInformation.get('patientFirstName').value;
  	newPatient.patientMiddleName = this.patientInformation.get('patientMiddleName').value;
  	newPatient.patientLastName = this.patientInformation.get('patientLastName').value;
  	newPatient.address = this.patientInformation.get('address').value;
  	newPatient.contactPerson= this.patientInformation.get('contactPerson').value;
  	newPatient.contactPersonNumber = this.patientInformation.get('contactPersonNumber').value;
  	newPatient.dateOfBirth = this.patientInformation.get('dateOfBirth').value;
    console.log( this.patientInformation.get('status').value);
    var newPatient = new Patients();
    newPatient.addmissionNo = this.patientInformation.get('addmissionNo').value;
    newPatient.patientFirstName = this.patientInformation.get('patientFirstName').value;
    newPatient.patientMiddleName = this.patientInformation.get('patientMiddleName').value;
    newPatient.patientLastName = this.patientInformation.get('patientLastName').value;
    newPatient.address = this.patientInformation.get('address').value;
    newPatient.contactPerson= this.patientInformation.get('contactPerson').value;
    newPatient.contactPersonNumber = this.patientInformation.get('contactPersonNumber').value;
    newPatient.dateOfBirth = this.patientInformation.get('dateOfBirth').value;
    //console.log( this.patientInformation.get('status').value);

    let patientStatus: PatientAddmissionStatus = {
          status: this.patientInformation.get('status').value,
          dateOfStatusChange: this.patientInformation.get('dateOfStatusChange').value
        };

    newPatient.patientAddmissionStatus = [];
    newPatient.patientAddmissionStatus.push( patientStatus );


    this.patientService.addPatient( newPatient ).subscribe(patients => newPatient = patients);
    console.log('Before');

    this.patientInformation.reset();
    console.log('After');
  }


  onUpdate( patient ){

    var newPatient = new Patients();
  	newPatient.addmissionNo = this.patientInformation.get('addmissionNo').value;
    newPatient.patientFirstName = this.patientInformation.get('patientFirstName').value;
  	newPatient.patientMiddleName = this.patientInformation.get('patientMiddleName').value;
  	newPatient.patientLastName = this.patientInformation.get('patientLastName').value;
  	newPatient.address = this.patientInformation.get('address').value;
  	newPatient.contactPerson= this.patientInformation.get('contactPerson').value;
  	newPatient.contactPersonNumber = this.patientInformation.get('contactPersonNumber').value;
    newPatient.dateOfBirth = this.patientInformation.get('dateOfBirth').value;

    if( !this.patientInformation.get('status').untouched )
    {
      let patientStatus: PatientAddmissionStatus = {
          status: this.patientInformation.get('status').value,
          dateOfStatusChange: this.patientInformation.get('dateOfStatusChange').value
        };

        newPatient.patientAddmissionStatus = [];
        newPatient.patientAddmissionStatus.push( patientStatus );
    }

    var patientId = this.patientToEdit._id;

    this.patientService.updatePatient( newPatient, patientId.toString() ).subscribe(val => {
      this.editPatientDialogEvent.next();
    });

  }


}

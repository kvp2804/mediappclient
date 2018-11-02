import { Component, OnInit } from '@angular/core';
import { Patients } from '../data/patients';
import {PatientsService} from '../services/patients.service';

@Component({
  selector: 'app-searchpatients',
  templateUrl: './searchpatients.component.html',
  styleUrls: ['./searchpatients.component.css']
})
export class SearchpatientsComponent implements OnInit {

	displayedColumns: string[] = ['addmissionNo', 'patientFirstName', 'patientLastName', 'status', 'delete'];
	dataSource: Patients[];

  constructor( private patientService: PatientsService ) { }

  ngOnInit() {

  	//this.getPatientData();

  }

  getPatientData() {
  	console.log('In getPatients');
  	this.patientService.getPatients().subscribe(dataSource => this.dataSource = dataSource);
  } ;


  onRefresh() {
  	console.log('In onRefresh');
  	this.patientService.getPatients().subscribe(dataSource => this.dataSource = dataSource);    
  } ;

  onDelete( expenseID: string ){
    this.patientService.deletePatient( expenseID ).subscribe();       
  }

  onUpdate( patient ){
    var newPatient = new Patients();    
    newPatient.patientFirstName = patient.patientFirstName; 
    newPatient.patientMiddleName = patient.patientMiddleName;
    newPatient.patientLastName = patient.patientLastName;
    newPatient.address = patient.address;
    newPatient.contactPerson= patient.contactPerson;
    newPatient.contactPersonNumber = patient.contactPersonNumber;
    newPatient.dateOfBirth = patient.dateOfBirth;
    
    //Get the data for this patient
    for(var i = 0; i<this.dataSource.length; i++)
    {
       var value = this.dataSource[i]._id
       if( value == patient._id )
       {
         /*if( patient.status != this.dataSource[i].status )
         {
             newPatient.status = patient.status;
             newPatient.dateOfStatusChange = patient.dateOfStatusChange;             
         }*/
         break;
       }
    }
    this.patientService.updatePatient( newPatient, patient._id ).subscribe();       
  }  

}

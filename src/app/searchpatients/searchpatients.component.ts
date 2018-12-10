import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { Patients, PatientAddmissionStatus } from '../data/patients';
import {PatientsService} from '../services/patients.service';
import {EditpatientdialogComponent} from "../editpatientdialog/editpatientdialog.component";

@Component({
  selector: 'app-searchpatients',
  templateUrl: './searchpatients.component.html',
  styleUrls: ['./searchpatients.component.css']
})
export class SearchpatientsComponent implements OnInit {

	displayedColumns: string[] = ['addmissionNo', 'patientFirstName', 'patientLastName', 'status', 'delete'];
	dataSource: Patients[];// = [];
  dataSourcePatientStatus: PatientAddmissionStatus[];// = [];


  constructor( private patientService: PatientsService, private dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef ) { }

  ngOnInit() {

  	//this.getPatientData();

  }

  getPatientData() {
  	console.log('In getPatients');
  	this.patientService.getPatients().subscribe(dataSource => this.dataSource = dataSource);
  } ;


  onRefresh() {
  	console.log('In onRefresh');
    this.patientService.getPatients().subscribe(dataSource => {
      this.dataSource = dataSource;
      this.changeDetectorRefs.detectChanges();
      console.log(this.dataSource);
    });




   //this.patientService.getPatients().subscribe(patients => this.populatePatientsdata(patients));

  } ;

  populatePatientsdata(patients: Patients[]){

    for(var i = 0; i<patients.length; i++) {


       let patient: Patients = {
        addmissionNo: patients[i].addmissionNo,
        patientFirstName:patients[i].patientFirstName,
        patientMiddleName: patients[i].patientMiddleName,
        patientLastName: patients[i].patientLastName,
        address: patients[i].address,
        contactPerson: patients[i].contactPerson,
        contactPersonNumber: patients[i].contactPersonNumber,
        dateOfBirth: patients[i].dateOfBirth,
        _id: patients[i]._id,
        patientAddmissionStatus: patients[i].patientAddmissionStatus

      };

      this.dataSource.push( patient );

      };

      //this.expensors.push( expensor );
      //console.log("Patient ID = " + this.expensors[i].value);
      //console.log("Name = " + this.expensors[i].displayValue);


  };


  onDelete( expenseID: string ){
    this.patientService.deletePatient( expenseID ).subscribe();
  }

  onUpdate( patient ){

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      patient: patient
    };



    const dialogRef = this.dialog.open(EditpatientdialogComponent,
        dialogConfig);


    dialogRef.afterClosed().subscribe(
        val => {
          //console.log("Dialog output:", val);
      //for(var i =0 ; i<this.dataSource.length; i++) {
//if(val._id === this.dataSource[i]._id) {
  //this.dataSource[i] = val;
  //break;
//}
     // }
     this.onRefresh();
    }


    );

  }

}

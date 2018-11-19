import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { Patients } from '../data/patients';
import {PatientsService} from '../services/patients.service';
import {EditpatientdialogComponent} from "../editpatientdialog/editpatientdialog.component";

@Component({
  selector: 'app-searchpatients',
  templateUrl: './searchpatients.component.html',
  styleUrls: ['./searchpatients.component.css']
})
export class SearchpatientsComponent implements OnInit {

	displayedColumns: string[] = ['addmissionNo', 'patientFirstName', 'patientLastName', 'status', 'delete'];
	dataSource: Patients[];

  constructor( private patientService: PatientsService, private dialog: MatDialog ) { }

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
          console.log("Dialog output:", val);
      for(var i =0 ; i<this.dataSource.length; i++) {
if(val._id === this.dataSource[i]._id) {
  this.dataSource[i] = val;
  break;
}
      }}


    );

  }

}

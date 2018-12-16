import { Component, OnInit, ChangeDetectorRef, ViewChild  } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { Patients, PatientAddmissionStatus } from '../data/patients';
import {PatientsService} from '../services/patients.service';
import {EditpatientdialogComponent} from "../editpatientdialog/editpatientdialog.component";
import * as XLSX from 'xlsx';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-searchpatients',
  templateUrl: './searchpatients.component.html',
  styleUrls: ['./searchpatients.component.css']
})
export class SearchpatientsComponent implements OnInit {

	displayedColumns: string[] = ['addmissionNo', 'patientFirstName', 'patientLastName', 'status', 'contactPerson', 'contactPersonNumber','dateOfBirth','delete'];
  displayedColumnsToTableHeaderMapping = {
    'addmissionNo':'Admission Number',
    'patientFirstName':'Patient First Name',
    'patientLastName':'Patient Last Name',    
    'status':'Status',
    'contactPerson':'Contact Person',
    'contactPersonNumber':'Contact Person Number',
    'dateOfBirth':'Date Of Birth'
    };
  dataSourceFromServer: Patients[];  
	//dataSource: Patients[];// = [];
  dataSourcePatientStatus: PatientAddmissionStatus[];// = [];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  dataSource = new MatTableDataSource(this.dataSourceFromServer);
  @ViewChild(MatSort) sort: MatSort;


  constructor( private patientService: PatientsService, private dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef ) { }

  ngOnInit() {

  	//this.getPatientData();

  }

  /*getPatientData() {
  	console.log('In getPatients');
  	this.patientService.getPatients().subscribe(dataSource => this.dataSource = dataSource);
  } ;*/


  /*onRefresh() {
  	console.log('In onRefresh');
    this.patientService.getPatients().subscribe(dataSource => {
      this.dataSource = dataSource;
      this.changeDetectorRefs.detectChanges();
      console.log(this.dataSource);
    });*/

  onRefresh() {
    console.log('In onRefresh');
    this.patientService.getPatients().subscribe( dataSourceTemp => this.populatePatientsdata( dataSourceTemp ));




   //this.patientService.getPatients().subscribe(patients => this.populatePatientsdata(patients));

  } ;

  populatePatientsdata(patients: Patients[]){

    this.dataSourceFromServer = [];

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

      this.dataSourceFromServer.push( patient );

      };

      //this.expensors.push( expensor );
      //console.log("Patient ID = " + this.expensors[i].value);
      //console.log("Name = " + this.expensors[i].displayValue);
      this.dataSource = new MatTableDataSource(this.dataSourceFromServer);
      this.dataSource.sort = this.sort;


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

  exportToExcel() {
      this.export("expenses");
   }


   export(excelFileName: string) {
    var excelOutputJson = [];
    for(var i = 0; i< this.dataSourceFromServer.length; i++){
      var data=this.dataSourceFromServer[i];
      var output={};
      for(var j = 0; j < this.displayedColumns.length; j++){
        if (this.displayedColumns[j] !== "delete") {
          var actualColumnHeader = this.displayedColumnsToTableHeaderMapping[this.displayedColumns[j]];
          output[actualColumnHeader] = data[this.displayedColumns[j]];
        }
      }
      excelOutputJson.push(output);
    }
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelOutputJson);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, excelFileName + '_report_' + new Date().getTime() + this.EXCEL_EXTENSION);

  }

}

import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { Patients } from '../data/patients';

@Component({
  selector: 'app-editpatientdialog',
  templateUrl: './editpatientdialog.component.html',
  styleUrls: ['./editpatientdialog.component.css']
})
export class EditpatientdialogComponent implements OnInit {

  patientData : Patients;

  constructor( private dialogRef: MatDialogRef<EditpatientdialogComponent>,@Inject(MAT_DIALOG_DATA) data) {
    this.patientData = data.patient;
   }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(this.patientData);
}

}

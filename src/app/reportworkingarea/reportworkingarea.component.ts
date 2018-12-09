import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Transactors } from './transactors';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Income } from '../data/income';
import { Expenses } from '../data/expenses';
import { PatientLedger } from '../data/patientLedger';
import { PatientsService } from '../services/patients.service';
import { IncomeService } from '../services/income.service';
import { ExpensesService } from '../services/expenses.service';
import { Patients } from '../data/patients';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportworkingarea',
  templateUrl: './reportworkingarea.component.html',
  styleUrls: ['./reportworkingarea.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportworkingareaComponent implements OnInit {

	transactors : Transactors[] = [];
	generateReportForm: FormGroup;

	incomedataSource: Income[] = [];
  	expensedataSource: Expenses[] = [];
  	dataSource: PatientLedger[] = [];
  	EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  	EXCEL_EXTENSION = '.xlsx';

  	displayedColumns: string[] = ['expenseDate', 'expenseCategory', 'expenseAmount', 'incomeDate', 'incomeCategory', 'incomeAmount'];

  constructor(private fb: FormBuilder, private patientService: PatientsService, private incomeService: IncomeService, private expensesService: ExpensesService) { 
  	this.generateReportForm = fb.group({
      searchPatientId:[null],
      searchStartDate: [null],
      searchEndDate: [null]
	})


  }

  ngOnInit() {
  	this.getPatientData();
  }

  getPatientData() {
    console.log('In getPatients');
    this.patientService.getPatients().subscribe(patients => this.populateInTransactordata(patients));
  };

  populateInTransactordata(patients: Patients[]){

    for(var i = 0; i<patients.length; i++) {

      let transactor: Transactors = {        
        value: patients[i]._id,
        displayValue: patients[i].patientFirstName + " " + patients[i].patientLastName
      };

      this.transactors.push( transactor );
      console.log("Patient ID = " + this.transactors[i].value);
      console.log("Name = " + this.transactors[i].displayValue);

    }
  };


  onGenerateReport() {

  	console.log("In the report section")
  	this.dataSource = [];

  	//End date should be selected one or today's date 
  	var searchByEndDate = null;  	

  	if( this.generateReportForm.get('searchEndDate').value != null )
  	{
  		searchByEndDate = this.generateReportForm.get('searchEndDate').value;
  	}
  	else
  	{
  		searchByEndDate = Date.now();
  	}
  	
  	//Patient selection is mandatory
  	if( this.generateReportForm.get('searchPatientId').value != null )
  	{
  		
  		//Get the income details of the selected patient.
  		this.incomeService.getIncomebyDateForSpecificpatient(this.generateReportForm.get('searchPatientId').value, this.generateReportForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(incomedataSource => this.incomedataSource = incomedataSource);
        
  		//Get the income details of the selected patient.
  		this.expensesService.getExpensebyDateForSpecificpatient(this.generateReportForm.get('searchPatientId').value, this.generateReportForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(expensedataSource => this.expensedataSource = expensedataSource);
    }

    var counter: number = 0;
    var totalIncome: number = 0;
    var totalExpense: number = 0;
    while( true )
    {
    	var patientLedger:PatientLedger = new PatientLedger();
    	var dataProcessed:boolean = false;

    	if( this.incomedataSource[counter] != null )
    	{
    		dataProcessed = true;
    		patientLedger.incomeDate = this.incomedataSource[counter].incomeDate;
    		patientLedger.incomeCategory = this.incomedataSource[counter].incomeCategory;
    		patientLedger.incomeAmount = this.incomedataSource[counter].amount;
    		totalIncome = totalIncome + patientLedger.incomeAmount;
    	}

    	if( this.expensedataSource[counter] != null )
    	{
    		dataProcessed = true;
    		patientLedger.expenseDate = this.expensedataSource[counter].expenseDate;
    		patientLedger.expenseCategory = this.expensedataSource[counter].expenseCategory;
    		patientLedger.expenseAmount = this.expensedataSource[counter].amount;
    		totalExpense = totalExpense + patientLedger.expenseAmount;
    	}

    	

    	if( dataProcessed )
    	{
    		this.dataSource.push(patientLedger);
    		counter++;
    		continue;
    	}
    	else
    	{
    		var patientLedger:PatientLedger = new PatientLedger();
		    patientLedger.expenseCategory = 'Total Expense';
		    patientLedger.expenseAmount = totalExpense;
		    patientLedger.incomeCategory = 'Total Income';
		    patientLedger.incomeAmount = totalIncome;
		    this.dataSource.push(patientLedger);
    		break;
    	}    	
    }  	
 }

 exportToExcel() {
      this.export(this.dataSource, "export");
   }


   export(json: any[], excelFileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('expenseTable'));
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, excelFileName + '_income_' + new Date().getTime() + this.EXCEL_EXTENSION);

  }

}

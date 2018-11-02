import { Component, OnInit, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Patients } from '../../data/patients';
import { Expenses } from '../../data/expenses';
import { PatientsService } from '../../services/patients.service';
import { ExpensesService } from '../../services/expenses.service';
import { ExpenseCategories } from './expensecategories';
import {FormBuilder, FormGroup, Validators, FormControl, NgForm} from '@angular/forms';
import { Expensors } from './expensors';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-searchexpenses',
  templateUrl: './searchexpenses.component.html',
  styleUrls: ['./searchexpenses.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchexpensesComponent implements OnInit {

  expensors : Expensors[] = [];
  expenseSearchForm: FormGroup;
  expenses : Expenses[];
	displayedColumns: string[] = ['expenseDate', 'expenseFor', 'expenseCategory', 'amount', 'description', 'delete'];
	dataSource: Expenses[];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';


  categories: ExpenseCategories[] = [  
      {category: 'Cash Advances'},
      {category: 'Medicines'},
      {category: 'Meals and snacks'},
      {category: 'Household'}
    ];

  constructor( private fb: FormBuilder, private patientService: PatientsService, private expensesService: ExpensesService ) { 
    this.expenseSearchForm = fb.group({
      searchPatientId:[null],
      searchStartDate: [null],
      searchEndDate: [null]
   })

  };

  ngOnInit() {
  		//this.getExpensesData();
      this.getPatientData();
  }

  getPatientData() {
    console.log('In getPatients');
    this.patientService.getPatients().subscribe(patients => this.populateExpensordata(patients));
  };


  populateExpensordata(patients: Patients[]){

    for(var i = 0; i<patients.length; i++) {

      let expensor: Expensors = {        
        value: patients[i]._id,
        displayValue: patients[i].patientFirstName + " " + patients[i].patientLastName
      };

      this.expensors.push( expensor );
      console.log("Patient ID = " + this.expensors[i].value);
      console.log("Name = " + this.expensors[i].displayValue);

    }
  };

  getExpensesData() {
  	console.log('In getExpensesData');
  	this.expensesService.getExpenses().subscribe(dataSource => this.dataSource = dataSource);
  	console.log(this.dataSource);
  } ;

  onRefresh() {
  	console.log('In onRefresh');
  	this.expensesService.getExpenses().subscribe(dataSource => this.dataSource = dataSource);
  } ;

  onDelete( expenseID: string ){
  	this.expensesService.deleteExpense( expenseID ).subscribe();       
  }

  onUpdate( expense ){
    var newExpense = new Expenses();    
    newExpense.description = expense.description;
    newExpense.amount= expense.amount;
    newExpense.expenseCategory = expense.expenseCategory;
    this.expensesService.updateExpense( newExpense, expense._id ).subscribe();       
  }

  onExpenseSearch() {
    var whichServiceToExecute = new String();
    var searchByEndDate = this.expenseSearchForm.get('searchEndDate').value;

    if( this.expenseSearchForm.get('searchPatientId').value == null )
    {
      if( this.expenseSearchForm.get('searchStartDate').value == null )
      {
        whichServiceToExecute = 'NoExecution';
      }
      else
      {
        if( this.expenseSearchForm.get('searchEndDate').value == null )
        {
          searchByEndDate = Date.now();
        }
        whichServiceToExecute = 'SearchExpenseForAllPatientsSpecificDates';
      }
    }
    else
    {
      if( this.expenseSearchForm.get('searchStartDate').value == null )
      {
        whichServiceToExecute = 'SearchExpenseByPatientAllDates';
      }
      else
      {
        if( this.expenseSearchForm.get('searchEndDate').value == null )
        {
          searchByEndDate = Date.now();
        }

        whichServiceToExecute = 'SearchExpenseByPatientSpecificDates';
      }
    } 
    
    if( whichServiceToExecute === "SearchExpenseByPatientSpecificDates" )
    {
      this.expensesService.getExpensebyDateForSpecificpatient(this.expenseSearchForm.get('searchPatientId').value, this.expenseSearchForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(dataSource => this.dataSource = dataSource);
    }
    else if( whichServiceToExecute === "SearchExpenseByPatientAllDates")
    {
      this.expensesService.getExpenseBySpecificPatient(this.expenseSearchForm.get('searchPatientId').value)
        .subscribe(dataSource => this.dataSource = dataSource);
    }
    else if( whichServiceToExecute === "SearchExpenseForAllPatientsSpecificDates")
    {
      this.expensesService.getExpensebyDateForAllPatient(this.expenseSearchForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(dataSource => this.dataSource = dataSource);
    }
 }

  exportToExcel() {
      this.export(this.expenses, "expenses");
   }


   export(json: any[], excelFileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('expenseTable'));
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, excelFileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);

  }

}

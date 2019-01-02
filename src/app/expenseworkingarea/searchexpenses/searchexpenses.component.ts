import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Patients } from '../../data/patients';
import { Expenses } from '../../data/expenses';
import { PatientsService } from '../../services/patients.service';
import { ExpensesService } from '../../services/expenses.service';
import { ExpenseCategories, ExpenseSource } from './expensecategories';
import {FormBuilder, FormGroup, Validators, FormControl, NgForm} from '@angular/forms';
import { Expensors } from './expensors';
import * as XLSX from 'xlsx';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSort, MatTableDataSource} from '@angular/material';
import {ExpensesForView} from './expenseforview';


@Component({
  selector: 'app-searchexpenses',
  templateUrl: './searchexpenses.component.html',
  styleUrls: ['./searchexpenses.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchexpensesComponent implements OnInit {
  expensorSelectControl = new FormControl();
  expensors : Expensors[] = [];
  expenseSearchForm: FormGroup;
  expenses : Expenses[];
	displayedColumns: string[] = ['expenseDate', 'expenseFor', 'expenseCategory', 'expenseSource', 'amount', 'description', 'delete'];
  displayedColumnsToTableHeaderMapping = {
    'expenseDate':'Expense Date',
    'expenseFor':'Patient Name',
    'expenseCategory':'Expense Category',
    'expenseSource':'Expense Source',
    'amount':'Amount',
    'description':'Description'
    };
	dataSourceFromServer: Expenses[];
  dataSourceRaw: ExpensesForView[];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  dataSource = new MatTableDataSource(this.dataSourceRaw);
  @ViewChild(MatSort) sort: MatSort;
  filteredExpensorOptions: Observable<Expensors[]>;

  categories: ExpenseCategories[] = [
      {category: 'Cash Advances'},
      {category: 'Medicines'},
      {category: 'Meals and snacks'},
      {category: 'Fees'},
      {category: 'Inventory'},
      {category: 'MISC'}
    ];

   sources: ExpenseSource[] = [
      { source: 'Peti Cash' },
      { source: 'Cash' },
      { source: 'Journal Entries' },
      { source: 'Bank Transfer' }
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

      this.filteredExpensorOptions = this.expensorSelectControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  AutoCompleteDisplay(expensor: any): string {
    if (expensor == undefined) { return }
    return expensor.displayValue;
  }

  private _filter(value: string): Expensors[] {
    if (typeof value === "string") {
      const filterValue = value.toLowerCase();
      return this.expensors.filter(function(el) {
        return el.displayValue.toLowerCase().includes(filterValue);
    });
    }

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

  /*getExpensesData() {
  	console.log('In getExpensesData');
  	this.expensesService.getExpenses().subscribe(dataSource => this.dataSource = dataSource);
  	console.log(this.dataSource);
  } ;*/

  onRefresh() {
  	console.log('In onRefresh');
  	this.expensesService.getExpenses().subscribe(dataSourceFromServer => this.populateExpenseData( dataSourceFromServer ));
  } ;

  populateExpenseData(expensesFromServer: Expenses[]){

    console.log( expensesFromServer );

    this.dataSourceRaw = [];
    for(var i = 0; i<expensesFromServer.length; i++) {

        //patient name can be null
        var patientName;
        if( expensesFromServer[i].expenseFor == null )
        {
          patientName = "";
        }
        else
        {
           patientName = expensesFromServer[i].expenseFor.patientFirstName + " " + expensesFromServer[i].expenseFor.patientLastName
        }

      this.dataSourceRaw[i] = {
          expenseFor: patientName,
          dateOfEntry: expensesFromServer[i].dateOfEntry,
          expenseDate: expensesFromServer[i].expenseDate,
          description: expensesFromServer[i].description,
          expenseCategory: expensesFromServer[i].expenseCategory,
          expenseSource: expensesFromServer[i].expenseSource,
          amount: expensesFromServer[i].amount,
          _id: expensesFromServer[i]._id
      }
    }

    this.dataSource = new MatTableDataSource(this.dataSourceRaw);
    this.dataSource.sort = this.sort;

    console.log(JSON.stringify(this.dataSourceRaw));
    console.log(this.dataSource);

  };

  onDelete( expenseID: string ){
  	this.expensesService.deleteExpense( expenseID ).subscribe();
  }

  onUpdate( expense ){
    var newExpense = new Expenses();
    newExpense.description = expense.description;
    newExpense.amount= expense.amount;
    newExpense.expenseCategory = expense.expenseCategory;
    newExpense.expenseSource = expense.expenseSource;
    newExpense.expenseSource = expense.expenseSource;
    this.expensesService.updateExpense( newExpense, expense._id ).subscribe();
  }

  onExpenseSearch() {
    var whichServiceToExecute = new String();
    var searchByEndDate = this.expenseSearchForm.get('searchEndDate').value;
    var expensor = this.expensorSelectControl.value;

    if( expensor == null || expensor == "" )
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
      this.expensesService.getExpensebyDateForSpecificpatient(expensor.value, this.expenseSearchForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(dataSourceFromServer => this.populateExpenseData( dataSourceFromServer ));
    }
    else if( whichServiceToExecute === "SearchExpenseByPatientAllDates")
    {
      this.expensesService.getExpenseBySpecificPatient(expensor.value)
        .subscribe(dataSourceFromServer => this.populateExpenseData( dataSourceFromServer ));
    }
    else if( whichServiceToExecute === "SearchExpenseForAllPatientsSpecificDates")
    {
      this.expensesService.getExpensebyDateForAllPatient(this.expenseSearchForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(dataSourceFromServer => this.populateExpenseData( dataSourceFromServer ));
    }
 }


  exportToExcel() {
      this.export("expenses");
   }


   export(excelFileName: string) {
    var excelOutputJson = [];
    for(var i = 0; i< this.dataSourceRaw.length; i++){
      var data=this.dataSourceRaw[i];
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
    XLSX.writeFile(workbook, excelFileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);

  }

}

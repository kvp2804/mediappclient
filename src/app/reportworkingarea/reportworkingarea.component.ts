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
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-reportworkingarea',
  templateUrl: './reportworkingarea.component.html',
  styleUrls: ['./reportworkingarea.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReportworkingareaComponent implements OnInit {

  transactorSelectControl = new FormControl();
	transactors : Transactors[] = [];
	generateReportForm: FormGroup;

	incomedataSource: Income[] = [];
  	expensedataSource: Expenses[] = [];
  	dataSource: PatientLedger[];
  	EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  	EXCEL_EXTENSION = '.xlsx';

    displayedColumns: string[] = ['expenseDate', 'expensePatientName', 'expenseCategory', 'expenseAmount', 'incomeDate', 'incomePatientName', 'incomeCategory', 'incomeAmount'];
    filteredTransactorOptions: Observable<Transactors[]>;

  constructor(private fb: FormBuilder, private patientService: PatientsService, private incomeService: IncomeService, private expensesService: ExpensesService) {
  	this.generateReportForm = fb.group({
      searchPatientId:[null],
      searchStartDate: [null],
      searchEndDate: [null]
	})


  }

  ngOnInit() {
    this.getPatientData();
    this.filteredTransactorOptions = this.transactorSelectControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  AutoCompleteDisplay(transactor: any): string {
    if (transactor == undefined) { return }
    return transactor.displayValue;
  }

  private _filter(value: string): Transactors[] {
    if (typeof value === "string") {
      const filterValue = value.toLowerCase();
      return this.transactors.filter(function(el) {
        return el.displayValue.toLowerCase().includes(filterValue);
    });
    }
  }

  getPatientData() {
    console.log('In getPatients');
    this.patientService.getPatients().subscribe(patients => this.populateInTransactordata(patients));
  };

  populateInTransactordata(patients: Patients[]){

    for(var i = 0; i<patients.length; i++) {

      let transactor: Transactors = {
        id: patients[i].addmissionNo,
        value: patients[i]._id,
        displayValue: patients[i].patientFirstName + " " + patients[i].patientLastName
      };

      this.transactors.push( transactor );
      console.log("Patient ID = " + this.transactors[i].value);
      console.log("Name = " + this.transactors[i].displayValue);

    }
  };


  onGenerateReport() {

  	console.log("In the report section");
        
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

    var transactor:Transactors = this.transactorSelectControl.value;

  	//Patient selection is mandatory
  	if( transactor != null )
  	{

      //Get the income details of the selected patient.
  		this.incomeService.getIncomebyDateForSpecificpatient(transactor.value.toString(), this.generateReportForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(incomedataSource => {
        	console.log("I am here 1");
        	this.incomedataSource = incomedataSource          
        });

  		//Get the income details of the selected patient.
  		this.expensesService.getExpensebyDateForSpecificpatient(transactor.value.toString(), this.generateReportForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(expensedataSource =>{
        	console.log("I am here 2");
        	this.expensedataSource = expensedataSource;
          if( transactor.id != "10000" && transactor.id != "10001")
          {
            this.processReportTableData();
          }
        });

      if( transactor.id == "10000")
      {
        this.incomeService.getIncomebyDateForAllPatient( this.generateReportForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(incomedataSource => {
          console.log("I am here 3");
          for(var i = 0; i<incomedataSource.length; i++) {
              
              console.log("This is the returned data: " + incomedataSource);              
              
              if( incomedataSource[i].incomeFor.addmissionNo != 10001 )
              {
                  this.incomedataSource.push(incomedataSource[i]);
                  console.log("Thisis the assigned data: " + incomedataSource);
              }             
              
            }

            
          
        });

        this.expensesService.getExpensebyDateForAllPatient( this.generateReportForm.get('searchStartDate').value, searchByEndDate )
          .subscribe(expensedataSource => {
            console.log("I am here 4");
            for(var i = 0; i<expensedataSource.length; i++) {
              if( expensedataSource[i].expenseSource != "Journal Entries")
              {
                this.expensedataSource.push(expensedataSource[i]);  
              }            
            }

            this.processReportTableData();
            console.log("I am here 3");
        });
      }
      else if( transactor.id == "10001" )
      {
          this.expensesService.getExpensebyDateForAllPatient( this.generateReportForm.get('searchStartDate').value, searchByEndDate )
          .subscribe(expensedataSource => {
            console.log("I am here 4");
            for(var i = 0; i<expensedataSource.length; i++) {
              if( expensedataSource[i].expenseSource == "Peti Cash")
              {
                this.expensedataSource.push(expensedataSource[i]);  
              }            
            }

            this.processReportTableData();
            console.log("I am here 3");
        });
      }
    }
 }

 exportToExcel() {
      this.export(this.dataSource, "export");
   }


   export(json: any[], excelFileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('expenseTable'));
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, excelFileName + '_report_' + new Date().getTime() + this.EXCEL_EXTENSION);

  }

  processReportTableData()
 {
         console.log("I am here 5");
        var counter: number = 0;
        var totalIncome: number = 0;
        var totalExpense: number = 0;
        this.dataSource = [];
        while( true )
        {
          var patientLedger:PatientLedger = new PatientLedger();
          var dataProcessed:boolean = false;

          if( this.incomedataSource[counter] != null )
          {
            console.log("In the report section")
            dataProcessed = true;
            patientLedger.incomeDate = this.incomedataSource[counter].incomeDate;            
            patientLedger.incomePatientName = this.incomedataSource[counter].incomeFor.patientFirstName + ' ' + this.incomedataSource[counter].incomeFor.patientLastName;
            patientLedger.incomeCategory = this.incomedataSource[counter].incomeCategory;
            patientLedger.incomeAmount = this.incomedataSource[counter].amount;
            totalIncome = totalIncome + patientLedger.incomeAmount;
          }

          if( this.expensedataSource[counter] != null )
          {
            console.log("In the report section")
            dataProcessed = true;
            patientLedger.expenseDate = this.expensedataSource[counter].expenseDate;
            patientLedger.expensePatientName = this.expensedataSource[counter].expenseFor.patientFirstName + ' ' + this.expensedataSource[counter].expenseFor.patientLastName;
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

            var patientLedgerBalance:PatientLedger = new PatientLedger();
            var balance = totalIncome - totalExpense
            patientLedgerBalance.incomeCategory = 'Difference (Income - Expense)';
            patientLedgerBalance.incomeAmount = balance;
            this.dataSource.push(patientLedgerBalance);
            break;
          }
        }
 }

}

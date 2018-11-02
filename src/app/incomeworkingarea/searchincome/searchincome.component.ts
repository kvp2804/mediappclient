import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Incomesors } from './incomesors';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Income } from '../../data/income';
import { IncomeCategories } from './incomecategories';
import { PatientsService } from '../../services/patients.service';
import { IncomeService } from '../../services/income.service';
import { Patients } from '../../data/patients';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-searchincome',
  templateUrl: './searchincome.component.html',
  styleUrls: ['./searchincome.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchincomeComponent implements OnInit {

  incomesors : Incomesors[] = [];
  incomeSearchForm: FormGroup;
  income : Income[];
	displayedColumns: string[] = ['incomeDate', 'incomeFor', 'incomeCategory', 'amount', 'description', 'delete'];
	dataSource: Income[];
	EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  	EXCEL_EXTENSION = '.xlsx';

  categories: IncomeCategories[] = [  
      {category: 'Cash Advances'},
      {category: 'Medicines'},
      {category: 'Meals and snacks'},
      {category: 'Household'}
    ];

  constructor( private fb: FormBuilder, private patientService: PatientsService, private incomeService: IncomeService ) { 
  	this.incomeSearchForm = fb.group({
      searchPatientId:[null],
      searchStartDate: [null],
      searchEndDate: [null]
	})

  };

  ngOnInit() {

  	this.getPatientData();
  }

  getPatientData() {
    console.log('In getPatients');
    this.patientService.getPatients().subscribe(patients => this.populateIncomesordata(patients));
  };

  populateIncomesordata(patients: Patients[]){

    for(var i = 0; i<patients.length; i++) {

      let incomesor: Incomesors = {        
        value: patients[i]._id,
        displayValue: patients[i].patientFirstName + " " + patients[i].patientLastName
      };

      this.incomesors.push( incomesor );
      console.log("Patient ID = " + this.incomesors[i].value);
      console.log("Name = " + this.incomesors[i].displayValue);

    }
  };

  getIncomeData() {
  	console.log('In getIncomeData');
  	this.incomeService.getIncome().subscribe(dataSource => this.dataSource = dataSource);
  	console.log(this.dataSource);
  } ;

  onRefresh() {
  	console.log('In onRefresh');
  	this.incomeService.getIncome().subscribe(dataSource => this.dataSource = dataSource);
  } ;

  onDelete( incomeID: string ){
  	this.incomeService.deleteIncome( incomeID ).subscribe();       
  }

  onUpdate( income ){
    var newIncome = new Income();    
    newIncome.description = income.description;
    newIncome.amount= income.amount;
    newIncome.incomeCategory = income.incomeCategory;
    this.incomeService.updateIncome( newIncome, income._id ).subscribe();       
  }

  onIncomeSearch() {
  	var whichServiceToExecute = new String();
  	var searchByEndDate = this.incomeSearchForm.get('searchEndDate').value;

  	if( this.incomeSearchForm.get('searchPatientId').value == null )
  	{
  		if( this.incomeSearchForm.get('searchStartDate').value == null )
	  	{
	  		whichServiceToExecute = 'NoExecution';
	  	}
	  	else
	  	{
	  		if( this.incomeSearchForm.get('searchEndDate').value == null )
	  		{
	  			searchByEndDate = Date.now();
	  		}
	  		whichServiceToExecute = 'SearchIncomeForAllPatientsSpecificDates';
	  	}
  	}
  	else
  	{
  		if( this.incomeSearchForm.get('searchStartDate').value == null )
	  	{
	  		whichServiceToExecute = 'SearchIncomeByPatientAllDates';
	  	}
	  	else
	  	{
	  		if( this.incomeSearchForm.get('searchEndDate').value == null )
	  		{
	  			searchByEndDate = Date.now();
	  		}

	  		whichServiceToExecute = 'SearchIncomeByPatientSpecificDates';
	  	}
  	} 
  	
  	if( whichServiceToExecute === "SearchIncomeByPatientSpecificDates" )
  	{
  		this.incomeService.getIncomebyDateForSpecificpatient(this.incomeSearchForm.get('searchPatientId').value, this.incomeSearchForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(dataSource => this.dataSource = dataSource);
  	}
  	else if( whichServiceToExecute === "SearchIncomeByPatientAllDates")
  	{
  		this.incomeService.getIncomeBySpecificPatient(this.incomeSearchForm.get('searchPatientId').value)
        .subscribe(dataSource => this.dataSource = dataSource);
  	}
  	else if( whichServiceToExecute === "SearchIncomeForAllPatientsSpecificDates")
  	{
  		this.incomeService.getIncomebyDateForAllPatient(this.incomeSearchForm.get('searchStartDate').value, searchByEndDate )
        .subscribe(dataSource => this.dataSource = dataSource);
  	}
 }

 exportToExcel() {
      this.export(this.income, "export");
   }


   export(json: any[], excelFileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('expenseTable'));
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, excelFileName + '_income_' + new Date().getTime() + this.EXCEL_EXTENSION);

  }

}

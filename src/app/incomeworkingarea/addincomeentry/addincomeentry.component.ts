import { Component, OnInit } from '@angular/core';
import { IncomeCategories } from './incomecategories';
import {FormBuilder, FormGroup, Validators, FormControl, NgForm} from '@angular/forms';
import { PatientsService } from '../../services/patients.service';
import { Incomesors } from './incomesor';
import { Patients } from '../../data/patients';
import { IncomeService } from '../../services/income.service';
import { Income } from '../../data/income';

@Component({
  selector: 'app-addincomeentry',
  templateUrl: './addincomeentry.component.html',
  styleUrls: ['./addincomeentry.component.css']
})
export class AddincomeentryComponent implements OnInit {

	categories: IncomeCategories[] = [	
	    {category: 'Cash Advances'},
	    {category: 'Medicines'},
	    {category: 'Meals and snacks'},
	    {category: 'Household'}
  	];

  	incomesors : Incomesors[] = []; 

  	incomeData: FormGroup;

  	constructor(private fb: FormBuilder, private patientService: PatientsService, private incomeService: IncomeService) { 
  		this.incomeData = fb.group({
		  	incomeFor:[null, Validators.required],
		  	dateOfIncome: [null, Validators.required],
			description: [null, Validators.required],
			incomeCategory: [null, Validators.required],
			amount: [null, Validators.required]
		});

  	}

  ngOnInit(){

		this.getPatientData();
	
	};


	getPatientData() {
	  	console.log('In getPatients');
	  	this.patientService.getPatients().subscribe(patients => this.populateExpensordata(patients));

	  	/*var patients: Patients[] = [	
	    {_id: '1111', patientFirstName: 'KK', patientLastName: 'PP', patientMiddleName: '', dateOfBirth: new Date(Date.now()), address: '', contactPerson: '', contactPersonNumber: '' },
	    {_id: '1112', patientFirstName: 'KK1', patientLastName: 'PP1', patientMiddleName: '', dateOfBirth: new Date(Date.now()), address: '', contactPerson: '', contactPersonNumber: '' },
	    {_id: '1113', patientFirstName: 'KK2', patientLastName: 'PP2', patientMiddleName: '', dateOfBirth: new Date(Date.now()), address: '', contactPerson: '', contactPersonNumber: '' },
	    {_id: '1114', patientFirstName: 'KK3', patientLastName: 'PP3', patientMiddleName: '', dateOfBirth: new Date(Date.now()), address: '', contactPerson: '', contactPersonNumber: '' }
	    
  	];
	  	this.populateExpensordata( patients );*/
  	};


  	onFormSubmit( ){
		var newIncome = new Income();
		console.log("In on submit");
		console.log(this.incomeData.get('incomeFor').value);
	  	newIncome.incomeFor = this.incomeData.get('incomeFor').value; 
	  	newIncome.dateOfEntry = new Date(Date.now());
	  	newIncome.incomeDate = this.incomeData.get('dateOfIncome').value;
	  	newIncome.description = this.incomeData.get('description').value;
	  	newIncome.amount= this.incomeData.get('amount').value;
	  	newIncome.incomeCategory = this.incomeData.get('incomeCategory').value;
	  		  	  
		this.incomeService.addIncome( newIncome ).subscribe(income => newIncome = income);
		console.log('Before');

		this.incomeData.reset();
		console.log('After');
  	} 

  	populateExpensordata(patients: Patients[]){

  		for(var i = 0; i<patients.length; i++) {
  			
  			let expensor: Incomesors = {
  				id: patients[i]._id,
  				Name: patients[i].patientFirstName + " " + patients[i].patientLastName
  			};

  			this.incomesors.push( expensor );
  			console.log(this.incomesors[i].id);
  			console.log(this.incomesors[i].Name);

  		}
  	};

}

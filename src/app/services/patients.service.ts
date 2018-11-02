import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {Observable, of } from 'rxjs';
import { Patients } from '../data/patients';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  private patientsUrl = 'http://localhost:3000/api/patient';
  private deletepatient = 'http://localhost:3000/api/patientdelete';
  private updatepatient = 'http://localhost:3000/api/patientupdate';
  constructor(private http: HttpClient) { }


  	/** POST: add a new patient to the server */
	addPatient (patient: Patients): Observable<Patients> {

		console.log( patient );

	  return this.http.post<Patients>(this.patientsUrl, patient, httpOptions).pipe(
	    tap((patient: Patients) => this.log(`added patient w/ Patient Name =${patient.patientFirstName}`)),
	    catchError(this.handleError<Patients>('addPatient'))
	  );
	}

	
	getPatients (): Observable<Patients[]> {
		console.log('In getPatients Service');
	  	return this.http.get<Patients[]>(this.patientsUrl)
	}


	deletePatient ( patientID: string ): Observable<Patients[]> {
		console.log('In delete Patient Service');
		let params = new HttpParams();
		params = params.append('id', patientID);

	  	return this.http.delete<Patients[]>(this.deletepatient, {params: params});
	}

	updatePatient ( expense: Patients, expenseId: string ): Observable<Patients[]> {
		console.log('In updatePatients Service');
		let params = new HttpParams();
		params = params.append('id', expenseId );
	  	return this.http.put<Patients[]>(this.updatepatient, expense, {params: params} );
	}


	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	  //this.messagesService.addMessage(`HeroService: ${message}`);
	  console.log( `PatientsService: ${message}` );
	}


	  /**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {

	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead

	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';

import { AppComponent } from './app.component';
import { WorkingareaComponent } from './workingarea/workingarea.component';
import { AddnewentryComponent } from './addnewentry/addnewentry.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule }    from '@angular/common/http';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchpatientsComponent } from './searchpatients/searchpatients.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ExpenseworkingareaComponent } from './expenseworkingarea/expenseworkingarea.component';
import { AddexpenseentryComponent } from './expenseworkingarea/addexpenseentry/addexpenseentry.component';
import { SearchexpensesComponent } from './expenseworkingarea/searchexpenses/searchexpenses.component';
import { IncomeworkingareaComponent } from './incomeworkingarea/incomeworkingarea.component';
import { AddincomeentryComponent } from './incomeworkingarea/addincomeentry/addincomeentry.component';
import { SearchincomeComponent } from './incomeworkingarea/searchincome/searchincome.component';
import { EditpatientdialogComponent } from './editpatientdialog/editpatientdialog.component';
import { ReportworkingareaComponent } from './reportworkingarea/reportworkingarea.component';


@NgModule({
  declarations: [
    AppComponent,
    WorkingareaComponent,
    AddnewentryComponent,
    SearchpatientsComponent,
    ExpenseworkingareaComponent,
    AddexpenseentryComponent,
    SearchexpensesComponent,
    IncomeworkingareaComponent,
    AddincomeentryComponent,
    SearchincomeComponent,
    EditpatientdialogComponent,
    ReportworkingareaComponent
  ],
  imports: [
    BrowserModule,
    AngularSplitModule,
    AppRoutingModule,
    MatTabsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-workingarea',
  templateUrl: './workingarea.component.html',
  styleUrls: ['./workingarea.component.css']
})
export class WorkingareaComponent implements OnInit {
  navLinks = [
  	{path: 'addnewentry', label:'ADD'},
  	{path: 'search', label:'SEARCH'}
  ]
  
  constructor() { }

  ngOnInit() {
  }

}

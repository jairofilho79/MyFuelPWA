import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  username = 'Jairo';
  currentMonth = new Date();
  currentMonthTotal = 120.26

  constructor() { }

  ngOnInit() {
  }

}

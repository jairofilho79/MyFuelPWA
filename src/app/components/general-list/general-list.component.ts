import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'mf-general-list',
  templateUrl: './general-list.component.html',
  styleUrls: ['./general-list.component.css']
})
export class GeneralListComponent implements OnInit {
  @Input() data;
  @Input() onRemoveEnable;
  @Output() onRemoveEvent = new EventEmitter();
  @Output() onClickEvent = new EventEmitter();
  defaultColor = '#F0FF78';
  /**
   * data = [
   *  {
   *   text1: "text1",
   *   text2: "text2",
   *  }
   * ]
   */

  constructor() {
   }

  ngOnInit() {
  }

  removeEvent(index) {
    //emit event with index;
    alert('removed! ' + index);
    this.onRemoveEvent.emit(index);
  }

  clickEvent(index) {
    //emit event with index;
    alert('clicked! ' + index);
    this.onClickEvent.emit(index);
  }

}

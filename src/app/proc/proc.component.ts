import { Component, OnInit, Input } from '@angular/core';
import { Proc } from '../app.component';

@Component({
  selector: 'app-proc',
  templateUrl: './proc.component.html',
  styleUrls: ['./proc.component.css']
})
export class ProcComponent implements OnInit {
  
  @Input() proc: Proc;

  constructor() { }

  ngOnInit(): void {
  }

}

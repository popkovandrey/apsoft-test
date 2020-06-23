import { Component, OnInit } from '@angular/core';
import axios from 'axios';

import { compareStrings, compareNumbers, isEven } from '../common.js';

export interface Proc {
  pid: number;
  title: string;
  cpu: number;
  memory: number;
  evenRow: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  updatePeriod = 3000;

  procs: Proc[] = [];

  signSortDirection = '^';

  sortRule = {
    fieldName: 'pid',
    directionAsc: true,
  };

  onClickSort(nameField): void {
    if (this.sortRule.fieldName === nameField) {
      this.sortRule.directionAsc = !this.sortRule.directionAsc;
    } else {
      this.sortRule.fieldName = nameField;
      this.sortRule.directionAsc = true;
    }

    this.sortProcs(this.procs, this.sortRule);
    this.signSortDirection = this.sortRule.directionAsc ? '^' : 'v';
  }

  ngOnInit(): void {
    for (let i = 0; i < 20; i += 1) {
      const evenClass = isEven(i + 1) ? 'even' : '';

      this.procs.push({ pid: i + 1, title: `proc ${i + 1}`, cpu: 0, memory: 0, evenRow: evenClass });
    }

    this.sortProcs(this.procs, this.sortRule);

    this.updateProcs(this.procs, this.sortRule);
  }

  sortProcs = (procs, sortRule) => {
    const mapping = {
      pid: procs.sort(compareNumbers(sortRule.fieldName, sortRule.directionAsc)),
      title: procs.sort(compareStrings(sortRule.fieldName, sortRule.directionAsc)),
      cpu: procs.sort(compareNumbers(sortRule.fieldName, sortRule.directionAsc)),
      memory: procs.sort(compareNumbers(sortRule.fieldName, sortRule.directionAsc)),
    };

    const res = mapping[sortRule.fieldName];

    for (let i = 0; i < procs.length; i += 1) {
      const evenClass = isEven(i + 1) ? 'even' : '';

      procs[i].evenRow = evenClass;
    }
  }

  updateProcs = (procs, sortRule) => {
    axios.get(`/api/procs`)
      .then((response) => {
        const responseProcs = response.data.procs.reduce(
          (acc, item) => ({ ...acc, [item.pid]: item }),
          {}
        );

        for (let i = 0; i < procs.length; i += 1) {
          procs[i] = { ...procs[i], ...responseProcs[procs[i].pid] };
        }

        const { fieldName } = sortRule;

        if (fieldName === 'cpu' || fieldName === 'memory') {
          this.sortProcs(procs, sortRule);
        }
      })
      .catch(console.log)
      .finally(() => {
        setTimeout(this.updateProcs, this.updatePeriod, procs, sortRule);
      });
  }
}

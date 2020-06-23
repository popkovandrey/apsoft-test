import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import _ from 'lodash';

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
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  procs: Proc[] = [];

  signSortDirection = '^';

  onClickSort(nameField): void {
    if (this.sortRule.fieldName === nameField) {
      this.sortRule.directionAsc = !this.sortRule.directionAsc; 
    } else {
      this.sortRule.fieldName = nameField;
      this.sortRule.directionAsc = true;
    }

    sortProcs(this.procs, this.sortRule);
    this.signSortDirection = this.sortRule.directionAsc ? '^' : 'v';
  };

  sortRule = {
    fieldName: 'pid',
    directionAsc: true,
  }

  ngOnInit(): void {
    for (let i = 0; i < 20; i += 1) {
      const evenClass = (i + 1) % 2 === 0 ? 'even' : '';

      this.procs.push({ pid: i + 1, title: `proc ${i + 1}`, cpu: 0, memory: 0, evenRow: evenClass });
    }

    sortProcs(this.procs, this.sortRule);

    updateProcs(this.procs, this.sortRule);
  };
}

const compareNumbers = (fieldName, sortDirectionAsc) => {
  const mapping = {
    true: (a, b) => a[fieldName] - b[fieldName],
    false: (a, b) => b[fieldName] - a[fieldName],
  };

  return mapping[sortDirectionAsc];
};

const compareStrings = (fieldName, sortDirectionAsc) => {
  const mapping = {
    true: (a, b) => {
      let res = 0;

      if (a[fieldName] > b[fieldName]) {
        res = 1;
      } else if (a[fieldName] === b[fieldName]) {
        res = 0;
      } else {
        res = -1;
      }

      return res;
    },
    false: (a, b) => {
      let res = 0;

      if (a[fieldName] > b[fieldName]) {
        res = -1;
      } else if (a[fieldName] === b[fieldName]) {
        res = 0;
      } else {
        res = 1;
      }

      return res;
    },
  };

  return mapping[sortDirectionAsc];
};

const sortProcs = (procs, sortRule) => {
  const mapping = {
    pid: procs.sort(compareNumbers(sortRule.fieldName, sortRule.directionAsc)),
    title: procs.sort(compareStrings(sortRule.fieldName, sortRule.directionAsc)),
    cpu: procs.sort(compareNumbers(sortRule.fieldName, sortRule.directionAsc)),
    memory: procs.sort(compareNumbers(sortRule.fieldName, sortRule.directionAsc)),
  };

  mapping[sortRule.fieldName];

  for (let i = 0; i < procs.length; i += 1) {
    const evenClass = (i + 1) % 2 === 0 ? 'even' : '';

    procs[i].evenRow = evenClass;
  }
};

const updateProcs = (procs, sortRule) => {
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
        sortProcs(procs, sortRule);
      }
    })
    .catch(console.log)
    .finally(() => {
      setTimeout(updateProcs, updatePeriod, procs, sortRule);
    })
}

const updatePeriod = 3000;

//const localForage: LocalForage = require("localforage/dist/localforage");
import {FirebaseService} from 'firebase-angular2/core';


export interface Customer {
    name: string;
    email: string;
}

export class NameListService {

  constructor() {}
  
  names = [
    'Edsger Dijkstra',
    'Donald Knuth',
    'Alan Turing',
    'Grace Hopper'
  ];

  get(): string[] {
    return this.names;
  }
  add(value: string): void {
    this.names.push(value)
  }
}

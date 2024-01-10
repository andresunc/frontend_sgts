import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharedService {

  private sharedObject: any;
  
  constructor() { }

  setSharedObject(data: any) {
    this.sharedObject = data;
  }

  getSharedObject() {
    return this.sharedObject;
  }
}

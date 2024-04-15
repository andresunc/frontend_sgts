import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { UrlBackend } from 'src/app/models/Url';

@Injectable({
  providedIn: 'root'
})
export class ItemChecklistService {

  urlBackend = new UrlBackend().getUrlBackend();
  addNewItemCheckListUrl = this.urlBackend + '/itemChecklist/create';

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo servicio
  addItemCheckList(newItemCheckList: ItemChecklist): Observable<ItemChecklist> {
    return this.http.post<ItemChecklist>(this.addNewItemCheckListUrl, newItemCheckList);
  }

}

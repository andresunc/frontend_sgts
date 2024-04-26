import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemChecklistService {

  urlBackend = new UrlBackend().getUrlBackend();
  addNewItemCheckListUrl = this.urlBackend + '/itemChecklist/create';
  updateItemCheckListUrl = this.urlBackend + '/itemChecklist/update';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para crear un nuevo ItemChecklist
  addItemCheckList(newItemCheckList: ItemChecklist): Observable<ItemChecklist> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<ItemChecklist>(this.addNewItemCheckListUrl, newItemCheckList, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al agregar un nuevo ItemChecklist', error);
          return throwError(error);
        })
      );
  }

  // Método para actualizar un ItemChecklist existente
  updateItemCheckList(updatedItemsCheckList: ItemChecklist[]): Observable<ItemChecklist[]> {
    const headers: HttpHeaders = this.authService.getHeader();

    return this.http.put<ItemChecklist[]>(this.updateItemCheckListUrl, updatedItemsCheckList, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar el ItemChecklist', error);
          return throwError(error);
        })
      );
  }

}

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { ItemChecklistDto } from 'src/app/models/ModelsDto/IItemChecklistDto';
import { ReasignacionResponsablesDto } from 'src/app/models/ModelsDto/ReasignacionResponsablesDto';

@Injectable({
  providedIn: 'root'
})
export class ItemChecklistService {

  urlBackend = new UrlBackend().getUrlBackend();
  private addNewItemCheckListUrl = this.urlBackend + '/itemChecklist/create';
  private updateItemCheckListUrl = this.urlBackend + '/itemChecklist/update';
  private deleteItemCheckListUrl = this.urlBackend + '/itemChecklist/delete';
  private reasignarResponsablesUrl = this.urlBackend + '/itemChecklist/reasignar-responsables';
  private getAllItemsByRecurso = this.urlBackend + '/itemChecklist/recurso/';

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

  // Método para eliminar un listado de Items del Checklist
  deleteListItems(itemToDelete: ItemChecklistDto): Observable<ItemChecklistDto> {
    const headers: HttpHeaders = this.authService.getHeader();

    const options = {
      headers: headers,
      body: itemToDelete
    };

    return this.http.delete<ItemChecklistDto>(this.deleteItemCheckListUrl, options)
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar el listado', error);
          return throwError(error);
        })
      );
  }

  // Método para reasignar responsables
  reasignarResponsables(dto: ReasignacionResponsablesDto): Observable<any> {
    const headers: HttpHeaders = this.authService.getHeader();
  
    return this.http.post(this.reasignarResponsablesUrl , dto, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al reasignar responsables', error);
          return throwError(error); 
        })
      );
  }

  // Método para listar los ítems del Checklist, de servicios activos, segun un recurso
  getItemsByRecursoGgId(recursoGgId: number): Observable<ItemChecklist[]> {
    const headers: HttpHeaders = this.authService.getHeader();
  
    return this.http.get<ItemChecklist[]>(this.getAllItemsByRecurso + recursoGgId, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al obtener items de checklist', error);
          return throwError(error); 
        })
      );
  }

}

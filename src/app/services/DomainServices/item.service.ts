import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { Item } from 'src/app/models/DomainModels/Item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  urlBackend = new UrlBackend().getUrlBackend();
  getItemsNotDeleteUrl = this.urlBackend + '/item/getAllNotDeleted';
  createItemUrl = this.urlBackend + '/item/create';
  updateItemUrl = this.urlBackend + '/item/update/';
  deleteItemUrl = this.urlBackend + '/item/delete/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método GET para obtener los Item no eliminados
  getItemsNotDelete(): Observable<Item[]> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.get<Item[]>(this.getItemsNotDeleteUrl, { headers })
    .pipe(
      tap(() => {
      }),
      catchError((error) => {
        console.error('Error en la solicitud cargar Items', error);
        return throwError(error);
      })
    );
  }

  
  // Método para crear un nuevo Item
  createItem(newItem: Item): Observable<Item> {
    const headers: HttpHeaders = this.authService.getHeader();
    console.log("headers create item: ", headers)
    console.log("newItem: ", newItem)
    return this.http.post<Item>(this.createItemUrl, newItem, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al agregar un nuevo Item', error);
          return throwError(error);
        })
      );
  }

  // Método para modificar un Item
  public updateItem(idItem: number): Observable<Item> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.put<Item>(this.updateItemUrl + idItem, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al actualizar el Item', error);
          return throwError(error);
        })
      );
  }

  // delete Item
  public deleteItem(idItem: number): Observable<void> {
    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.delete<void>(this.deleteItemUrl + idItem, { headers })
      .pipe(
        catchError((error) => {
          
          console.error('Error al eliminar el Item', error);
          return throwError(error);
        })
      );
  }

}

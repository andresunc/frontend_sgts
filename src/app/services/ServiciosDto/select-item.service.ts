import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SelectItemDto } from 'src/app/models/ModelsDto/SelectitemsDto';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SelectItemService {

  urlBackend = new UrlBackend().getUrlBackend();
  getSelectItemUrl = this.urlBackend + '/selectItemDto/getItems';

  constructor(private http: HttpClient, 
    private authService: AuthService,
    private router: Router) { }

  getSelectItemDto(): Observable<SelectItemDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getCurrentToken()}`
    });

    return this.http.get<SelectItemDto[]>(this.getSelectItemUrl, { headers })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
            this.router.navigate(['/login']);
          }
          console.error('Error en la solicitud getSelectItemDto', error);
          return throwError(error);
        })
      );
  }
}
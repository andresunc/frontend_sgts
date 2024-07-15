import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { EmailDTO } from 'src/app/models/ModelsDto/EmailDTO';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private urlBackend = new UrlBackend().getUrlBackend();
  private url = this.urlBackend + '/email/sendMessage';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para renovar un servicio
  sendEmail(mail: EmailDTO): Observable<any> {

    const headers: HttpHeaders = this.authService.getHeader();
    return this.http.post<any>(this.url, mail, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error en el envío del mail', error);
          return throwError(error);
        })
      );
  }

}

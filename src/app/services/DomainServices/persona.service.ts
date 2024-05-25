import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UrlBackend } from 'src/app/models/Url';
import { AuthService } from '../auth.service';
import { Persona } from 'src/app/models/DomainModels/Persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

private urlBackend = new UrlBackend().getUrlBackend();
private getPersonasNotDeleteUrl = this.urlBackend + '/persona/getAllNotDeleted';
private createPersonaUrl = this.urlBackend + '/persona/create';
private updatePersonaUrl = this.urlBackend + '/persona/update';
private deletePersonaUrl = this.urlBackend + '/persona/delete/';

constructor(private http: HttpClient, private authService: AuthService) { }

}
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private connectionLostHandled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private isLogged: boolean;

    constructor(private authService: AuthService) { 
        this.isLogged = this.authService.isLoggedInUser();
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: any) => {
                if (error instanceof HttpErrorResponse && error.status >= 400 && this.isLogged) {
                    // Solo manejar si no se ha manejado anteriormente
                    if (!this.connectionLostHandled.value) {
                        this.connectionLostHandled.next(true); // Marcar como manejado
                        alert('Sesión finalizada, error: ' + error.status);
                        localStorage.removeItem('currentUser');
                        window.location.reload();
                    }
                }
                if (error instanceof HttpErrorResponse && error.status === 0 && this.isLogged) {
                    // Solo manejar si no se ha manejado anteriormente
                    if (!this.connectionLostHandled.value) {
                        this.connectionLostHandled.next(true); // Marcar como manejado
                        alert('No hay servicios escuchando');
                        localStorage.removeItem('currentUser');
                        window.location.reload();
                    }
                }
                return throwError(error);
            })
        );
    }
}
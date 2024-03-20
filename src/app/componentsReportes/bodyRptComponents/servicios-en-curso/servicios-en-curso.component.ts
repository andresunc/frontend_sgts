import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ServicioEnCurso } from 'src/app/models/RptModels/ServicioEnCurso';
import { ServiciosEnCursoService } from 'src/app/services/RptServices/servicios-en-curso.service';


@Component({
  selector: 'app-servicios-en-curso',
  templateUrl: './servicios-en-curso.component.html',
  styleUrls: ['./servicios-en-curso.component.css']
})
export class ServiciosEnCursoComponent implements OnDestroy, OnInit {

  serviciosEnCurso: ServicioEnCurso[] = [];

  constructor(private getRpt: ServiciosEnCursoService) { }

  ngOnInit(): void {
    this.getRpt.getServiciosEnCurso().pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: ServicioEnCurso[]) => {
        this.serviciosEnCurso = data;
      });
  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

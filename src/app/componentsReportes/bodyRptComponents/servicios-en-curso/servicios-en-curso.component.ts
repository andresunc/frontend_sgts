import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
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

  pieChartData: ChartData<"pie", number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [] // Puedes definir colores aquí si lo deseas
    }]
  };

  lineChartData = {
    labels: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    datasets: [
      {
        data: [60, 50, 30, 70, 50, 60, 70]
      },
    ],
  };

  constructor(private getRpt: ServiciosEnCursoService) { }

  ngOnInit(): void {
    this.getRpt.getServiciosEnCurso().pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: ServicioEnCurso[]) => {
        this.serviciosEnCurso = data;
      });
      this.actualizarDatosTorta();
  }

  private actualizarDatosTorta() {
    // Limpiar datos anteriores
    this.pieChartData.labels = [];
    this.pieChartData.datasets[0].data = [];
    this.pieChartData.datasets[0].backgroundColor = [];

    // Agrupar por dependenciaInvolucrada y calcular el total de porcentajes de avance para cada grupo
    const grupos: { [dependencia: string]: number } = {};
    this.serviciosEnCurso.forEach(servicio => {
      const dependencia = servicio.dependenciaInvolucrada;
      if (!grupos[dependencia]) {
        grupos[dependencia] = 0;
      }
      grupos[dependencia] += servicio.porcentajeAvance;
    });

    // Agregar datos a los arrays del gráfico de torta
    for (const dependencia in grupos) {
      if (grupos.hasOwnProperty(dependencia)) {
        this.pieChartData.labels.push(dependencia);
        this.pieChartData.datasets[0].data.push(grupos[dependencia]);
        // Puedes definir un color para cada sector si lo deseas
        // this.pieChartData.datasets[0].backgroundColor.push(....);
      }
    }
  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
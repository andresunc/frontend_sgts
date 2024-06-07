import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { ServicioEnCurso } from 'src/app/models/RptModels/ServicioEnCurso';
import { ServiciosEnCursoService } from 'src/app/services/RptServices/servicios-en-curso.service';
import { ChangeDetectorRef } from '@angular/core';
import { RptService } from 'src/app/services/SupportServices/rpt.service';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DataSourceComponent } from './data-source/data-source.component';

@Component({
  selector: 'app-servicios-en-curso',
  templateUrl: './servicios-en-curso.component.html',
  styleUrls: ['./servicios-en-curso.component.css']
})
export class ServiciosEnCursoComponent implements OnInit {

  serviciosEnCurso: ServicioEnCurso[] = [];

  // Gráfico para dependencias
  pieChartDataDependencias: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [] // Puedes agregar colores aquí
    }]
  };

  // Gráfico para tipos de servicios
  pieChartDataTipos: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [] // Puedes agregar colores aquí
    }]
  };

  // Gráfico lineal
  lineChartData: ChartData<'line'> = {
    labels: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    datasets: [
      {
        data: [60, 50, 130, 70, 50, 60, 70]
      },
    ],
  };

  constructor(
    private getRpt: ServiciosEnCursoService,
    private rptService: RptService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.setRpt();
  }

  setRpt() {
    this.getRpt.getServiciosEnCurso()
      .subscribe((data: ServicioEnCurso[]) => {
        this.serviciosEnCurso = data;
        this.actualizarDatosTorta(); // Actualizar datos de la torta después de obtener los servicios
      });
  }

  actualizarDatosTorta() {
    // Limpiar datos anteriores
    this.pieChartDataDependencias.labels = [];
    this.pieChartDataDependencias.datasets[0].data = [];
    this.pieChartDataTipos.labels = [];
    this.pieChartDataTipos.datasets[0].data = [];

    // Variables para almacenar los conteos
    const tiposDeServicios: { [tipo: string]: number } = {};
    const grupos: { [dependencia: string]: number } = {};

    // Agrupar por dependenciaInvolucrada y tipos de servicios
    this.serviciosEnCurso.forEach(servicio => {
      const dependencia = servicio.dependenciaInvolucrada;
      const tipoServicio = servicio.tipoServicio;

      // Contar tipos de servicios
      if (!tiposDeServicios[tipoServicio]) {
        tiposDeServicios[tipoServicio] = 0;
      }
      tiposDeServicios[tipoServicio]++;

      // Contar dependencias
      if (!grupos[dependencia]) {
        grupos[dependencia] = 0;
      }
      grupos[dependencia] += servicio.porcentajeAvance;
    });

    // Agregar datos al gráfico de dependencias
    for (const dependencia in grupos) {
      if (grupos.hasOwnProperty(dependencia)) {
        this.pieChartDataDependencias.labels.push(dependencia);
        this.pieChartDataDependencias.datasets[0].data.push(grupos[dependencia]);
      }
    }

    this.pieChartDataDependencias = {
      labels: Object.keys(grupos),
      datasets: [{
        data: Object.values(grupos),
        backgroundColor: Object.keys(grupos).map(() => this.rptService.getRandomPastelColor())
      }]
    };

    this.pieChartDataTipos = {
      labels: Object.keys(tiposDeServicios),
      datasets: [{
        data: Object.values(tiposDeServicios),
        backgroundColor: Object.keys(tiposDeServicios).map(() => this.rptService.getRandomPastelColor())
      }]
    };

  }

  openDataSource() {
    const dialogRef = this.dialog.open(DataSourceComponent, {
      data: { dataSorce: this.serviciosEnCurso }
    });

    dialogRef.afterClosed().subscribe(() =>
      this.actualizarDatosTorta()
    );
  }

}

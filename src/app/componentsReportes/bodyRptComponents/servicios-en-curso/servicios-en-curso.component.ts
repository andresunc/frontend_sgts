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

  // Gráfico para los rubros
  pieChartDataRubros: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
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
    const dependencias: { [dependencia: string]: number } = {};
    const rubros: { [rubro: string]: number } = {};

    // Agrupar por dependenciaInvolucrada y tipos de servicios
    this.serviciosEnCurso.forEach(servicio => {
      const dependencia = servicio.dependenciaInvolucrada;
      const tipoServicio = servicio.tipoServicio;
      const rubro = servicio.rubro;

      // Contar rubros
      if (!rubros[rubro]) {
        rubros[rubro] = 0;
      }
      rubros[rubro]++;

      // Contar tipos de servicios
      if (!tiposDeServicios[tipoServicio]) {
        tiposDeServicios[tipoServicio] = 0;
      }
      tiposDeServicios[tipoServicio]++;

      // Contar dependencias
      if (!dependencias[dependencia] && dependencia != 'N/A') {
        dependencias[dependencia] = 0;
      }
      dependencias[dependencia]++;
    });

    // Agregar datos al gráfico de dependencias
    for (const dependencia in dependencias) {
      if (dependencias.hasOwnProperty(dependencia)) {
        this.pieChartDataDependencias.labels.push(dependencia);
        this.pieChartDataDependencias.datasets[0].data.push(dependencias[dependencia]);
      }
    }

    // Actualizar gráfico de dependencias y filtrar etiquetas y datos para excluir "N/A"
    this.pieChartDataDependencias = {
      labels: Object.keys(dependencias).filter(dependencia => dependencia !== 'N/A'),
      datasets: [{
        data: Object.values(dependencias),
        backgroundColor: Object.keys(dependencias).map(() => this.rptService.getRandomPastelColor())
      }]
    };

    // Actualizar gráfico de tipos de servicios
    this.pieChartDataTipos = {
      labels: Object.keys(tiposDeServicios),
      datasets: [{
        data: Object.values(tiposDeServicios),
        backgroundColor: Object.keys(tiposDeServicios).map(() => this.rptService.getRandomPastelColor())
      }]
    };

    // Actualizar gráfico de rubros
    this.pieChartDataRubros = {
      labels: Object.keys(rubros),
      datasets: [{
        data: Object.values(rubros),
        backgroundColor: Object.keys(rubros).map(() => this.rptService.getRandomPastelColor())
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

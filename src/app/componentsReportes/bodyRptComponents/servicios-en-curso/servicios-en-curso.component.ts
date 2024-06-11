import { Component, OnInit } from '@angular/core';
import { ChartData } from 'chart.js';
import { ServicioEnCurso } from 'src/app/models/RptModels/ServicioEnCurso';
import { ServiciosEnCursoService } from 'src/app/services/RptServices/servicios-en-curso.service';
import { RptService } from 'src/app/services/SupportServices/rpt.service';
import { MatDialog } from '@angular/material/dialog';
import { DataSourceComponent } from './data-source/data-source.component';
import { RptRebote } from 'src/app/models/RptModels/RptRebote';
import { ReboteService } from 'src/app/services/RptServices/rebote.service';

@Component({
  selector: 'app-servicios-en-curso',
  templateUrl: './servicios-en-curso.component.html',
  styleUrls: ['./servicios-en-curso.component.css']
})
export class ServiciosEnCursoComponent implements OnInit {

  serviciosEnCurso: ServicioEnCurso[] = [];
  reboteList: RptRebote[] = [];

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
    private rptRebote: ReboteService,
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

    this.rptRebote.getRebotes()
      .subscribe(data => {
        this.reboteList = data;
        this.ordenarListado();
        this.getMinDateAndMaxDate();
      })
  }

  calcularEficiencia(reboteA: RptRebote, ReboteB: RptRebote) {

    /**
        1 Calcular la diferencia absoluta (DA) entre la fecha A y la fecha B. Es decir: DA = A-B
        2 Aumento relativo: (DA/B)*1
    */
    console.log('Fecha A: ', reboteA.fecha)
    console.log('Fecha B: ', ReboteB.fecha)

    const difAbsAMBI = (reboteA.reboteAmbiente! - ReboteB.reboteAmbiente!);
    const difAbsHYS = (reboteA.reboteHys! - ReboteB.reboteHys!);
    const difAbsHOL = (reboteA.reboteHabilitaciones! - ReboteB.reboteHabilitaciones!);

    const vRelativoAMBI = (100 * ( difAbsAMBI / ReboteB.reboteAmbiente!)).toFixed(2);
    const vRelativoHYS = (100 * ( difAbsHYS /ReboteB.reboteHys!)).toFixed(2);
    const vRelativoHOL = (100 * ( difAbsHOL /ReboteB.reboteHabilitaciones!)).toFixed(2);

    console.log(vRelativoAMBI, 'ambiente')
    console.log(vRelativoHYS, 'hys')
    console.log(vRelativoHOL, 'habilitaciones')

  }

  getMinDateAndMaxDate() {
    const minDateRebote = this.reboteList.reduce((min, rebote) => new Date(rebote.fecha!) < new Date(min.fecha!) ? rebote : min, this.reboteList[0]);
    const maxDateRebote = this.reboteList.reduce((max, rebote) => new Date(rebote.fecha!) > new Date(max.fecha!) ? rebote : max, this.reboteList[0]);

    this.calcularEficiencia(minDateRebote, maxDateRebote);

  }

  ordenarListado() {
    // Ordenar por fecha ascendente
    this.reboteList.sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime());
    console.log('Rebotes: ', this.reboteList)
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

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  title: string = "Reportes";

  constructor(
    public dialog: MatDialog,
    private dataShared: DataSharedService
  
  ) { }
    
  ngOnInit(): void {
    
  }

  @ViewChild('reporte0') Reporte0!: TemplateRef<HTMLElement>;
  @ViewChild('reporte1') Reporte1!: TemplateRef<HTMLElement>;
  @ViewChild('reporte2') Reporte2!: TemplateRef<HTMLElement>;
  @ViewChild('reporte3') Reporte3!: TemplateRef<HTMLElement>;
  @ViewChild('reporte4') Reporte4!: TemplateRef<HTMLElement>;
  @ViewChild('reporte5') Reporte5!: TemplateRef<HTMLElement>;

  openReporte(reportIndex: number) {
    let selectedTemplate: TemplateRef<HTMLElement>;

    switch (reportIndex) {
      case 0:
        selectedTemplate = this.Reporte0;
        break;
      case 1:
        selectedTemplate = this.Reporte1;
        break;
      case 2:
        selectedTemplate = this.Reporte2;
        break;
      case 3:
        selectedTemplate = this.Reporte3;
        break;
      case 4:
        selectedTemplate = this.Reporte4;
        break;
        case 5:
        selectedTemplate = this.Reporte5;
        break;
      default:
        console.error("Reporte no válido");
        return;
    }

    const title = this.getReportTitle(reportIndex);
    this.dataShared.openDialog(selectedTemplate, title);
  }

  getReportTitle(reportIndex: number): string {
    switch (reportIndex) {
      case 0:
        return 'Servicios por Estado';
      case 1:
        return 'Trámites con mayor desvío';
      case 2:
        return 'Análisis de Rebote';
      case 3:
        return 'Rubros con mayor desvío';
      case 4:
        return 'Asignación por tipo de rol';
      case 5:
        return 'Items por Dependencia';
      default:
        return '';
    }
  }
  

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

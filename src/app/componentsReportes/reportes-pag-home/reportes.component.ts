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
  @ViewChild('reporte6') Reporte6!: TemplateRef<HTMLElement>;
  @ViewChild('reporte7') Reporte7!: TemplateRef<HTMLElement>;
  @ViewChild('reporte8') Reporte8!: TemplateRef<HTMLElement>;
  @ViewChild('reporte9') Reporte9!: TemplateRef<HTMLElement>;
  @ViewChild('reporte10') Reporte10!: TemplateRef<HTMLElement>;
  @ViewChild('reporte11') Reporte11!: TemplateRef<HTMLElement>;
  @ViewChild('reporte12') Reporte12!: TemplateRef<HTMLElement>;
  @ViewChild('reporte13') Reporte13!: TemplateRef<HTMLElement>;

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
        case 6:
        selectedTemplate = this.Reporte6;
        break;
        case 7:
        selectedTemplate = this.Reporte7;
        break;
        case 8:
        selectedTemplate = this.Reporte8;
        break;
        case 9:
        selectedTemplate = this.Reporte9;
        break;
        case 10:
        selectedTemplate = this.Reporte10;
        break;
        case 11:
        selectedTemplate = this.Reporte11;
        break;
        case 12:
        selectedTemplate = this.Reporte12;
        break;
        case 13:
        selectedTemplate = this.Reporte13;
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
        return 'Trámites con Mayor Desvío';
      case 2:
        return 'Análisis de Rebote';
      case 3:
        return 'Rubros con Mayor Desvío';
      case 4:
        return 'Asignación por Tipo de Rol';
      case 5:
        return 'Items por Dependencia';
      case 6:
        return 'Servicios por Vencer';
      case 7:
        return 'Servicios';
      case 8:
        return 'Servicios por Empresa';
      case 9:
        return 'Clientes con más Renovaciones';
      case 10:
        return 'Servicios por Rubro';
      case 11:
        return '';
      case 12:
        return '';
      case 13:
        return '';
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

import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-new-servicio',
  templateUrl: './new-servicio.component.html',
  styleUrls: ['./new-servicio.component.css']
})
export class NewServicioComponent implements OnInit {

  servicioForm!: FormGroup;
  title: string = "Nuevo Servicio";

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Inicializar el formulario en el método ngOnInit
    this.servicioForm = this.fb.group({
      monto: ['', [Validators.pattern('[0-9]*(\.[0-9]*)?')]],
      tipo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      empresa: ['', [Validators.required]],
    });
  }

  selectedTabIndex: number = 0;
  goToNextTab(value: number) {
    this.selectedTabIndex = value
  }

  tabChanged(event: MatTabChangeEvent) {
    // Actualizar el índice del tab seleccionado
    this.selectedTabIndex = event.index;
  }
  
}

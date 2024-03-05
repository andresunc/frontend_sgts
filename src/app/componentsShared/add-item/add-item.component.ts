import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  formulario!: FormGroup;
  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      duracionEnDias: [null, Validators.required],
      duracionEnHoras: [null, Validators.required],
      inicioConDesvio: [null, Validators.required],
      finConDesvio: [null, Validators.required],
      notificado: [false],
      tasaValor: [0],
      tasaCantidadHojas: [0],
      urlComprobanteTasa: [''],
      recursoGgIdRecursoGg: [null, Validators.required],
      itemIdItem: [null, Validators.required],
      completo: [false],
    });
  }
  submitForm(): void {
    if (this.formulario.valid) {
      // Realiza la lógica de envío del formulario aquí
      const formData = this.formulario.value;
      console.log(formData); // Puedes enviar los datos a un servicio, por ejemplo.
    } else {
      // Marcar los campos inválidos y mostrar mensajes de error si es necesario
      this.marcarCamposInvalidos(this.formulario);
    }
  }
  marcarCamposInvalidos(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.marcarCamposInvalidos(control);
      }

      control.markAsTouched();
    });
  }

}

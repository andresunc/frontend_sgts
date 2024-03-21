import { Component, OnInit} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cfg-clientes',
  templateUrl: './cfg-clientes.component.html',
  styleUrls: ['./cfg-clientes.component.css']
})
export class CfgClientesComponent implements OnInit {

  title: string = "Configuración de Clientes";
  
  firstFormGroup = this._formBuilder.group({
      RazonSocial: ['', [Validators.required]],
      CUIT: ['', [Validators.required, Validators.pattern('^[0-9]{6,}$')]],
      Rubro: ['', [Validators.required]],
      Riesgo: ['', [Validators.required]]
  });
  secondFormGroup: FormGroup; // Declaración del FormGroup
  
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical' as StepperOrientation)));

    // Inicializar secondFormGroup en el constructor
    this.secondFormGroup = this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Apellido: [''],
      Direccion: ['', [Validators.required]],
      Telefono: ['', [Validators.required, Validators.pattern('^[0-9]{6,}$')]],
      Email: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]]
    });
  }

  getStepperStyles() {
    return {
      'width.%': this.stepperOrientation.pipe(map(orientation => orientation === 'horizontal' ? 100 : 80)),
      'height.px': this.stepperOrientation.pipe(map(orientation => orientation === 'horizontal' ? 80 : 100))
    };
  }

  ngOnInit() {
    // Agregar el campo de correo electrónico a secondFormGroup
    this.secondFormGroup.addControl('email', this._formBuilder.control('', [Validators.required, Validators.email]));
  } 

  contactos: any[] = [];

  agregarContacto() {
    // Capturar los valores de los campos del formulario secondFormGroup
    if (this.secondFormGroup.valid) {
      const nombre = this.secondFormGroup.get('Nombre')?.value;
      const apellido = this.secondFormGroup.get('Apellido')?.value;
      const direccion = this.secondFormGroup.get('Direccion')?.value;
      const telefono = this.secondFormGroup.get('Telefono')?.value;
      const email = this.secondFormGroup.get('Email')?.value;
    
    
    // Agregar los datos a la lista de contactos
    this.contactos.push({
      id: this.contactos.length + 1,
      nombre: nombre,
      apellido: apellido,
      direccion: direccion,
      telefono: telefono,
      email: email
    });

    this.secondFormGroup.reset();
  }

} 


paso1EsValido(): boolean {
  return this.firstFormGroup.valid;
}


}
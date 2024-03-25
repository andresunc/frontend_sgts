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
      Direccion: ['', [Validators.required]],
      Rubro: ['', [Validators.required]],
      Riesgo: ['', [Validators.required]]
  });
  secondFormGroup: FormGroup; // Declaración del FormGroup
  
  stepperOrientation: Observable<StepperOrientation>;

  modificarEliminarHabilitado: boolean = false;

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
    this.secondFormGroup.addControl('Email', this._formBuilder.control('', [Validators.required, Validators.email]));

    this.actualizarResumen();
  } 

  resumenDatos: any = {}; // Objeto para almacenar los datos del resumen

// Función para actualizar el objeto del resumen
 actualizarResumen() {
  this.resumenDatos.datosCliente = {
    RazonSocial: this.firstFormGroup.get('RazonSocial')?.value,
    CUIT: this.firstFormGroup.get('CUIT')?.value,
    Direccion: this.firstFormGroup.get('Direccion')?.value,
    Rubro: this.firstFormGroup.get('Rubro')?.value,
    Riesgo: this.firstFormGroup.get('Riesgo')?.value
  };

  this.resumenDatos.contactos = this.contactos;
  
}

  contactos: any[] = [];

  agregarContacto() {
    if (this.secondFormGroup.valid) {
      const nombre = this.secondFormGroup.get('Nombre')?.value;
      const apellido = this.secondFormGroup.get('Apellido')?.value;
      const telefono = this.secondFormGroup.get('Telefono')?.value;
      const email = this.secondFormGroup.get('Email')?.value;
    
      // Agregar los datos a la lista de contactos
      this.contactos.push({
        id: this.contactos.length + 1,
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        email: email
      });
  
      this.secondFormGroup.reset();
  
      // Actualizar el resumen después de agregar el contacto
      this.actualizarResumen();
    }
  } 

  editarContacto(contacto: any) {
    // Autocompletar los campos del formulario con los datos del contacto
    this.secondFormGroup.patchValue({
      Nombre: contacto.nombre,
      Apellido: contacto.apellido,
      Telefono: contacto.telefono,
      Email: contacto.email
    });
  
    // Eliminar el contacto de la lista
    const index = this.contactos.indexOf(contacto);
    if (index !== -1) {
      this.contactos.splice(index, 1);
    }

    this.actualizarResumen();
  }


paso1EsValido(): boolean {
  return this.firstFormGroup.valid;
  }

 // Función para cargar los datos del cliente seleccionado
cargarDatosClienteSeleccionado(clienteSeleccionado: any) {
  // Cargar los datos del cliente en los campos del primer paso del formulario
  this.firstFormGroup.patchValue({
    RazonSocial: clienteSeleccionado.razonSocial,
    CUIT: clienteSeleccionado.cuit,
    // Otras propiedades del cliente
  });

  // Cargar los contactos del cliente en el paso 2 del formulario
  this.contactos = clienteSeleccionado.contactos;
}

crearCliente() {
  // Lógica para crear el cliente en la base de datos
}

modificarCliente() {
  // Lógica para modificar el cliente en la base de datos
}


eliminarCliente() {
  // Lógica para eliminar el cliente de la base de datos
} 

buscarCliente() {
  // Lógica para buscar el cliente y cargar los datos

 // Verificar si se ha seleccionado un cliente
 const clienteSeleccionado = this.firstFormGroup.get('BuscarCliente')?.value;

 // Si se ha seleccionado un cliente, habilitar los botones Modificar y Eliminar
 if (clienteSeleccionado) {
   this.modificarEliminarHabilitado = true;
 } else {
   // Si no se ha seleccionado un cliente, deshabilitar los botones Modificar y Eliminar
   this.modificarEliminarHabilitado = false;
 }
}



onInputChange() {
  // Verificar si se han ingresado datos manualmente
  if (this.firstFormGroup.dirty || this.modificarEliminarHabilitado) {
    // Habilitar el botón Modificar y Eliminar
    this.modificarEliminarHabilitado = true;
  } else {
    // Deshabilitar el botón Modificar y Eliminar
    this.modificarEliminarHabilitado = false;
  }
}
}
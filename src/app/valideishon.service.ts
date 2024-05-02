import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValideishonService {

  constructor() { }

  // Método para validar la longitud máxima de un campo de texto
  validarLongitudTexto(texto: string, longitudMaxima: number): boolean {
    return texto.length <= longitudMaxima;
  }

  // Método para validar que un número decimal o entero no tenga más dígitos de los definidos por longitudMaxima
  validarLongitudNumero(numero: number, longitudMaxima: number): boolean {
    const numeroString = numero.toString();
    const partes = numeroString.split('.');
    if (partes[0].length <= longitudMaxima) {
      return true; 
    }
    return false;
  }
}

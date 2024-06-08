import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RptService {

  constructor() { }

  getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360); // Tono aleatorio (0-360)
    const saturation = 50 + Math.floor(Math.random() * 30); // Saturación entre 50% y 80%
    const lightness = 70 + Math.floor(Math.random() * 10); // Luminosidad entre 80% y 90%
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // Devolvemos el color en formato HSL
  }
}

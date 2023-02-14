"use strict" //activo modo estricto
import {Vista} from './vista.js'

export class VistaLiga extends Vista {

	/**
     * Contructor de la clase VistaCategorias
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
	constructor(div, controlador) {
		super(div)
          this.controlador = controlador

          /*Botones pantalla liga*/
		this.btnAnadir = document.getElementById('anaaaaadir')
		this.btnAnadir.onclick = this.pulsarAnadir.bind(this)
	}

     pulsarAnadir(){
          this.controlador.pulsarAlta()
     }
}
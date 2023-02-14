"use strict"
import {VistaLiga} from '../vistas/vistaLiga.js'
import {VistaAlta} from '../vistas/vistaAlta.js'
import {VistaEquipos} from '../vistas/vistaEquipos.js'
import {VistaModTabla} from '../vistas/vistaModTabla.js'
import {VistaModEquipo} from '../vistas/vistaModEquipo.js'
import { VistaListado } from '../vistas/vistaListado.js'
/**
 *	Implementa una vista del menú de navegación del administrador.
 */
export class VistaNav{
	/**
	 *	Constructor de la clase.
	 *	@param {HTMLElement} nav Nav de HTML en el que se desplegará la vista.
	 *	@param {Object} controlador Controlador de la vista del administrador.
	 */
	constructor(nav, controlador) {
		this.controlador = controlador
		this.nav = nav

		/*Botones nav*/
		this.btnLogo = this.nav.getElementsByTagName('li')[0]
		this.btnLiga = this.nav.getElementsByTagName('li')[1]
		this.btnEquipos = this.nav.getElementsByTagName('li')[2]
		this.btnBusqueda = this.nav.getElementsByTagName('li')[3]
		this.btnLogo.onclick = this.pulsarLiga.bind(this)
		this.btnLiga.onclick = this.pulsarLiga.bind(this)
		this.btnEquipos.onclick = this.pulsarEquipos.bind(this)
		this.btnBusqueda.onclick = this.pulsarNavListado.bind(this)
		
	}
	pulsarLiga() {
		this.controlador.pulsarNavLiga()
	}

	pulsarEquipos() {
		this.controlador.pulsarNavEquipos()
	}

	pulsarNavListado() {
		this.controlador.pulsarListado()
	}
}
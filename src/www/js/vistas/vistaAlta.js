"use strict" //activo modo estricto
import { Equipos } from '../modelos/equipos.js'
import {Vista} from './vista.js'

export class VistaAlta extends Vista {

	/**
     * Contructor de la clase VistaAlta
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
	constructor(div, controlador) {
		super(div)
          this.controlador = controlador
          
          this.div = document.getElementById('alta')
          this.escudo =  document.getElementById('inputfile')
          this.valorescudo = null
          this.escudo.addEventListener('change', e => {

               const archivo = this.escudo.files[0]
               const lector = new FileReader()
               lector.addEventListener('load',() => {
                    this.valorescudo = lector.result
               })
               lector.readAsDataURL(archivo)
          })
          /*Botones pantalla liga*/
		this.btnEnviar = this.div.getElementsByTagName('button')[0]
		this.btnEnviar.onclick = this.insertarIndex.bind(this)
	}

     insertarIndex(){
          
          let nombre = this.div.getElementsByTagName('input')[1]
          let valornombre = nombre.value
          
          let descripcion = this.div.getElementsByTagName('textarea')[0]
          let valordescripcion = descripcion.value
          
          let fecha = this.div.getElementsByTagName('input')[2]
          let valorfecha = fecha.value

          let ligas = this.div.getElementsByTagName('input')[3]
          let valorligas = ligas.value

          let colores1 = document.getElementById('coloreees1')
          let colores2 = document.getElementById('coloreees2')
          let colores3 = document.getElementById('coloreees3')
          let colores4 = document.getElementById('coloreees4')
          let colores5 = document.getElementById('coloreees5')
          let colores6 = document.getElementById('coloreees6')

          let colores = []
          colores.push(colores1.checked)
          colores.push(colores2.checked)
          colores.push(colores3.checked)
          colores.push(colores4.checked)
          colores.push(colores5.checked)
          colores.push(colores6.checked)
          if(colores[0]==true){colores[0]='Blanco'}
          if(colores[1]==true){colores[1]='Negro'}
          if(colores[2]==true){colores[2]='Rojo'}
          if(colores[3]==true){colores[3]='Azul'}
          if(colores[4]==true){colores[4]='Verde'}
          if(colores[5]==true){colores[5]='Amarillo'}
               
          let valorascenso=[]
          let ascendido1 = document.getElementById('ascendido1')
          let ascendido2 = document.getElementById('ascendido2')
          valorascenso.push(ascendido1.checked)
          valorascenso.push(ascendido2.checked)
          if(valorascenso[0]==true){valorascenso[0]='Si'}
          if(valorascenso[1]==true){valorascenso[1]='No'}
          
          let comunidad = this.div.getElementsByTagName('select')[0]
          let valorcomunidad = comunidad.value
          let objeto = new Equipos(this.valorescudo,valornombre,valordescripcion,valorfecha,valorligas,colores,valorascenso,valorcomunidad)
          this.controlador.insertar(objeto)
     }

     
}
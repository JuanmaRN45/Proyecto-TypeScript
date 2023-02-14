"use strict" //activo modo estricto
import {Vista} from './vista.js'

export class VistaEquipos extends Vista {

	/**
     * Contructor de la clase VistaEquipos
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
	constructor(div, controlador) {
		super(div)
          this.controlador = controlador
          this.div2 = document.getElementById('liEquipos');
          this.div2.onclick=this.listar.bind(this)
          this.divWonder = document.getElementsByClassName('divWonder')[0]
	}

     listar(){
          while(this.divWonder.firstChild){
               this.divWonder.firstChild.remove()
          }
          const peticion =window.indexedDB.open("WonderLeague")
          peticion.onsuccess= (evento) =>{
               this.bd=evento.target.result;	
               console.log('Base de datos cargada.')
               const objectStore =this.bd.transaction('Equipos', 'readonly').objectStore('Equipos')
               const peticion = objectStore.getAll()
               peticion.onsuccess= (function(){
                    this.lista= peticion.result
                    console.log(this.lista)
                    let i=0
                    for(let listas of this.lista){
                         let contenedor = document.createElement('div')
                         contenedor.classList.add('contenedor')
                         this.divWonder.appendChild(contenedor)

                         let imagen = document.createElement('img')
                         imagen.src = this.lista[i]['escudo']
                         imagen.classList.add('imgEscudo')
                         contenedor.appendChild(imagen)

                         let divNombre = document.createElement('div')
                         divNombre.classList.add('divsFormularios')
                         divNombre.classList.add('partidos')
                         contenedor.appendChild(divNombre)

                         let labelNom = document.createElement('label')
                         labelNom.textContent = 'Nombre: '
                         divNombre.appendChild(labelNom)

                         let pNom = document.createElement('p')
                         pNom.textContent = this.lista[i]['nombre']
                         divNombre.appendChild(pNom)

                         let divDesc = document.createElement('div')
                         divDesc.classList.add('divsFormularios')
                         divDesc.classList.add('puntos')
                         contenedor.appendChild(divDesc)

                         let labelDes = document.createElement('label')
                         labelDes.textContent = 'Descripción: '
                         divDesc.appendChild(labelDes)

                         let pDes = document.createElement('p')
                         pDes.classList.add('descripcion')
                         pDes.textContent = this.lista[i]['descripcion']
                         divDesc.appendChild(pDes)

                         let divfecha = document.createElement('div')
                         divfecha.classList.add('divsFormularios')
                         divfecha.classList.add('goalaverage')
                         contenedor.appendChild(divfecha)

                         let labelfec = document.createElement('label')
                         labelfec.textContent = 'Fecha de Fundación: '
                         divfecha.appendChild(labelfec)

                         let pfec = document.createElement('p')
                         pfec.textContent = this.lista[i]['fechaCreacion']
                         divfecha.appendChild(pfec)

                         let divcom = document.createElement('div')
                         divcom.classList.add('divsFormularios')
                         divcom.classList.add('golesaf')
                         contenedor.appendChild(divcom)

                         let labelcom = document.createElement('label')
                         labelcom.textContent = 'Comunidad Autónoma: '
                         divcom.appendChild(labelcom)

                         let pcom = document.createElement('p')
                         pcom.classList.add('titulos')
                         pcom.textContent = this.lista[i]['comunidad']
                         divcom.appendChild(pcom)

                         let divra = document.createElement('div')
                         divra.classList.add('divsFormularios')
                         divra.classList.add('golesec')
                         contenedor.appendChild(divra)

                         let labelra = document.createElement('label')
                         labelra.textContent = 'Recién Ascendido: '
                         divra.appendChild(labelra)

                         let pra = document.createElement('p')
                         if(this.lista[i]['ascendido'][0]=='Si'){
                              pra.textContent = this.lista[i]['ascendido'][0]
                         }else{
                              pra.textContent = this.lista[i]['ascendido'][1]
                         }
                         divra.appendChild(pra)

                         let divBot = document.createElement('div')
                         divBot.classList.add('divsFormularios')
                         divBot.classList.add('btnEditar')
                         contenedor.appendChild(divBot)

                         let botEd = document.createElement('button')
                         botEd.textContent = 'Editar'
                         divBot.appendChild(botEd)

                         let botEliminar = document.createElement('button')
                         botEliminar.textContent = 'Eliminar'
                         divBot.appendChild(botEliminar)

                         i=i+1
                    }
               }).bind(this)
          }
     }
}
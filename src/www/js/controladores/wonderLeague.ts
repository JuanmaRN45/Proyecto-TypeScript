/**
 * Clase Controlador que administra las vistas
 */
class Controlador {
	/**
	 * Constructor de la clase Controlador
	 * Cuando carga la web ejecuta el método iniciar
	 */

    public modelo:Modelo
    public nav:any
    public vistaNav:VistaNav
    public divLiga:any
    public vistaLiga:VistaLiga
    public divEquipos:any
    public vistaEquipos:VistaEquipos
    public divAlta:any
    public vistaAlta:VistaAlta
    public divModTabla:any
    public vistaModTabla:VistaModTabla
    public divModEquipo:any
    public vistaModEquipo:VistaModEquipo
    public divListado:any
    public vistaListado:VistaListado

	constructor() {
          console.log
		window.onload=this.iniciar.bind(this)
	}

	/**
	 * Método iniciar que es el primero en ejecutarse cuando se carga la pantalla
	 */
	iniciar():void {
		this.modelo=new Modelo(this, this.iniciarVistas.bind(this))
	}

	/**
	 * Método iniciarVistar que se ejecuta al iniciar el modelo
	 */
	iniciarVistas():void {
		this.nav = document.getElementsByTagName('nav')[0]
		this.vistaNav = new VistaNav(this.nav, this)

        this.divLiga = document.getElementById('liga')
        this.vistaLiga = new VistaLiga(this.divLiga, this)

        this.divEquipos = document.getElementById('equipos')
        this.vistaEquipos = new VistaEquipos(this.divEquipos, this)

		this.divAlta=document.getElementById("alta");
		this.vistaAlta=new VistaAlta(this.divAlta, this);

		this.divModTabla = document.getElementById('modTabla')
        this.vistaModTabla = new VistaModTabla(this.divModTabla, this)

		this.divModEquipo = document.getElementById('modEquipo')
		this.vistaModEquipo = new VistaModEquipo(this.divModEquipo, this)

		this.divListado = document.getElementById('listado')
		this.vistaListado = new VistaListado(this.divListado, this)
		this.pulsarNavLiga()
	}

	ocultarVistas():void{
		this.vistaLiga.mostrar(false)
		this.vistaEquipos.mostrar(false)
		this.vistaAlta.mostrar(false)
		this.vistaModTabla.mostrar(false)
		this.vistaModEquipo.mostrar(false)
		this.vistaListado.mostrar(false)
	}
	pulsarNavLiga():void {
		this.ocultarVistas()
		this.vistaLiga.mostrar(true)
	}

	pulsarNavEquipos():void {
		this.ocultarVistas()
		this.vistaEquipos.mostrar(true)
	}

	pulsarModTabla():void {
		this.ocultarVistas()
		this.vistaModTabla.mostrar(true)
	}

	pulsarModEquipo():void {
		this.ocultarVistas()
		this.vistaModEquipo.mostrar(true)
	}

	pulsarAlta():void {
		this.ocultarVistas()
		this.vistaAlta.mostrar(true)
	}

	pulsarListado():void {
		this.ocultarVistas()
		this.vistaListado.mostrar(true)
	}

	insertar(objeto:Equipos):void{
		this.modelo.insertar(objeto, this.insertarOK.bind(this))
	}
	insertarOK():void{
		console.log('La inserción ha ido bien')
	}

	getModelo() {
		return this.modelo
	}
}
const app = new Controlador()

export class Equipos{
	public escudo: string;
	public nombre: string;
	public descripcion: string;
	public fechaCreacion: Date;
	public ligasGanadas: number;
	public colores: [];
	public ascendido: [];
	public comunidad: string;

	constructor(valorescudo: string,valornombre: string,valordescripcion: string,valorfecha: Date,valorligas: number,colores: [],valorascenso: [],valorcomunidad: string){
		this.escudo = valorescudo
		this.nombre = valornombre
		this.descripcion = valordescripcion
		this.fechaCreacion = valorfecha
		this.ligasGanadas = valorligas
		this.colores= colores
		this.ascendido = valorascenso
		this.comunidad = valorcomunidad
	}	
}

class idb{
	public controlador: Controlador;
	public conexion: any;
	constructor(controlador:Controlador) {
        this.controlador=controlador
		const peticion = indexedDB.open('WonderLeague', 2)
        peticion.onerror = evento => {throw 'Error al conectar indexedDB'}
        peticion.onupgradeneeded = (evento:any) => {
				this.conexion = evento.target.result
				this.crear()
            }
        peticion.onsuccess = (evento:any) => {this.conexion = evento.target.result}
    }
    crear(){
        const tabla = this.conexion.createObjectStore('Equipos', {autoIncrement: true})
    }
    insertar(objeto, callback){
        const transaccion = this.conexion.transaction(['Equipos'], 'readwrite')
        transaccion.onerror = evento => {throw 'Error al insertar'}
        const tabla = transaccion.objectStore('Equipos')
        const peticion = tabla.add(objeto)
        peticion.onsuccess = callback
        this.controlador.pulsarNavLiga()
    }
}

class Modelo{
	public controlador: Controlador;
	public callback: any;
	public callbacks: any;
	public idb: idb;

	constructor(controlador:Controlador, callback) {
		this.controlador = controlador
		this.callback = callback
		this.callbacks = []	// Array de callbacks para implementar el observador
		callback()
		this.idb = new idb(this.controlador)
	}
	
	/**
	* Método registrar que registra un objeto para informarle de los cambios en el Modelo
	* @param {Function} Función de callback que será llamada cuando cambien los datos
	*/
	registrar(callback) {
        this.callbacks.push(callback)
	}

	/**
	* Método avisar que ejecuta todos los callback registrados.
	*/
	avisar() {
	    for(let callback of this.callbacks) {
			callback()
		}
	}

	insertar(objeto:Equipos,callback){
		this.idb.insertar(objeto,callback)
	}
}

class Vista{
	public div: HTMLDivElement;

	/**
	 * Contructor de la clase Vista
	 * @param {Objeto} divinicio div de la vista
	 */
	constructor(divinicio:HTMLDivElement){
		this.div=divinicio
	}
	
	/**
	 * Método mostrar que pone el div de la Vista visualizándose u ocultándolo
	 * @param {boolean} ver recibe un true o un false
	 */
	mostrar(ver:Boolean){
		if(ver){
			this.div.style.display='block'
		}
		else{
			this.div.style.display='none'
		}
	}
}

class VistaAlta extends Vista {
	public controlador: any;
	public div: any;
	public escudo: any;
	public valorescudo: any;
	public btnEnviar: any;

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

          let colores1 = document.getElementById('coloreees1') as HTMLInputElement;
          let colores2 = document.getElementById('coloreees2')as HTMLInputElement;
          let colores3 = document.getElementById('coloreees3')as HTMLInputElement;
          let colores4 = document.getElementById('coloreees4')as HTMLInputElement;
          let colores5 = document.getElementById('coloreees5')as HTMLInputElement;
          let colores6 = document.getElementById('coloreees6')as HTMLInputElement;

          let colores:any = []
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
               
          let valorascenso:any=[]
          let ascendido1 = document.getElementById('ascendido1')as HTMLInputElement;
          let ascendido2 = document.getElementById('ascendido2')as HTMLInputElement;
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

class VistaEquipos extends Vista {
	public controlador: any;
	public div2: any;
	public divWonder: any;
	public bd: any;
	public lista: any;

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
          peticion.onsuccess= (evento:any) =>{
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

class VistaLiga extends Vista {
	public controlador: any;
	public btnAnadir: any;

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

class VistaNav{
	public controlador: any;
	public nav: any;
	public btnLogo: any;
	public btnLiga: any;
	public btnEquipos: any;
	public btnBusqueda: any;

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

class VistaListado extends Vista {
	public controlador: any;

	/**
     * Contructor de la clase VistaCategorias
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
	constructor(div, controlador) {
		super(div)
          this.controlador = controlador
	}
}

class VistaModEquipo extends Vista {
	public controlador: any;

	/**
     * Contructor de la clase VistaCategorias
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
	constructor(div, controlador) {
		super(div)
          this.controlador = controlador
	}
}

class VistaModTabla extends Vista {
	public controlador: any;

	/**
     * Contructor de la clase VistaCategorias
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
	constructor(div, controlador) {
		super(div)
          this.controlador = controlador
	}
}

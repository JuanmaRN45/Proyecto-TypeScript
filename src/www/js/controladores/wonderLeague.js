"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Clase Controlador que administra las vistas
 */
var Controlador = /** @class */ (function () {
    function Controlador() {
        console.log;
        window.onload = this.iniciar.bind(this);
    }
    /**
     * Método iniciar que es el primero en ejecutarse cuando se carga la pantalla
     */
    Controlador.prototype.iniciar = function () {
        this.modelo = new Modelo(this, this.iniciarVistas.bind(this));
    };
    /**
     * Método iniciarVistar que se ejecuta al iniciar el modelo
     */
    Controlador.prototype.iniciarVistas = function () {
        this.nav = document.getElementsByTagName('nav')[0];
        this.vistaNav = new VistaNav(this.nav, this);
        this.divLiga = document.getElementById('liga');
        this.vistaLiga = new VistaLiga(this.divLiga, this);
        this.divEquipos = document.getElementById('equipos');
        this.vistaEquipos = new VistaEquipos(this.divEquipos, this);
        this.divAlta = document.getElementById("alta");
        this.vistaAlta = new VistaAlta(this.divAlta, this);
        this.divModTabla = document.getElementById('modTabla');
        this.vistaModTabla = new VistaModTabla(this.divModTabla, this);
        this.divModEquipo = document.getElementById('modEquipo');
        this.vistaModEquipo = new VistaModEquipo(this.divModEquipo, this);
        this.divListado = document.getElementById('listado');
        this.vistaListado = new VistaListado(this.divListado, this);
        this.pulsarNavLiga();
    };
    Controlador.prototype.ocultarVistas = function () {
        this.vistaLiga.mostrar(false);
        this.vistaEquipos.mostrar(false);
        this.vistaAlta.mostrar(false);
        this.vistaModTabla.mostrar(false);
        this.vistaModEquipo.mostrar(false);
        this.vistaListado.mostrar(false);
    };
    Controlador.prototype.pulsarNavLiga = function () {
        this.ocultarVistas();
        this.vistaLiga.mostrar(true);
    };
    Controlador.prototype.pulsarNavEquipos = function () {
        this.ocultarVistas();
        this.vistaEquipos.mostrar(true);
    };
    Controlador.prototype.pulsarModTabla = function () {
        this.ocultarVistas();
        this.vistaModTabla.mostrar(true);
    };
    Controlador.prototype.pulsarModEquipo = function () {
        this.ocultarVistas();
        this.vistaModEquipo.mostrar(true);
    };
    Controlador.prototype.pulsarAlta = function () {
        this.ocultarVistas();
        this.vistaAlta.mostrar(true);
    };
    Controlador.prototype.pulsarListado = function () {
        this.ocultarVistas();
        this.vistaListado.mostrar(true);
    };
    Controlador.prototype.insertar = function (objeto) {
        this.modelo.insertar(objeto, this.insertarOK.bind(this));
    };
    Controlador.prototype.insertarOK = function () {
        console.log('La inserción ha ido bien');
    };
    Controlador.prototype.getModelo = function () {
        return this.modelo;
    };
    return Controlador;
}());
var app = new Controlador();
var Equipos = /** @class */ (function () {
    function Equipos(valorescudo, valornombre, valordescripcion, valorfecha, valorligas, colores, valorascenso, valorcomunidad) {
        this.escudo = valorescudo;
        this.nombre = valornombre;
        this.descripcion = valordescripcion;
        this.fechaCreacion = valorfecha;
        this.ligasGanadas = valorligas;
        this.colores = colores;
        this.ascendido = valorascenso;
        this.comunidad = valorcomunidad;
    }
    return Equipos;
}());
var idb = /** @class */ (function () {
    function idb(controlador) {
        var _this = this;
        this.controlador = controlador;
        var peticion = indexedDB.open('WonderLeague', 2);
        peticion.onerror = function (evento) { throw 'Error al conectar indexedDB'; };
        peticion.onupgradeneeded = function (evento) {
            _this.conexion = evento.target.result;
            _this.crear();
        };
        peticion.onsuccess = function (evento) { _this.conexion = evento.target.result; };
    }
    idb.prototype.crear = function () {
        var tabla = this.conexion.createObjectStore('Equipos', { keyPath: 'id', autoIncrement: true });
    };
    idb.prototype.insertar = function (objeto, callback) {
        var transaccion = this.conexion.transaction(['Equipos'], 'readwrite');
        transaccion.onerror = function (evento) { throw 'Error al insertar'; };
        var tabla = transaccion.objectStore('Equipos');
        var peticion = tabla.add(objeto);
        peticion.onsuccess = callback;
        this.controlador.pulsarNavLiga();
    };
    return idb;
}());
var Modelo = /** @class */ (function () {
    function Modelo(controlador, callback) {
        this.controlador = controlador;
        this.callback = callback;
        this.callbacks = []; // Array de callbacks para implementar el observador
        callback();
        this.idb = new idb(this.controlador);
    }
    /**
    * Método registrar que registra un objeto para informarle de los cambios en el Modelo
    * @param {Function} Función de callback que será llamada cuando cambien los datos
    */
    Modelo.prototype.registrar = function (callback) {
        this.callbacks.push(callback);
    };
    /**
    * Método avisar que ejecuta todos los callback registrados.
    */
    Modelo.prototype.avisar = function () {
        for (var _i = 0, _a = this.callbacks; _i < _a.length; _i++) {
            var callback = _a[_i];
            callback();
        }
    };
    Modelo.prototype.insertar = function (objeto, callback) {
        this.idb.insertar(objeto, callback);
    };
    return Modelo;
}());
var Vista = /** @class */ (function () {
    /**
     * Contructor de la clase Vista
     * @param {Objeto} divinicio div de la vista
     */
    function Vista(divinicio) {
        this.div = divinicio;
    }
    /**
     * Método mostrar que pone el div de la Vista visualizándose u ocultándolo
     * @param {boolean} ver recibe un true o un false
     */
    Vista.prototype.mostrar = function (ver) {
        if (ver) {
            this.div.style.display = 'block';
        }
        else {
            this.div.style.display = 'none';
        }
    };
    return Vista;
}());
var VistaAlta = /** @class */ (function (_super) {
    __extends(VistaAlta, _super);
    /**
     * Contructor de la clase VistaAlta
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
    function VistaAlta(div, controlador) {
        var _this = _super.call(this, div) || this;
        _this.controlador = controlador;
        _this.div = document.getElementById('alta');
        _this.escudo = document.getElementById('inputfile');
        _this.valorescudo = null;
        _this.escudo.addEventListener('change', function (e) {
            var archivo = _this.escudo.files[0];
            var lector = new FileReader();
            lector.addEventListener('load', function () {
                _this.valorescudo = lector.result;
            });
            lector.readAsDataURL(archivo);
        });
        /*Botones pantalla liga*/
        _this.btnEnviar = _this.div.getElementsByTagName('button')[0];
        _this.btnEnviar.onclick = _this.insertarIndex.bind(_this);
        return _this;
    }
    VistaAlta.prototype.insertarIndex = function () {
        var nombre = this.div.getElementsByTagName('input')[1];
        var valornombre = nombre.value;
        var descripcion = this.div.getElementsByTagName('textarea')[0];
        var valordescripcion = descripcion.value;
        var fecha = this.div.getElementsByTagName('input')[2];
        var valorfecha = fecha.value;
        var ligas = this.div.getElementsByTagName('input')[3];
        var valorligas = ligas.value;
        var colores1 = document.getElementById('coloreees1');
        var colores2 = document.getElementById('coloreees2');
        var colores3 = document.getElementById('coloreees3');
        var colores4 = document.getElementById('coloreees4');
        var colores5 = document.getElementById('coloreees5');
        var colores6 = document.getElementById('coloreees6');
        var colores = [];
        colores.push(colores1.checked);
        colores.push(colores2.checked);
        colores.push(colores3.checked);
        colores.push(colores4.checked);
        colores.push(colores5.checked);
        colores.push(colores6.checked);
        if (colores[0] == true) {
            colores[0] = 'Blanco';
        }
        if (colores[1] == true) {
            colores[1] = 'Negro';
        }
        if (colores[2] == true) {
            colores[2] = 'Rojo';
        }
        if (colores[3] == true) {
            colores[3] = 'Azul';
        }
        if (colores[4] == true) {
            colores[4] = 'Verde';
        }
        if (colores[5] == true) {
            colores[5] = 'Amarillo';
        }
        var valorascenso = [];
        var ascendido1 = document.getElementById('ascendido1');
        var ascendido2 = document.getElementById('ascendido2');
        valorascenso.push(ascendido1.checked);
        valorascenso.push(ascendido2.checked);
        if (valorascenso[0] == true) {
            valorascenso[0] = 'Si';
        }
        if (valorascenso[1] == true) {
            valorascenso[1] = 'No';
        }
        var comunidad = this.div.getElementsByTagName('select')[0];
        var valorcomunidad = comunidad.value;
        var objeto = new Equipos(this.valorescudo, valornombre, valordescripcion, valorfecha, valorligas, colores, valorascenso, valorcomunidad);
        this.controlador.insertar(objeto);
    };
    return VistaAlta;
}(Vista));
var VistaEquipos = /** @class */ (function (_super) {
    __extends(VistaEquipos, _super);
    /**
     * Contructor de la clase VistaEquipos
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
    function VistaEquipos(div, controlador) {
        var _this = _super.call(this, div) || this;
        _this.controlador = controlador;
        _this.div2 = document.getElementById('liEquipos');
        _this.div2.onclick = _this.listar.bind(_this);
        _this.divWonder = document.getElementsByClassName('divWonder')[0];
        return _this;
    }
    VistaEquipos.prototype.listar = function () {
        var _this = this;
        while (this.divWonder.firstChild) {
            this.divWonder.firstChild.remove();
        }
        var peticion = window.indexedDB.open("WonderLeague");
        peticion.onsuccess = function (evento) {
            _this.bd = evento.target.result;
            console.log('Base de datos cargada.');
            var objectStore = _this.bd.transaction('Equipos', 'readonly').objectStore('Equipos');
            var peticion = objectStore.getAll();
            peticion.onsuccess = (function () {
                this.lista = peticion.result;
                console.log(this.lista);
                var i = 0;
                for (var _i = 0, _a = this.lista; _i < _a.length; _i++) {
                    var listas = _a[_i];
                    var contenedor = document.createElement('div');
                    contenedor.classList.add('contenedor');
                    this.divWonder.appendChild(contenedor);
                    var imagen = document.createElement('img');
                    imagen.src = this.lista[i]['escudo'];
                    imagen.classList.add('imgEscudo');
                    contenedor.appendChild(imagen);
                    var divNombre = document.createElement('div');
                    divNombre.classList.add('divsFormularios');
                    divNombre.classList.add('partidos');
                    contenedor.appendChild(divNombre);
                    var labelNom = document.createElement('label');
                    labelNom.textContent = 'Nombre: ';
                    divNombre.appendChild(labelNom);
                    var pNom = document.createElement('p');
                    pNom.textContent = this.lista[i]['nombre'];
                    divNombre.appendChild(pNom);
                    var divDesc = document.createElement('div');
                    divDesc.classList.add('divsFormularios');
                    divDesc.classList.add('puntos');
                    contenedor.appendChild(divDesc);
                    var labelDes = document.createElement('label');
                    labelDes.textContent = 'Descripción: ';
                    divDesc.appendChild(labelDes);
                    var pDes = document.createElement('p');
                    pDes.classList.add('descripcion');
                    pDes.textContent = this.lista[i]['descripcion'];
                    divDesc.appendChild(pDes);
                    var divfecha = document.createElement('div');
                    divfecha.classList.add('divsFormularios');
                    divfecha.classList.add('goalaverage');
                    contenedor.appendChild(divfecha);
                    var labelfec = document.createElement('label');
                    labelfec.textContent = 'Fecha de Fundación: ';
                    divfecha.appendChild(labelfec);
                    var pfec = document.createElement('p');
                    pfec.textContent = this.lista[i]['fechaCreacion'];
                    divfecha.appendChild(pfec);
                    var divcom = document.createElement('div');
                    divcom.classList.add('divsFormularios');
                    divcom.classList.add('golesaf');
                    contenedor.appendChild(divcom);
                    var labelcom = document.createElement('label');
                    labelcom.textContent = 'Comunidad Autónoma: ';
                    divcom.appendChild(labelcom);
                    var pcom = document.createElement('p');
                    pcom.classList.add('titulos');
                    pcom.textContent = this.lista[i]['comunidad'];
                    divcom.appendChild(pcom);
                    var divra = document.createElement('div');
                    divra.classList.add('divsFormularios');
                    divra.classList.add('golesec');
                    contenedor.appendChild(divra);
                    var labelra = document.createElement('label');
                    labelra.textContent = 'Recién Ascendido: ';
                    divra.appendChild(labelra);
                    var pra = document.createElement('p');
                    if (this.lista[i]['ascendido'][0] == 'Si') {
                        pra.textContent = this.lista[i]['ascendido'][0];
                    }
                    else {
                        pra.textContent = this.lista[i]['ascendido'][1];
                    }
                    divra.appendChild(pra);
                    var divBot = document.createElement('div');
                    divBot.classList.add('divsFormularios');
                    divBot.classList.add('btnEditar');
                    contenedor.appendChild(divBot);
                    var botEd = document.createElement('button');
                    botEd.textContent = 'Editar';
                    divBot.appendChild(botEd);
                    var botEliminar = document.createElement('button');
                    botEliminar.textContent = 'Eliminar';
                    divBot.appendChild(botEliminar);
                    //botEliminar.onclick=this.borrar(this.lista[i]['id']);
                    i = i + 1;
                }
            }).bind(_this);
        };
    };
    return VistaEquipos;
}(Vista));
var VistaLiga = /** @class */ (function (_super) {
    __extends(VistaLiga, _super);
    /**
     * Contructor de la clase VistaCategorias
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
    function VistaLiga(div, controlador) {
        var _this = _super.call(this, div) || this;
        _this.controlador = controlador;
        /*Botones pantalla liga*/
        _this.btnAnadir = document.getElementById('anaaaaadir');
        _this.btnAnadir.onclick = _this.pulsarAnadir.bind(_this);
        return _this;
    }
    VistaLiga.prototype.pulsarAnadir = function () {
        this.controlador.pulsarAlta();
    };
    return VistaLiga;
}(Vista));
var VistaNav = /** @class */ (function () {
    /**
     *	Constructor de la clase.
     *	@param {HTMLElement} nav Nav de HTML en el que se desplegará la vista.
     *	@param {Object} controlador Controlador de la vista del administrador.
     */
    function VistaNav(nav, controlador) {
        this.controlador = controlador;
        this.nav = nav;
        /*Botones nav*/
        this.btnLogo = this.nav.getElementsByTagName('li')[0];
        this.btnLiga = this.nav.getElementsByTagName('li')[1];
        this.btnEquipos = this.nav.getElementsByTagName('li')[2];
        this.btnBusqueda = this.nav.getElementsByTagName('li')[3];
        this.btnLogo.onclick = this.pulsarLiga.bind(this);
        this.btnLiga.onclick = this.pulsarLiga.bind(this);
        this.btnEquipos.onclick = this.pulsarEquipos.bind(this);
        this.btnBusqueda.onclick = this.pulsarNavListado.bind(this);
    }
    VistaNav.prototype.pulsarLiga = function () {
        this.controlador.pulsarNavLiga();
    };
    VistaNav.prototype.pulsarEquipos = function () {
        this.controlador.pulsarNavEquipos();
    };
    VistaNav.prototype.pulsarNavListado = function () {
        this.controlador.pulsarListado();
    };
    return VistaNav;
}());
var VistaListado = /** @class */ (function (_super) {
    __extends(VistaListado, _super);
    /**
     * Contructor de la clase VistaCategorias
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
    function VistaListado(div, controlador) {
        var _this = _super.call(this, div) || this;
        _this.controlador = controlador;
        return _this;
    }
    return VistaListado;
}(Vista));
var VistaModEquipo = /** @class */ (function (_super) {
    __extends(VistaModEquipo, _super);
    /**
     * Contructor de la clase VistaCategorias
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
    function VistaModEquipo(div, controlador) {
        var _this = _super.call(this, div) || this;
        _this.controlador = controlador;
        return _this;
    }
    return VistaModEquipo;
}(Vista));
var VistaModTabla = /** @class */ (function (_super) {
    __extends(VistaModTabla, _super);
    /**
     * Contructor de la clase VistaCategorias
     * @param {HTMLDivElement} div Div de la vista
     * @param {Object} controlador Controlador de la vista
     */
    function VistaModTabla(div, controlador) {
        var _this = _super.call(this, div) || this;
        _this.controlador = controlador;
        return _this;
    }
    return VistaModTabla;
}(Vista));

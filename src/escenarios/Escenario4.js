/**
 * Escenario 4: Integrales Indefinidas + Cambio de Variable
 * Módulo educativo que combina dos temas fundamentales del cálculo integral
 */
import { Escenario } from './Escenario.js'

export class Escenario4 extends Escenario {
    constructor() {
        super('Escenario 4: Integrales Indefinidas + Cambio de Variable', 'Módulo educativo que combina integrales indefinidas y cambio de variable')
        
        // Configurar el escenario
        this.temasDisponibles = ['integrales_indefinidas', 'cambio_variable']
        this.seccionesDisponibles = ['teoria', 'visualizacion', 'ejemplos']
        
        // Estado del escenario
        this.estado = {
            temaActivo: 'integrales_indefinidas',
            seccionActiva: 'teoria',
            funcionSeleccionada: 'x^2',
            constanteC: 0,
            tipoTransformacion: 'linear',
            valorTransformacion: 1
        }
    }

    inicializar() {
        // Inicialización específica del escenario 4
        this.configurarFunciones()
        this.configurarTransformaciones()
    }

    configurarFunciones() {
        this.funcionesDisponibles = [
            { id: 'x^2', nombre: 'x²', expresion: 'x^2', evaluar: (x) => x * x },
            { id: 'x^3', nombre: 'x³', expresion: 'x^3', evaluar: (x) => x * x * x },
            { id: 'x^4', nombre: 'x⁴', expresion: 'x^4', evaluar: (x) => Math.pow(x, 4) },
            { id: 'sin(x)', nombre: 'sin(x)', expresion: 'sin(x)', evaluar: (x) => Math.sin(x) },
            { id: 'cos(x)', nombre: 'cos(x)', expresion: 'cos(x)', evaluar: (x) => Math.cos(x) },
            { id: 'e^x', nombre: 'eˣ', expresion: 'e^x', evaluar: (x) => Math.exp(x) },
            { id: '1/x', nombre: '1/x', expresion: '1/x', evaluar: (x) => 1 / x }
        ]
    }

    configurarTransformaciones() {
        this.transformacionesDisponibles = [
            { id: 'linear', nombre: 'Lineal', formula: 'u = x + C', descripcion: 'Transformación lineal simple' },
            { id: 'quadratic', nombre: 'Cuadrática', formula: 'u = x² + C', descripcion: 'Transformación cuadrática' },
            { id: 'exponential', nombre: 'Exponencial', formula: 'u = eˣ + C', descripcion: 'Transformación exponencial' },
            { id: 'sine', nombre: 'Sinusoidal', formula: 'u = sin(x) + C', descripcion: 'Transformación sinusoidal' }
        ]
    }

    // Métodos de navegación
    cambiarTema(tema) {
        if (this.temasDisponibles.includes(tema)) {
            this.estado.temaActivo = tema
        }
    }

    cambiarSeccion(seccion) {
        if (this.seccionesDisponibles.includes(seccion)) {
            this.estado.seccionActiva = seccion
        }
    }

    // Métodos para Integrales Indefinidas
    seleccionarFuncion(funcion) {
        this.estado.funcionSeleccionada = funcion
    }

    ajustarConstanteC(valor) {
        this.estado.constanteC = valor
    }

    // Métodos para Cambio de Variable
    seleccionarTipoTransformacion(tipo) {
        this.estado.tipoTransformacion = tipo
    }

    ajustarValorTransformacion(valor) {
        this.estado.valorTransformacion = valor
    }

    // Obtener información
    obtenerEstadoActual() {
        return this.estado
    }

    obtenerFuncionesDisponibles() {
        return this.funcionesDisponibles
    }

    obtenerTransformacionesDisponibles() {
        return this.transformacionesDisponibles
    }

    obtenerTemaActivo() {
        return this.estado.temaActivo
    }

    obtenerSeccionActiva() {
        return this.estado.seccionActiva
    }
}


/**
 * ENTIDAD: Logro
 * RESPONSABILIDAD: Representar un logro o certificación que puede obtener un estudiante
 * SRP: Solo maneja los datos y comportamiento de un logro individual
 */
export class Logro {
  constructor(datos) {
    this.id = datos.id || this.generarId()
    this.nombre = datos.nombre
    this.descripcion = datos.descripcion
    this.tipo = datos.tipo // 'tiempo', 'completitud', 'especial', 'secuencial'
    this.criterios = datos.criterios || {}
    this.icono = datos.icono || '🏆'
    this.color = datos.color || 'gold'
    this.puntos = datos.puntos || 10
    this.raridad = datos.raridad || 'comun' // 'comun', 'raro', 'epico', 'legendario'
    this.fechaCreacion = datos.fechaCreacion || new Date()
    this.activo = datos.activo !== undefined ? datos.activo : true
  }

  generarId() {
    return 'logro_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  verificarCriterios(progresoEstudiante) {
    switch (this.tipo) {
      case 'tiempo':
        return this.verificarCriteriosTiempo(progresoEstudiante)
      case 'completitud':
        return this.verificarCriteriosCompletitud(progresoEstudiante)
      case 'especial':
        return this.verificarCriteriosEspeciales(progresoEstudiante)
      case 'secuencial':
        return this.verificarCriteriosSecuenciales(progresoEstudiante)
      default:
        return false
    }
  }

  verificarCriteriosTiempo(progreso) {
    const tiempoRequerido = this.criterios.tiempoMinimo || 0
    return progreso.tiempoTotal >= tiempoRequerido
  }

  verificarCriteriosCompletitud(progreso) {
    const escenariosRequeridos = this.criterios.escenariosCompletados || []
    return escenariosRequeridos.every(escenario => 
      progreso.escenariosCompletados.includes(escenario)
    )
  }

  verificarCriteriosEspeciales(progreso) {
    // Logros especiales como "Primer Acceso", "Explorador", etc.
    switch (this.id) {
      case 'primer_acceso':
        return progreso.historialActividad.length === 1
      case 'explorador':
        return progreso.historialActividad.length >= 10
      case 'persistente':
        return progreso.tiempoTotal >= 3600000 // 1 hora
      case 'jardin_limites':
        // Verificar cambios de límites en el Jardín de Riemann
        const cambiosLimites = progreso.cambiosLimites || 0
        return cambiosLimites >= (this.criterios.cambiosLimites || 3)
      case 'jardin_funciones':
        // Verificar funciones probadas en el Jardín de Riemann
        const funcionesProbadas = progreso.funcionesProbadas || 0
        return funcionesProbadas >= (this.criterios.funcionesProbadas || 3)
      case 'jardin_hechizos':
        // Verificar hechizos usados en el Jardín de Riemann
        const hechizosUsados = progreso.hechizosUsados || 0
        return hechizosUsados >= (this.criterios.hechizosUsados || 2)
      case 'jardin_precision':
        // Verificar precisión en el Jardín de Riemann
        const precisionJardinRequerida = this.criterios.precisionMinima || 95
        return progreso.precisionJardin >= precisionJardinRequerida
      case 'jardin_macetas':
        // Verificar uso de macetas en el Jardín de Riemann
        const macetasRequeridas = this.criterios.macetasMinimas || 10
        return progreso.macetasUsadas >= macetasRequeridas
      case 'puente_limites':
        // Verificar cambios de límites en el Puente del Teorema Fundamental
        const cambiosLimitesPuente = progreso.cambiosLimitesPuente || 0
        return cambiosLimitesPuente >= (this.criterios.cambiosLimites || 3)
      case 'cazador_c':
        // Verificar que se encontró el punto c del teorema del valor medio
        console.log(`🎯 Verificando Cazador de C: puntoCEncontrado=${progreso.puntoCEncontrado}`)
        return progreso.puntoCEncontrado === true
      case 'estimador_preciso':
        // Verificar precisión de estimación del punto c
        const precisionEstimacionRequerida = this.criterios.precisionEstimacion || 95
        const precisionActual = progreso.precisionEstimacion || 0
        console.log(`🎯 Verificando Estimador Preciso: precisión actual=${precisionActual}, requerida=${precisionEstimacionRequerida}`)
        return precisionActual >= precisionEstimacionRequerida
      case 'maestro_estimacion':
        // Verificar estimaciones realizadas en el teorema del valor medio
        const estimacionesRealizadas = progreso.estimacionesRealizadas || 0
        const estimacionesRequeridas = this.criterios.estimacionesRealizadas || 3
        console.log(`🎯 Verificando Maestro de Estimación: estimaciones actuales=${estimacionesRealizadas}, requeridas=${estimacionesRequeridas}`)
        return estimacionesRealizadas >= estimacionesRequeridas
      case 'explorador_funciones':
        // Verificar funciones probadas en el teorema del valor medio
        const funcionesProbadasTorre = progreso.funcionesProbadasTorre || 0
        const funcionesRequeridas = this.criterios.funcionesProbadas || 3
        console.log(`🎯 Verificando Explorador de Funciones: funciones actuales=${funcionesProbadasTorre}, requeridas=${funcionesRequeridas}`)
        return funcionesProbadasTorre >= funcionesRequeridas
      default:
        return false
    }
  }

  verificarCriteriosSecuenciales(progreso) {
    const secuenciaRequerida = this.criterios.secuencia || []
    const historial = progreso.historialActividad || []
    
    // Verificar si el estudiante completó los escenarios en el orden requerido
    let indiceSecuencia = 0
    for (const actividad of historial) {
      if (actividad.escenario === secuenciaRequerida[indiceSecuencia]) {
        indiceSecuencia++
        if (indiceSecuencia === secuenciaRequerida.length) {
      return true
        }
      }
    }
    return false
  }

  obtenerColorRaridad() {
    const colores = {
      'comun': 'text-gray-500',
      'raro': 'text-blue-500',
      'epico': 'text-purple-500',
      'legendario': 'text-yellow-500'
    }
    return colores[this.raridad] || colores.comun
  }

  obtenerFondoRaridad() {
    const fondos = {
      'comun': 'bg-gray-100',
      'raro': 'bg-blue-100',
      'epico': 'bg-purple-100',
      'legendario': 'bg-yellow-100'
    }
    return fondos[this.raridad] || fondos.comun
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      tipo: this.tipo,
      criterios: this.criterios,
      icono: this.icono,
      color: this.color,
      puntos: this.puntos,
      raridad: this.raridad,
      fechaCreacion: this.fechaCreacion,
      activo: this.activo
    }
  }
}
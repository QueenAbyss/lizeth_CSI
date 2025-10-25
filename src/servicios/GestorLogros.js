/**
 * SERVICIO: GestorLogros
 * RESPONSABILIDAD: Gestionar el sistema de logros y certificaciones
 * SRP: Solo maneja la lógica de logros, no almacena datos persistentes
 */
import { Logro } from '../entidades/Logro.js'
import { ServicioAutenticacion } from './ServicioAutenticacion.js'

export class GestorLogros {
  constructor() {
    this.servicioAuth = new ServicioAutenticacion()
    this.logros = this.inicializarLogros()
  }

  inicializarLogros() {
    const logrosBase = [
      // Logros de tiempo
      new Logro({
        id: 'primer_paso',
        nombre: 'Primer Paso',
        descripcion: 'Completa tu primera actividad en la plataforma',
        tipo: 'especial',
        icono: '👶',
        puntos: 5,
        raridad: 'comun'
      }),
      
      new Logro({
        id: 'explorador',
        nombre: 'Explorador',
        descripcion: 'Realiza 10 actividades diferentes',
        tipo: 'especial',
        criterios: { actividadesMinimas: 10 },
        icono: '🔍',
        puntos: 15,
        raridad: 'raro'
      }),

      new Logro({
        id: 'persistente',
        nombre: 'Persistente',
        descripcion: 'Dedica más de 1 hora a la plataforma',
        tipo: 'tiempo',
        criterios: { tiempoMinimo: 3600000 }, // 1 hora en ms
        icono: '⏰',
        puntos: 25,
        raridad: 'raro'
      }),

      // Logros de completitud
      new Logro({
        id: 'jardin_master',
        nombre: 'Maestro del Jardín',
        descripcion: 'Completa el Jardín de Riemann',
        tipo: 'completitud',
        criterios: { escenariosCompletados: ['jardinRiemann'] },
        icono: '🌱',
        puntos: 20,
        raridad: 'raro'
      }),

      // Logros específicos del Jardín de Riemann
      new Logro({
        id: 'jardin_limites',
        nombre: 'Manipulador de Límites',
        descripcion: 'Cambia los límites de integración en el Jardín de Riemann',
        tipo: 'especial',
        criterios: { 
          escenario: 'jardin-riemann',
          cambiosLimites: 3
        },
        icono: '📏',
        puntos: 15,
        raridad: 'comun'
      }),

      new Logro({
        id: 'jardin_precision',
        nombre: 'Precisión del Jardín',
        descripcion: 'Alcanza una precisión del 80% en el Jardín de Riemann',
        tipo: 'especial',
        criterios: { 
          escenario: 'jardin-riemann',
          precisionMinima: 80
        },
        icono: '🎯',
        puntos: 20,
        raridad: 'raro'
      }),

      new Logro({
        id: 'jardin_macetas',
        nombre: 'Maestro de Macetas',
        descripcion: 'Usa más de 5 macetas en el Jardín de Riemann',
        tipo: 'especial',
        criterios: { 
          escenario: 'jardin-riemann',
          macetasMinimas: 5
        },
        icono: '🪴',
        puntos: 18,
        raridad: 'raro'
      }),

      new Logro({
        id: 'jardin_funciones',
        nombre: 'Explorador de Funciones',
        descripcion: 'Prueba diferentes funciones en el Jardín de Riemann',
        tipo: 'especial',
        criterios: { 
          escenario: 'jardin-riemann',
          funcionesProbadas: 3
        },
        icono: '📈',
        puntos: 16,
        raridad: 'comun'
      }),

      new Logro({
        id: 'jardin_hechizos',
        nombre: 'Maestro de Hechizos',
        descripcion: 'Usa diferentes tipos de hechizos en el Jardín de Riemann',
        tipo: 'especial',
        criterios: { 
          escenario: 'jardin-riemann',
          hechizosUsados: 2
        },
        icono: '✨',
        puntos: 17,
        raridad: 'comun'
      }),

      new Logro({
        id: 'puente_crosser',
        nombre: 'Cruzador de Puentes',
        descripcion: 'Completa el Puente del Teorema Fundamental',
        tipo: 'completitud',
        criterios: { escenariosCompletados: ['puenteTeorema'] },
        icono: '🌉',
        puntos: 20,
        raridad: 'raro'
      }),

      new Logro({
        id: 'puente_limites',
        nombre: 'Manipulador de Límites',
        descripcion: 'Mueve los límites de integración en el Puente del Teorema',
        tipo: 'especial',
        criterios: { 
          escenario: 'puenteTeorema',
          cambiosLimites: 3
        },
        icono: '📏',
        puntos: 15,
        raridad: 'comun'
      }),

      new Logro({
        id: 'torre_climber',
        nombre: 'Escalador de Torres',
        descripcion: 'Completa la Torre del Valor Medio',
        tipo: 'completitud',
        criterios: { escenariosCompletados: ['torreValorMedio'] },
        icono: '🏗️',
        puntos: 20,
        raridad: 'raro'
      }),

      new Logro({
        id: 'cristal_finder',
        nombre: 'Buscador de Cristales',
        descripcion: 'Completa el Cristal de Antiderivadas',
        tipo: 'completitud',
        criterios: { escenariosCompletados: ['cristalAntiderivadas'] },
        icono: '💎',
        puntos: 20,
        raridad: 'raro'
      }),

      // Logros del Segundo Teorema Fundamental
      new Logro({
        id: 'primera_antiderivada',
        nombre: 'Primera Antiderivada',
        descripcion: 'Encuentra tu primera antiderivada correcta',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'segundo-teorema',
          pasoCompletado: 'antiderivada'
        },
        icono: '🎯',
        puntos: 10,
        raridad: 'comun'
      }),

      new Logro({
        id: 'calculador_experto',
        nombre: 'Calculador Experto',
        descripcion: 'Calcula F(b) - F(a) correctamente',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'segundo-teorema',
          pasoCompletado: 'evaluacion'
        },
        icono: '⭐',
        puntos: 15,
        raridad: 'raro'
      }),

      new Logro({
        id: 'verificador',
        nombre: 'Verificador',
        descripcion: 'Completa los 4 pasos del teorema',
        tipo: 'completitud',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'segundo-teorema',
          pasosCompletados: 4
        },
        icono: '🛡️',
        puntos: 25,
        raridad: 'raro'
      }),

      // Logros específicos del Teorema del Valor Medio
      new Logro({
        id: 'cazador_c',
        nombre: 'Cazador de C',
        descripcion: 'Encuentra el punto c del teorema del valor medio',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'valor-medio',
          puntoCEncontrado: true
        },
        icono: '🎯',
        puntos: 15,
        raridad: 'comun'
      }),

      new Logro({
        id: 'estimador_preciso',
        nombre: 'Estimador Preciso',
        descripcion: 'Haz una estimación del punto c con error menor al 5%',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'valor-medio',
          precisionEstimacion: 95
        },
        icono: '🎯',
        puntos: 20,
        raridad: 'raro'
      }),

      new Logro({
        id: 'calculador_pendiente',
        nombre: 'Calculador de Pendientes',
        descripcion: 'Calcula correctamente la pendiente de la recta secante',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'valor-medio',
          pendienteCalculada: true
        },
        icono: '📐',
        puntos: 12,
        raridad: 'comun'
      }),

      new Logro({
        id: 'verificador_teorema',
        nombre: 'Verificador del Teorema',
        descripcion: 'Verifica que f\'(c) = (f(b) - f(a))/(b - a)',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'valor-medio',
          teoremaVerificado: true
        },
        icono: '✅',
        puntos: 25,
        raridad: 'raro'
      }),

      new Logro({
        id: 'explorador_funciones',
        nombre: 'Explorador de Funciones',
        descripcion: 'Prueba el teorema con al menos 3 funciones diferentes',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'valor-medio',
          funcionesProbadas: 3
        },
        icono: '🔍',
        puntos: 18,
        raridad: 'comun'
      }),

      new Logro({
        id: 'maestro_potencias',
        nombre: 'Maestro de Potencias',
        descripcion: 'Completa ejemplos con x² y x³',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'segundo-teorema',
          funcionesCompletadas: ['cuadratica', 'cubica']
        },
        icono: '⚡',
        puntos: 20,
        raridad: 'raro'
      }),

      new Logro({
        id: 'trigonometrico',
        nombre: 'Trigonométrico',
        descripcion: 'Completa un ejemplo con sin(x) o cos(x)',
        tipo: 'especial',
        criterios: { 
          escenario: 'torreValorMedio',
          teorema: 'segundo-teorema',
          funcionesCompletadas: ['seno', 'coseno']
        },
        icono: '🕐',
        puntos: 15,
        raridad: 'raro'
      }),

      // Logros secuenciales
      new Logro({
        id: 'camino_completo',
        nombre: 'Camino Completo',
        descripcion: 'Completa todos los escenarios en orden',
        tipo: 'secuencial',
        criterios: { 
          secuencia: ['jardinRiemann', 'puenteTeorema', 'torreValorMedio', 'cristalAntiderivadas'] 
        },
        icono: '🏆',
        puntos: 50,
        raridad: 'epico'
      }),

      // Logros especiales
      new Logro({
        id: 'matematico_master',
        nombre: 'Maestro Matemático',
        descripcion: 'Completa todos los escenarios disponibles',
        tipo: 'completitud',
        criterios: { 
          escenariosCompletados: ['jardinRiemann', 'puenteTeorema', 'torreValorMedio', 'cristalAntiderivadas'] 
        },
        icono: '🎓',
        puntos: 100,
        raridad: 'legendario'
      }),

      new Logro({
        id: 'velocista',
        nombre: 'Velocista',
        descripcion: 'Completa un escenario en menos de 10 minutos',
        tipo: 'especial',
        icono: '⚡',
        puntos: 30,
        raridad: 'epico'
      }),

      new Logro({
        id: 'estudiante_dedicado',
        nombre: 'Estudiante Dedicado',
        descripcion: 'Dedica más de 3 horas a la plataforma',
        tipo: 'tiempo',
        criterios: { tiempoMinimo: 10800000 }, // 3 horas en ms
        icono: '📚',
        puntos: 40,
        raridad: 'epico'
      })
    ]

    return logrosBase
  }

  verificarLogrosEstudiante(estudianteId, escenarioActual = null) {
    const usuarios = this.servicioAuth.obtenerTodosLosUsuarios()
    const estudiante = usuarios.find(u => u.id === estudianteId)
    
    if (!estudiante || !estudiante.esEstudiante()) {
      return []
    }

    const logrosDesbloqueados = []
    const progreso = estudiante.obtenerEstadisticas()

    for (const logro of this.logros) {
      if (logro.activo && !progreso.logros.includes(logro.id)) {
        // Filtrar logros por escenario si se especifica
        if (escenarioActual && logro.criterios) {
          // Normalizar nombres de escenarios para comparación
          const escenarioNormalizado = escenarioActual.replace('-', '').toLowerCase()
          
          // Para logros con escenario específico
          if (logro.criterios.escenario) {
            const logroEscenarioNormalizado = logro.criterios.escenario.replace('-', '').toLowerCase()
            if (logroEscenarioNormalizado !== escenarioNormalizado) {
              continue // Saltar logros de otros escenarios
            }
          }
          
          // Para logros de completitud que requieren escenarios específicos
          if (logro.criterios.escenariosCompletados && logro.criterios.escenariosCompletados.length === 1) {
            const escenarioRequerido = logro.criterios.escenariosCompletados[0].replace('-', '').toLowerCase()
            if (escenarioRequerido !== escenarioNormalizado) {
              continue // Saltar logros que requieren completar otros escenarios
            }
          }
        }
        
        if (logro.verificarCriterios(progreso)) {
          logrosDesbloqueados.push(logro)
          // Agregar logro al estudiante
          estudiante.agregarLogro(logro.id)
        }
      }
    }

    // Actualizar estudiante si se desbloquearon logros
    if (logrosDesbloqueados.length > 0) {
      this.servicioAuth.actualizarUsuario(estudiante.id, estudiante)
    }

    return logrosDesbloqueados
  }

  obtenerLogrosDisponibles() {
    return this.logros.filter(logro => logro.activo)
  }

  obtenerLogrosPorTipo(tipo) {
    return this.logros.filter(logro => logro.tipo === tipo && logro.activo)
  }

  obtenerLogrosPorRaridad(raridad) {
    return this.logros.filter(logro => logro.raridad === raridad && logro.activo)
  }

  obtenerLogrosEstudiante(estudianteId) {
    const usuarios = this.servicioAuth.obtenerTodosLosUsuarios()
    const estudiante = usuarios.find(u => u.id === estudianteId)
    
    if (!estudiante || !estudiante.esEstudiante()) {
      return []
    }

    const logrosObtenidos = estudiante.progreso?.logros || []
    return this.logros.filter(logro => logrosObtenidos.includes(logro.id))
  }

  obtenerProgresoLogrosEstudiante(estudianteId) {
    const usuarios = this.servicioAuth.obtenerTodosLosUsuarios()
    const estudiante = usuarios.find(u => u.id === estudianteId)
    
    if (!estudiante || !estudiante.esEstudiante()) {
      return null
    }

    const logrosObtenidos = estudiante.progreso?.logros || []
    const progreso = estudiante.obtenerEstadisticas()

    return {
      totalLogros: this.logros.length,
      logrosObtenidos: logrosObtenidos.length,
      porcentajeCompletado: (logrosObtenidos.length / this.logros.length) * 100,
      puntosTotales: logrosObtenidos.reduce((sum, logroId) => {
        const logro = this.logros.find(l => l.id === logroId)
        return sum + (logro?.puntos || 0)
      }, 0),
      proximosLogros: this.obtenerProximosLogros(progreso),
      logrosPorRaridad: this.obtenerLogrosPorRaridadEstudiante(logrosObtenidos)
    }
  }

  obtenerProximosLogros(progreso) {
    return this.logros
      .filter(logro => !progreso.logros.includes(logro.id) && logro.activo)
      .map(logro => ({
        logro,
        progreso: this.calcularProgresoLogro(logro, progreso)
      }))
      .sort((a, b) => a.progreso - b.progreso)
      .slice(0, 5)
  }

  calcularProgresoLogro(logro, progreso) {
    switch (logro.tipo) {
      case 'tiempo':
        const tiempoRequerido = logro.criterios.tiempoMinimo || 0
        return Math.min((progreso.tiempoTotal / tiempoRequerido) * 100, 100)
      case 'completitud':
        const escenariosRequeridos = logro.criterios.escenariosCompletados || []
        const completados = escenariosRequeridos.filter(e => 
          progreso.escenariosCompletados.includes(e)
        ).length
        return (completados / escenariosRequeridos.length) * 100
      case 'especial':
        return this.calcularProgresoEspecial(logro, progreso)
      default:
        return 0
    }
  }

  calcularProgresoEspecial(logro, progreso) {
    switch (logro.id) {
      case 'explorador':
        return Math.min((progreso.historialActividad?.length || 0) / 10 * 100, 100)
      case 'velocista':
        // Este logro se verifica al completar un escenario
        return 0
      default:
        return 0
    }
  }

  // ✅ VERIFICAR LOGROS SEGUNDO TEOREMA FUNDAMENTAL
  verificarLogrosSegundoTeorema(estudianteId, datosSegundoTeorema) {
    console.log('🔍 VERIFICAR LOGROS SEGUNDO TEOREMA - INICIO')
    console.log('- estudianteId:', estudianteId)
    console.log('- datosSegundoTeorema:', datosSegundoTeorema)
    
    const usuarios = this.servicioAuth.obtenerTodosLosUsuarios()
    const estudiante = usuarios.find(u => u.id === estudianteId)
    
    if (!estudiante || !estudiante.esEstudiante()) {
      console.log('❌ No se encontró estudiante válido')
      return []
    }

    const logrosDesbloqueados = []
    const progreso = estudiante.obtenerEstadisticas()
    console.log('- progreso del estudiante:', progreso)

    // Verificar cada logro del Segundo Teorema Fundamental
    for (const logro of this.logros) {
      if (logro.activo && 
          logro.criterios?.escenario === 'torreValorMedio' && 
          logro.criterios?.teorema === 'segundo-teorema' &&
          !(progreso.logros || []).includes(logro.id)) {
        
        console.log(`🔍 Verificando logro: ${logro.id} - ${logro.nombre}`)
        if (this.verificarCriteriosSegundoTeorema(logro, datosSegundoTeorema)) {
          logrosDesbloqueados.push(logro)
          estudiante.agregarLogro(logro.id)
          console.log(`🏆 Logro desbloqueado: ${logro.nombre}`)
        }
      }
    }

    console.log('🔍 VERIFICAR LOGROS SEGUNDO TEOREMA - FIN')
    console.log('- logros desbloqueados:', logrosDesbloqueados.length)
    return logrosDesbloqueados
  }

  // ✅ VERIFICAR CRITERIOS ESPECÍFICOS DEL SEGUNDO TEOREMA
  verificarCriteriosSegundoTeorema(logro, datosSegundoTeorema) {
    console.log('🔍 Verificando criterios para logro:', logro.id, 'con datos:', datosSegundoTeorema)

    switch (logro.id) {
      case 'primera_antiderivada':
        // Se desbloquea cuando se completa la antiderivada correctamente
        const antiderivadaCompletada = datosSegundoTeorema.antiderivadaCorrecta
        console.log('🎯 Verificando primera_antiderivada:', {
          antiderivadaCorrecta: datosSegundoTeorema.antiderivadaCorrecta,
          pasoCompletado: datosSegundoTeorema.pasoCompletado,
          resultado: antiderivadaCompletada
        })
        return antiderivadaCompletada

      case 'calculador_experto':
        // Se desbloquea cuando se completa la evaluación correctamente
        const evaluacionCompletada = datosSegundoTeorema.evaluacionCorrecta
        console.log('⭐ Verificando calculador_experto:', {
          evaluacionCorrecta: datosSegundoTeorema.evaluacionCorrecta,
          pasoCompletado: datosSegundoTeorema.pasoCompletado,
          resultado: evaluacionCompletada
        })
        return evaluacionCompletada

      case 'verificador':
        // Se desbloquea cuando se completan los 4 pasos
        const verificadorCompletado = datosSegundoTeorema.pasosCompletados >= 4
        console.log('🛡️ Verificando verificador:', {
          pasosCompletados: datosSegundoTeorema.pasosCompletados,
          resultado: verificadorCompletado
        })
        return verificadorCompletado

      case 'maestro_potencias':
        // Se desbloquea cuando se completan funciones cuadrática y cúbica
        const funcionesPotencias = datosSegundoTeorema.funcionesCompletadas?.includes('cuadratica') && 
                                  datosSegundoTeorema.funcionesCompletadas?.includes('cubica')
        console.log('⚡ Verificando maestro_potencias:', {
          funcionesCompletadas: datosSegundoTeorema.funcionesCompletadas,
          resultado: funcionesPotencias
        })
        return funcionesPotencias

      case 'trigonometrico':
        // Se desbloquea cuando se completa una función trigonométrica
        const funcionesTrig = datosSegundoTeorema.funcionesCompletadas?.includes('seno') || 
                             datosSegundoTeorema.funcionesCompletadas?.includes('coseno')
        console.log('🕐 Verificando trigonometrico:', {
          funcionesCompletadas: datosSegundoTeorema.funcionesCompletadas,
          resultado: funcionesTrig
        })
        return funcionesTrig

      default:
        console.log('❌ Logro no reconocido:', logro.id)
        return false
    }
  }

  obtenerLogrosPorRaridadEstudiante(logrosObtenidos) {
    const logros = this.logros.filter(logro => logrosObtenidos.includes(logro.id))
    const porRaridad = {
      comun: 0,
      raro: 0,
      epico: 0,
      legendario: 0
    }

    logros.forEach(logro => {
      porRaridad[logro.raridad]++
    })

    return porRaridad
  }

  crearLogroPersonalizado(datos) {
    const nuevoLogro = new Logro(datos)
    this.logros.push(nuevoLogro)
    return nuevoLogro
  }

  desactivarLogro(logroId) {
    const logro = this.logros.find(l => l.id === logroId)
    if (logro) {
      logro.activo = false
      return true
    }
    return false
  }

  obtenerEstadisticasLogros() {
    const estudiantes = this.servicioAuth.obtenerEstudiantes()
    const totalLogros = this.logros.length
    
    const estadisticas = {
      totalLogros,
      logrosActivos: this.logros.filter(l => l.activo).length,
      distribucionPorRaridad: {
        comun: this.logros.filter(l => l.raridad === 'comun' && l.activo).length,
        raro: this.logros.filter(l => l.raridad === 'raro' && l.activo).length,
        epico: this.logros.filter(l => l.raridad === 'epico' && l.activo).length,
        legendario: this.logros.filter(l => l.raridad === 'legendario' && l.activo).length
      },
      logrosMasPopulares: this.obtenerLogrosMasPopulares(estudiantes),
      promedioLogrosPorEstudiante: estudiantes.length > 0 ? 
        estudiantes.reduce((sum, e) => sum + (e.progreso?.logros?.length || 0), 0) / estudiantes.length : 0
    }

    return estadisticas
  }

  obtenerLogrosMasPopulares(estudiantes) {
    const conteoLogros = {}
    
    estudiantes.forEach(estudiante => {
      const logros = estudiante.progreso?.logros || []
      logros.forEach(logroId => {
        conteoLogros[logroId] = (conteoLogros[logroId] || 0) + 1
      })
    })

    return Object.entries(conteoLogros)
      .map(([logroId, conteo]) => {
        const logro = this.logros.find(l => l.id === logroId)
    return {
          logro,
          conteo,
          porcentaje: (conteo / estudiantes.length) * 100
        }
      })
      .sort((a, b) => b.conteo - a.conteo)
      .slice(0, 5)
  }
}
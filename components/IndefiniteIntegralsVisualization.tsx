"use client"

import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { GestorLogros } from '@/src/servicios/GestorLogros.js'
import { ServicioAutenticacion } from '@/src/servicios/ServicioAutenticacion.js'

interface IndefiniteIntegralsVisualizationProps {
  width?: number
  height?: number
  className?: string
}

const IndefiniteIntegralsVisualization: React.FC<IndefiniteIntegralsVisualizationProps> = ({
  width = 800,
  height = 600,
  className = ""
}) => {
  // Estados principales
  const [selectedFunction, setSelectedFunction] = useState('quadratic')
  const [constantC, setConstantC] = useState(0)
  const [showFamily, setShowFamily] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  
  // Estados para logros y tiempo
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0)
  const [logrosDesbloqueados, setLogrosDesbloqueados] = useState<any[]>([])
  const [mostrarLogros, setMostrarLogros] = useState(false)
  const [gestorLogros] = useState(() => new GestorLogros())
  const [servicioAuth] = useState(() => new ServicioAutenticacion())
  
  // Referencias para D3
  const svgRef = useRef<SVGSVGElement>(null)
  const [svg, setSvg] = useState<any>(null)
  
  // Configuración de la gráfica
  const margin = { top: 20, right: 20, bottom: 60, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Cronómetro
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoTranscurrido(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Logro de bienvenida inmediato
  useEffect(() => {
    const logroBienvenida = {
      id: 'bienvenido_visualizacion',
      nombre: 'Bienvenido',
      descripcion: 'Has entrado a la visualización de Integrales Indefinidas',
      icono: '🎉'
    }
    
    setLogrosDesbloqueados([logroBienvenida])
    setMostrarLogros(true)
    
    // Ocultar notificación después de 3 segundos
    setTimeout(() => setMostrarLogros(false), 3000)
  }, [])

  // Verificar logros cuando cambie la función o constante (no cada segundo)
  useEffect(() => {
    const verificarLogros = () => {
      try {
        // Obtener usuario actual (simulado para demo)
        const usuarioActual = servicioAuth.obtenerUsuarioActual()
        if (!usuarioActual) return

        // Datos para verificar logros del cristal de antiderivadas
        const datosCristal = {
          funcionSeleccionada: selectedFunction,
          constanteC: constantC,
          tiempoEnVisualizacion: tiempoTranscurrido,
          familiaVisible: showFamily,
          isAnimating: isAnimating
        }

        // Verificar logros específicos del cristal
        const nuevosLogros = verificarLogrosCristal(datosCristal)
        if (nuevosLogros.length > 0) {
          setLogrosDesbloqueados(prev => {
            const logrosExistentes = prev.map(l => l.id)
            const logrosNuevos = nuevosLogros.filter(l => !logrosExistentes.includes(l.id))
            return [...prev, ...logrosNuevos]
          })
          setMostrarLogros(true)
          
          // Ocultar logros después de 5 segundos
          setTimeout(() => setMostrarLogros(false), 5000)
        }
      } catch (error) {
        console.log('Error verificando logros:', error)
      }
    }

    verificarLogros()
  }, [selectedFunction, constantC, showFamily])

  // Verificar logros específicos de tiempo (cada 10 segundos)
  useEffect(() => {
    if (tiempoTranscurrido > 0 && tiempoTranscurrido % 10 === 0) {
      const verificarLogrosTiempo = () => {
        try {
          const usuarioActual = servicioAuth.obtenerUsuarioActual()
          if (!usuarioActual) return

          const datosCristal = {
            funcionSeleccionada: selectedFunction,
            constanteC: constantC,
            tiempoEnVisualizacion: tiempoTranscurrido,
            familiaVisible: showFamily,
            isAnimating: isAnimating
          }

          const nuevosLogros = verificarLogrosCristal(datosCristal)
          if (nuevosLogros.length > 0) {
            setLogrosDesbloqueados(prev => {
              const logrosExistentes = prev.map(l => l.id)
              const logrosNuevos = nuevosLogros.filter(l => !logrosExistentes.includes(l.id))
              return [...prev, ...logrosNuevos]
            })
            setMostrarLogros(true)
            
            setTimeout(() => setMostrarLogros(false), 5000)
          }
        } catch (error) {
          console.log('Error verificando logros de tiempo:', error)
        }
      }

      verificarLogrosTiempo()
    }
  }, [tiempoTranscurrido])

  // Función para verificar logros específicos del cristal
  const verificarLogrosCristal = (datos: any) => {
    const logrosDesbloqueados: any[] = []

    // Logro: Bienvenido (inmediato)
    if (datos.tiempoEnVisualizacion >= 1) {
      logrosDesbloqueados.push({
        id: 'bienvenido_visualizacion',
        nombre: 'Bienvenido',
        descripcion: 'Has entrado a la visualización de Integrales Indefinidas',
        icono: '🎉'
      })
    }

    // Logro: Primer Paso (3 segundos)
    if (datos.tiempoEnVisualizacion >= 3) {
      logrosDesbloqueados.push({
        id: 'primer_paso_visualizacion',
        nombre: 'Primer Paso',
        descripcion: 'Has estado en la visualización por 3 segundos',
        icono: '👶'
      })
    }

    // Logro: Explorador de Familias (8 segundos)
    if (datos.tiempoEnVisualizacion >= 8) {
      logrosDesbloqueados.push({
        id: 'explorador_familias',
        nombre: 'Explorador de Familias',
        descripcion: 'Has explorado la visualización por 8 segundos',
        icono: '🌟'
      })
    }

    // Logro: Maestro de la Constante (cambiar C)
    if (datos.constanteC !== 0) {
      logrosDesbloqueados.push({
        id: 'maestro_constante',
        nombre: 'Maestro de la Constante',
        descripcion: 'Has modificado la constante C',
        icono: '🎯'
      })
    }

    // Logro: Observador de Familias (mostrar familia)
    if (datos.familiaVisible) {
      logrosDesbloqueados.push({
        id: 'observador_familias',
        nombre: 'Observador de Familias',
        descripcion: 'Has activado la visualización de familias',
        icono: '👁️'
      })
    }

    // Logro: Explorador de Funciones (cambiar función)
    if (datos.funcionSeleccionada && datos.funcionSeleccionada !== 'quadratic') {
      logrosDesbloqueados.push({
        id: 'explorador_funciones',
        nombre: 'Explorador de Funciones',
        descripcion: 'Has cambiado la función seleccionada',
        icono: '🔄'
      })
    }

    // Logro: Persistente (30 segundos)
    if (datos.tiempoEnVisualizacion >= 30) {
      logrosDesbloqueados.push({
        id: 'persistente_visualizacion',
        nombre: 'Persistente',
        descripcion: 'Has estado en la visualización por 30 segundos',
        icono: '⏰'
      })
    }

    // Logro: Animador (si está animando)
    if (datos.isAnimating) {
      logrosDesbloqueados.push({
        id: 'animador',
        nombre: 'Animador',
        descripcion: 'Has activado la animación de la familia',
        icono: '🎬'
      })
    }

    return logrosDesbloqueados
  }

  // Función para obtener todos los logros disponibles
  const obtenerTodosLosLogros = () => {
    return [
      {
        id: 'bienvenido_visualizacion',
        nombre: 'Bienvenido',
        descripcion: 'Has entrado a la visualización de Integrales Indefinidas',
        icono: '🎉'
      },
      {
        id: 'primer_paso_visualizacion',
        nombre: 'Primer Paso',
        descripcion: 'Has estado en la visualización por 3 segundos',
        icono: '👶'
      },
      {
        id: 'explorador_familias',
        nombre: 'Explorador de Familias',
        descripcion: 'Has explorado la visualización por 8 segundos',
        icono: '🌟'
      },
      {
        id: 'maestro_constante',
        nombre: 'Maestro de la Constante',
        descripcion: 'Has modificado la constante C',
        icono: '🎯'
      },
      {
        id: 'observador_familias',
        nombre: 'Observador de Familias',
        descripcion: 'Has activado la visualización de familias',
        icono: '👁️'
      },
      {
        id: 'explorador_funciones',
        nombre: 'Explorador de Funciones',
        descripcion: 'Has cambiado la función seleccionada',
        icono: '🔄'
      },
      {
        id: 'persistente_visualizacion',
        nombre: 'Persistente',
        descripcion: 'Has estado en la visualización por 30 segundos',
        icono: '⏰'
      },
      {
        id: 'animador',
        nombre: 'Animador',
        descripcion: 'Has activado la animación de la familia',
        icono: '🎬'
      }
    ]
  }
  
  // Dominio de la gráfica
  const xDomain = [-4, 4]
  const yDomain = [-10, 10]
  
  // Escalas
  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([0, innerWidth])
    
  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([innerHeight, 0])

  // Configuración de funciones disponibles
  const functionConfigs = {
    quadratic: {
      name: 'Hada Cuadrática',
      original: 'f(x) = x²',
      antiderivative: 'F(x) = x³/3 + C',
      color: '#e74c3c',
      familyColor: '#3498db',
      calculateOriginal: (x: number) => x * x,
      calculateAntiderivative: (x: number, c: number) => (x * x * x) / 3 + c
    },
    linear: {
      name: 'Hada Lineal',
      original: 'f(x) = x',
      antiderivative: 'F(x) = x²/2 + C',
      color: '#9b59b6',
      familyColor: '#e67e22',
      calculateOriginal: (x: number) => x,
      calculateAntiderivative: (x: number, c: number) => (x * x) / 2 + c
    },
    exponential: {
      name: 'Hada Exponencial',
      original: 'f(x) = eˣ',
      antiderivative: 'F(x) = eˣ + C',
      color: '#27ae60',
      familyColor: '#f39c12',
      calculateOriginal: (x: number) => Math.exp(x),
      calculateAntiderivative: (x: number, c: number) => Math.exp(x) + c
    },
    sine: {
      name: 'Hada Ondulante',
      original: 'f(x) = sin(x)',
      antiderivative: 'F(x) = -cos(x) + C',
      color: '#8e44ad',
      familyColor: '#e74c3c',
      calculateOriginal: (x: number) => Math.sin(x),
      calculateAntiderivative: (x: number, c: number) => -Math.cos(x) + c
    }
  }

  // Función para generar puntos de la función original
  const generateOriginalPoints = (func: any) => {
    const points = []
    const step = 0.1
    for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
      const y = func.calculateOriginal(x)
      if (Math.abs(y) <= yDomain[1]) { // Solo incluir puntos dentro del dominio Y
        points.push({ x, y })
      }
    }
    return points
  }

  // Función para generar puntos de la familia de antiderivadas
  const generateFamilyPoints = (func: any, cValues: number[]) => {
    const familyPoints: Array<{c: number, points: {x: number, y: number}[], index: number}> = []
    const step = 0.1
    
    cValues.forEach((c, index) => {
      const points: {x: number, y: number}[] = []
      for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
        const y = func.calculateAntiderivative(x, c)
        if (Math.abs(y) <= yDomain[1]) {
          points.push({ x, y })
        }
      }
      familyPoints.push({ c, points, index })
    })
    
    return familyPoints
  }

  // Función para dibujar la gráfica
  const drawGraph = () => {
    if (!svg) return

    // Limpiar gráfica anterior
    svg.selectAll('*').remove()

    // Crear grupo principal
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Dibujar cuadrícula de fondo
    const gridX = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickFormat(() => '')
      .ticks(8)

    const gridY = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat(() => '')
      .ticks(14)

    g.append('g')
      .attr('class', 'grid-x')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(gridX)
      .style('stroke', '#e0e0e0')
      .style('stroke-width', 1)
      .style('opacity', 0.7)

    g.append('g')
      .attr('class', 'grid-y')
      .call(gridY)
      .style('stroke', '#e0e0e0')
      .style('stroke-width', 1)
      .style('opacity', 0.7)

    // Dibujar líneas de ejes principales
    // Eje X (horizontal)
    g.append('line')
      .attr('class', 'x-axis-line')
      .attr('x1', 0)
      .attr('y1', yScale(0))
      .attr('x2', innerWidth)
      .attr('y2', yScale(0))
      .style('stroke', '#000')
      .style('stroke-width', 3)
      .style('opacity', 1)

    // Eje Y (vertical)
    g.append('line')
      .attr('class', 'y-axis-line')
      .attr('x1', xScale(0))
      .attr('y1', 0)
      .attr('x2', xScale(0))
      .attr('y2', innerHeight)
      .style('stroke', '#000')
      .style('stroke-width', 3)
      .style('opacity', 1)

    // Dibujar ejes con marcas y números
    const xAxis = d3.axisBottom(xScale)
      .tickSize(6)
      .tickPadding(8)
      .tickFormat(d3.format('.0f'))
      
    const yAxis = d3.axisLeft(yScale)
      .tickSize(6)
      .tickPadding(8)
      .tickFormat(d3.format('.0f'))

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .style('color', '#333')
      .style('font-size', '12px')
      .style('font-weight', 'bold')

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .style('color', '#333')
      .style('font-size', '12px')
      .style('font-weight', 'bold')

    // Etiquetas de ejes
    g.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('x')

    g.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('y')

    const currentFunc = functionConfigs[selectedFunction as keyof typeof functionConfigs]

    // Generar puntos de la función original
    const originalPoints = generateOriginalPoints(currentFunc)
    
    // Crear línea para la función original
    const originalLine = d3.line<{x: number, y: number}>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX)

    // Dibujar función original
    g.append('path')
      .datum(originalPoints)
      .attr('class', 'original-function')
      .attr('d', originalLine)
      .style('fill', 'none')
      .style('stroke', currentFunc.color)
      .style('stroke-width', 3)
      .style('opacity', 0.8)

    // Etiqueta de la función original
    g.append('text')
      .attr('class', 'original-function-label')
      .attr('x', xScale(2.5))
      .attr('y', yScale(currentFunc.calculateOriginal(2.5)) - 10)
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', currentFunc.color)
      .text(currentFunc.original)

    // Dibujar familia de antiderivadas si está habilitada
    if (showFamily) {
      const cValues = [-3, -2, -1, 0, 1, 2, 3] // Valores de C para mostrar
      const familyPoints = generateFamilyPoints(currentFunc, cValues)
      
      familyPoints.forEach((family, index) => {
        const isCurrentC = Math.abs(family.c - constantC) < 0.1
        
        // Crear línea para esta antiderivada
        const familyLine = d3.line<{x: number, y: number}>()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y))
          .curve(d3.curveMonotoneX)

        // Dibujar línea de la familia
        g.append('path')
          .datum(family.points)
          .attr('class', `family-line-${index}`)
          .attr('d', familyLine)
          .style('fill', 'none')
          .style('stroke', isCurrentC ? currentFunc.familyColor : '#ddd')
          .style('stroke-width', isCurrentC ? 3 : 2)
          .style('stroke-dasharray', '5,5')
          .style('opacity', isCurrentC ? 1 : 0.6)

        // Etiqueta para la línea actual (C = constantC)
        if (isCurrentC) {
          g.append('text')
            .attr('class', 'current-family-label')
            .attr('x', xScale(2.5))
            .attr('y', yScale(currentFunc.calculateAntiderivative(2.5, constantC)) - 10)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', currentFunc.familyColor)
            .text(`F(x) = ${currentFunc.antiderivative.replace('C', constantC.toFixed(1))}`)
        }
      })
    }

    // Dibujar punto destacado en la función original
    const highlightX = 2
    const highlightY = currentFunc.calculateOriginal(highlightX)
    
    g.append('circle')
      .attr('class', 'highlight-point')
      .attr('cx', xScale(highlightX))
      .attr('cy', yScale(highlightY))
      .attr('r', 4)
      .style('fill', currentFunc.color)
      .style('stroke', 'white')
      .style('stroke-width', 2)

    // Dibujar punto destacado en la antiderivada actual
    const antiderivativeY = currentFunc.calculateAntiderivative(highlightX, constantC)
    
    g.append('circle')
      .attr('class', 'antiderivative-point')
      .attr('cx', xScale(highlightX))
      .attr('cy', yScale(antiderivativeY))
      .attr('r', 4)
      .style('fill', currentFunc.familyColor)
      .style('stroke', 'white')
      .style('stroke-width', 2)

    // Línea vertical conectando los puntos
    g.append('line')
      .attr('class', 'connection-line')
      .attr('x1', xScale(highlightX))
      .attr('y1', yScale(highlightY))
      .attr('x2', xScale(highlightX))
      .attr('y2', yScale(antiderivativeY))
      .style('stroke', '#ff6b6b')
      .style('stroke-width', 2)
      .style('stroke-dasharray', '3,3')
  }

  // Efecto para redibujar cuando cambian las variables
  useEffect(() => {
    drawGraph()
  }, [selectedFunction, constantC, showFamily, svg])

  // Inicializar SVG
  useEffect(() => {
    if (svgRef.current) {
      const svgElement = d3.select(svgRef.current)
      setSvg(svgElement)
    }
  }, [])

  // Función de animación
  const animateFamily = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    const startC = -3
    const endC = 3
    const duration = 3000 / animationSpeed
    const steps = 60
    const stepSize = (endC - startC) / steps
    const stepDuration = duration / steps
    
    let currentStep = 0
    
    const animationInterval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(animationInterval)
        setIsAnimating(false)
        return
      }
      
      const currentC = startC + (stepSize * currentStep)
      setConstantC(currentC)
      currentStep++
    }, stepDuration)
  }

  return (
    <div className={`indefinite-integrals-visualization ${className}`}>
      {/* Cronómetro y Logros */}
      <div className="timer-achievements-panel mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          {/* Cronómetro */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">⏱️</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Tiempo en Visualización</div>
              <div className="text-lg font-bold text-purple-600">
                {Math.floor(tiempoTranscurrido / 60)}:{(tiempoTranscurrido % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Logros */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏆</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Logros Desbloqueados</div>
              <div className="text-lg font-bold text-yellow-600">{logrosDesbloqueados.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificación de Logros */}
      {mostrarLogros && logrosDesbloqueados.length > 0 && (
        <div className="achievement-notification mb-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎉</div>
            <div>
              <div className="font-bold text-yellow-800">¡Logro Desbloqueado!</div>
              <div className="text-yellow-700">
                {logrosDesbloqueados[logrosDesbloqueados.length - 1]?.nombre}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de Logros Disponibles */}
      <div className="achievements-panel mb-6 p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          Logros Disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {obtenerTodosLosLogros().map((logro) => {
            const estaDesbloqueado = logrosDesbloqueados.some(l => l.id === logro.id)
            return (
              <div
                key={logro.id}
                className={`achievement-card p-3 rounded-lg border-2 transition-all duration-300 ${
                  estaDesbloqueado
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-300 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${estaDesbloqueado ? 'grayscale-0' : 'grayscale'}`}>
                    {logro.icono}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${estaDesbloqueado ? 'text-green-800' : 'text-gray-600'}`}>
                      {logro.nombre}
                    </div>
                    <div className={`text-sm ${estaDesbloqueado ? 'text-green-700' : 'text-gray-500'}`}>
                      {logro.descripcion}
                    </div>
                  </div>
                  {estaDesbloqueado && (
                    <div className="text-green-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controles principales */}
      <div className="controls-panel mb-6 p-4 bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Selección de función */}
          <div className="control-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona tu Hada
            </label>
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.entries(functionConfigs).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Control de constante C */}
          <div className="control-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Constante C: {constantC.toFixed(1)}
            </label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={constantC}
              onChange={(e) => setConstantC(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Control de familia */}
          <div className="control-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Familia Mágica
            </label>
            <button
              onClick={() => setShowFamily(!showFamily)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                showFamily 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {showFamily ? 'Ocultar Familia' : 'Mostrar Familia'}
            </button>
          </div>

          {/* Control de animación */}
          <div className="control-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Animación
            </label>
            <button
              onClick={animateFamily}
              disabled={isAnimating}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isAnimating 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isAnimating ? 'Animando...' : 'Animar Familia'}
            </button>
          </div>
        </div>
      </div>

      {/* Gráfica principal */}
      <div className="graph-container bg-white rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <select className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm">
            <option>¿Qué muestra la gráfica?</option>
            <option>La función original f(x) y su familia de antiderivadas F(x) + C</option>
          </select>
        </div>
        
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded-lg"
        />
      </div>

      {/* Información de la función actual */}
      <div className="function-info mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">
          {functionConfigs[selectedFunction as keyof typeof functionConfigs].name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-purple-700">Función original:</span>
            <span className="ml-2 font-mono text-purple-600">
              {functionConfigs[selectedFunction as keyof typeof functionConfigs].original}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Antiderivada:</span>
            <span className="ml-2 font-mono text-purple-600">
              {functionConfigs[selectedFunction as keyof typeof functionConfigs].antiderivative}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">C actual:</span>
            <span className="ml-2 font-mono text-purple-600">
              {constantC.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">F(x) + C:</span>
            <span className="ml-2 font-mono text-purple-600">
              {functionConfigs[selectedFunction as keyof typeof functionConfigs].antiderivative.replace('C', constantC.toFixed(1))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndefiniteIntegralsVisualization

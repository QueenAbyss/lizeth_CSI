import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { SparklesIcon, Wand2Icon, TrophyIcon, ClockIcon } from 'lucide-react'

interface VariableChangeVisualizationProps {
  width?: number
  height?: number
  className?: string
}

const VariableChangeVisualization: React.FC<VariableChangeVisualizationProps> = ({
  width = 800,
  height = 600,
  className = ""
}) => {
  // Estados principales
  const [transformationType, setTransformationType] = useState('linear')
  const [transformationValue, setTransformationValue] = useState(1)
  const [showParticles, setShowParticles] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0)
  const [logrosDesbloqueados, setLogrosDesbloqueados] = useState<string[]>([])
  
  // Referencias para D3
  const svgRef = useRef<SVGSVGElement>(null)
  const [svg, setSvg] = useState<any>(null)
  
  // Configuracion de la grafica
  const margin = { top: 20, right: 20, bottom: 60, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  
  // Dominio de la grafica
  const xDomain = [-4, 4]
  const yDomain = [-10, 10]
  
  // Escalas
  const xScale = d3.scaleLinear()
    .domain(xDomain)
    .range([0, innerWidth])
    
  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([innerHeight, 0])

  // Configuracion de transformaciones disponibles
  const transformationConfigs: Record<string, {
    name: string
    formula: string
    color: string
    transformedColor: string
    description: string
    calculateTransformation: (x: number, value: number) => number
    calculateInverse: (u: number, value: number) => number
  }> = {
    linear: {
      name: 'Hada Lineal',
      formula: 'u = x + C',
      color: '#e74c3c',
      transformedColor: '#3498db',
      description: 'Transformacion lineal simple',
      calculateTransformation: (x: number, value: number) => x + value,
      calculateInverse: (u: number, value: number) => u - value
    },
    quadratic: {
      name: 'Hada Cuadratica',
      formula: 'u = x² + C',
      color: '#9b59b6',
      transformedColor: '#e67e22',
      description: 'Transformacion cuadratica',
      calculateTransformation: (x: number, value: number) => x * x + value,
      calculateInverse: (u: number, value: number) => Math.sqrt(u - value)
    },
    exponential: {
      name: 'Hada Exponencial',
      formula: 'u = eˣ + C',
      color: '#27ae60',
      transformedColor: '#f39c12',
      description: 'Transformación exponencial',
      calculateTransformation: (x: number, value: number) => Math.exp(x) + value,
      calculateInverse: (u: number, value: number) => Math.log(u - value)
    },
    sine: {
      name: 'Hada Ondulante',
      formula: 'u = sin(x) + C',
      color: '#8e44ad',
      transformedColor: '#e74c3c',
      description: 'Transformación trigonométrica',
      calculateTransformation: (x: number, value: number) => Math.sin(x) + value,
      calculateInverse: (u: number, value: number) => Math.asin(u - value)
    }
  }

  // Logros disponibles
  const obtenerTodosLosLogros = () => [
    {
      id: 'bienvenido',
      nombre: 'Bienvenido',
      descripcion: 'Primera interacción con la visualización',
      icono: '👋',
      condicion: () => true
    },
    {
      id: 'explorador',
      nombre: 'Explorador',
      descripcion: 'Cambiar entre 3 tipos de transformación',
      icono: '🔍',
      condicion: () => {
        // Simular que se han cambiado 3 tipos
        return tiempoTranscurrido > 5
      }
    },
    {
      id: 'experto_valor',
      nombre: 'Experto en Valores',
      descripcion: 'Ajustar el valor de transformación 5 veces',
      icono: '🎯',
      condicion: () => {
        // Simular que se ha ajustado el valor varias veces
        return tiempoTranscurrido > 8
      }
    },
    {
      id: 'magico',
      nombre: 'Mágico',
      descripcion: 'Activar las partículas mágicas',
      icono: '✨',
      condicion: () => showParticles
    },
    {
      id: 'animador',
      nombre: 'Animador',
      descripcion: 'Ejecutar la animación de transformación',
      icono: '🎬',
      condicion: () => isAnimating
    },
    {
      id: 'persistente',
      nombre: 'Persistente',
      descripcion: 'Permanecer 10 segundos en la visualización',
      icono: '⏰',
      condicion: () => tiempoTranscurrido >= 10
    }
  ]

  // Función para verificar logros
  const verificarLogros = () => {
    const todosLosLogros = obtenerTodosLosLogros()
    const nuevosLogros = todosLosLogros.filter(logro => 
      !logrosDesbloqueados.includes(logro.id) && logro.condicion()
    )
    
    if (nuevosLogros.length > 0) {
      const nuevosIds = nuevosLogros.map(logro => logro.id)
      setLogrosDesbloqueados(prev => [...prev, ...nuevosIds])
      
      // Mostrar notificación para cada logro nuevo
      nuevosLogros.forEach(logro => {
        console.log(`¡Logro desbloqueado: ${logro.nombre}!`)
      })
    }
  }

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoTranscurrido(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Verificar logros cada segundo
  useEffect(() => {
    verificarLogros()
  }, [tiempoTranscurrido, showParticles, isAnimating])

  // Función para generar puntos de la función original
  const generateOriginalPoints = () => {
    const points = []
    const step = 0.1
    for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
      const y = x * x // f(x) = x²
      if (Math.abs(y) <= yDomain[1]) {
        points.push({ x, y })
      }
    }
    return points
  }

  // Función para generar puntos de la función transformada
  const generateTransformedPoints = () => {
    const points = []
    const step = 0.1
    const currentTransform = transformationConfigs[transformationType]
    
    for (let x = xDomain[0]; x <= xDomain[1]; x += step) {
      const u = currentTransform.calculateTransformation(x, transformationValue)
      const y = x * x // f(x) = x² (la función original evaluada en x)
      if (Math.abs(y) <= yDomain[1] && Math.abs(u) <= xDomain[1]) {
        points.push({ x: u, y })
      }
    }
    return points
  }

  // Función para generar partículas de efecto
  const generateParticles = () => {
    if (!showParticles) return []
    
    const particles = []
    const currentTransform = transformationConfigs[transformationType]
    
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 8 // Punto aleatorio en el dominio
      const y = x * x // Valor original
      const transformedX = currentTransform.calculateTransformation(x, transformationValue)
      const transformedY = transformedX * transformedX
      
      particles.push({
        id: i,
        original: { x, y },
        transformed: { x: transformedX, y: transformedY }
      })
    }
    return particles
  }

  // Función para dibujar la gráfica
  const drawGraph = () => {
    if (!svg) return

    // Limpiar gráfica anterior
    svg.selectAll('*').remove()

    // Crear grupo principal
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Dibujar ejes
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(10)
      
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10)

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .style('color', '#666')
      .style('font-size', '12px')

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .style('color', '#666')
      .style('font-size', '12px')

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

    const currentTransform = transformationConfigs[transformationType]

    // Generar puntos de la función original
    const originalPoints = generateOriginalPoints()
    
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
      .style('stroke', currentTransform.color)
      .style('stroke-width', 3)
      .style('opacity', 0.8)

    // Etiqueta de la función original
    g.append('text')
      .attr('class', 'original-function-label')
      .attr('x', xScale(2.5))
      .attr('y', yScale(2.5 * 2.5) - 10)
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', currentTransform.color)
      .text('f(x) = x²')

    // Generar puntos de la función transformada
    const transformedPoints = generateTransformedPoints()
    
    // Crear línea para la función transformada
    const transformedLine = d3.line<{x: number, y: number}>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX)

    // Dibujar función transformada
    g.append('path')
      .datum(transformedPoints)
      .attr('class', 'transformed-function')
      .attr('d', transformedLine)
      .style('fill', 'none')
      .style('stroke', currentTransform.transformedColor)
      .style('stroke-width', 3)
      .style('stroke-dasharray', '5,5')
      .style('opacity', 0.8)

    // Etiqueta de la función transformada
    g.append('text')
      .attr('class', 'transformed-function-label')
      .attr('x', xScale(2.5))
      .attr('y', yScale(2.5 * 2.5) - 10)
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', currentTransform.transformedColor)
      .text('f(u) = u²')

    // Dibujar flecha de transformación
    const arrowStartX = xScale(2)
    const arrowStartY = yScale(4)
    const arrowEndX = xScale(2.5)
    const arrowEndY = yScale(6.25)

    // Línea de la flecha
    g.append('line')
      .attr('class', 'transformation-arrow')
      .attr('x1', arrowStartX)
      .attr('y1', arrowStartY)
      .attr('x2', arrowEndX)
      .attr('y2', arrowEndY)
      .style('stroke', '#f1c40f')
      .style('stroke-width', 3)
      .style('opacity', 0.8)

    // Cabeza de la flecha
    const arrowHead = g.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 9)
      .attr('refY', 3)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')

    arrowHead.append('path')
      .attr('d', 'M0,0 L0,6 L9,3 z')
      .style('fill', '#f1c40f')

    // Aplicar el marcador a la flecha
    g.select('.transformation-arrow')
      .attr('marker-end', 'url(#arrowhead)')

    // Etiqueta de la flecha
    g.append('text')
      .attr('class', 'transformation-label')
      .attr('x', (arrowStartX + arrowEndX) / 2)
      .attr('y', (arrowStartY + arrowEndY) / 2 - 10)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#f1c40f')
      .style('text-anchor', 'middle')
      .text('Transformación')

    // Dibujar partículas si están habilitadas
    if (showParticles) {
      const particles = generateParticles()
      
      particles.forEach((particle, index) => {
        // Partícula original
        g.append('circle')
          .attr('class', `particle-original-${index}`)
          .attr('cx', xScale(particle.original.x))
          .attr('cy', yScale(particle.original.y))
          .attr('r', 2)
          .style('fill', currentTransform.color)
          .style('opacity', 0.7)

        // Partícula transformada
        g.append('circle')
          .attr('class', `particle-transformed-${index}`)
          .attr('cx', xScale(particle.transformed.x))
          .attr('cy', yScale(particle.transformed.y))
          .attr('r', 2)
          .style('fill', currentTransform.transformedColor)
          .style('opacity', 0.7)

        // Línea de conexión entre partículas
        g.append('line')
          .attr('class', `particle-connection-${index}`)
          .attr('x1', xScale(particle.original.x))
          .attr('y1', yScale(particle.original.y))
          .attr('x2', xScale(particle.transformed.x))
          .attr('y2', yScale(particle.transformed.y))
          .style('stroke', '#95a5a6')
          .style('stroke-width', 1)
          .style('stroke-dasharray', '2,2')
          .style('opacity', 0.5)
      })
    }

    // Información de la transformación actual
    g.append('text')
      .attr('class', 'transformation-info')
      .attr('x', xScale(-3.5))
      .attr('y', yScale(8))
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#2c3e50')
      .text(`f(x) = x²`)

    g.append('text')
      .attr('class', 'transformation-info')
      .attr('x', xScale(-3.5))
      .attr('y', yScale(7))
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#2c3e50')
      .text(`Transformación: ${currentTransform.formula}`)

    g.append('text')
      .attr('class', 'transformation-info')
      .attr('x', xScale(-3.5))
      .attr('y', yScale(6))
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#2c3e50')
      .text(`Valor: ${transformationValue.toFixed(1)}`)
  }

  // Efecto para redibujar cuando cambian las variables
  useEffect(() => {
    drawGraph()
  }, [transformationType, transformationValue, showParticles, svg])

  // Inicializar SVG
  useEffect(() => {
    if (svgRef.current) {
      const svgElement = d3.select(svgRef.current)
      setSvg(svgElement)
    }
  }, [])

  // Función de animación
  const animateTransformation = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    const startValue = -3
    const endValue = 3
    const duration = 3000 / animationSpeed
    const steps = 60
    const stepSize = (endValue - startValue) / steps
    const stepDuration = duration / steps
    
    let currentStep = 0
    
    const animationInterval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(animationInterval)
        setIsAnimating(false)
        return
      }
      
      const currentValue = startValue + (stepSize * currentStep)
      setTransformationValue(currentValue)
      currentStep++
    }, stepDuration)
  }

  return (
    <div className={`variable-change-visualization ${className}`}>
      {/* Panel de información superior */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ¿Qué muestra la gráfica? */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            ¿Qué muestra la gráfica?
          </h3>
          <div className="space-y-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Elementos de la Gráfica</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Función Original: f(x) en el eje x</li>
                <li>• Transformación: u = g(x) aplicada</li>
                <li>• Función Transformada: f(u) en el eje u</li>
                <li>• Relación: Cómo cambia la forma</li>
              </ul>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">¿Qué Observar?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Antes: Forma de f(x)</li>
                <li>• Transformación: u = g(x)</li>
                <li>• Después: Forma de f(u)</li>
                <li>• Comparación: Diferencias visuales</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Visualización de la Transformación */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">
              Visualización de la Transformación
            </h3>
          </div>
          <p className="text-blue-700 text-sm">
            La gráfica permite observar en tiempo real cómo el cambio de variable modifica 
            la forma, posición y características de la función original.
          </p>
        </div>
      </div>

      {/* Controles principales */}
      <div className="controls-panel mb-6 p-4 bg-white rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Selección de transformación */}
          <div className="control-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transformaciones Mágicas
            </label>
            <select
              value={transformationType}
              onChange={(e) => setTransformationType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {Object.entries(transformationConfigs).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Control de valor de transformación */}
          <div className="control-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Control Mágico
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowParticles(!showParticles)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showParticles 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {showParticles ? 'Ocultar' : 'Mostrar'}
              </button>
              <div className="flex-1">
                <div className="text-xs text-gray-600 mb-1">
                  Valor: {transformationValue.toFixed(1)}
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={transformationValue}
                  onChange={(e) => setTransformationValue(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Control de partículas */}
          <div className="control-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Efectos Mágicos
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setShowParticles(!showParticles)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  showParticles 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {showParticles ? 'Ocultar Partículas' : 'Mostrar Partículas'}
              </button>
            </div>
          </div>

          {/* Control de animación */}
          <div className="control-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Animación
            </label>
            <button
              onClick={animateTransformation}
              disabled={isAnimating}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isAnimating 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isAnimating ? 'Animando...' : 'Animar Transformación'}
            </button>
          </div>
        </div>
      </div>

      {/* Gráfica principal */}
      <div className="graph-container bg-white rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <select className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm">
            <option>¿Qué muestra la gráfica?</option>
            <option>La función original f(x) y su transformación f(u)</option>
          </select>
        </div>
        
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded-lg"
        />
      </div>

      {/* Panel de logros y cronómetro */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logros */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrophyIcon className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">Logros</h3>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {logrosDesbloqueados.length} de {obtenerTodosLosLogros().length} desbloqueados
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {obtenerTodosLosLogros().map((logro) => {
              const estaDesbloqueado = logrosDesbloqueados.includes(logro.id)
              return (
                <div
                  key={logro.id}
                  className={`p-2 rounded-lg border transition-all duration-300 ${
                    estaDesbloqueado
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`text-lg ${estaDesbloqueado ? 'grayscale-0' : 'grayscale'}`}>
                      {logro.icono}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        estaDesbloqueado ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        {logro.nombre}
                      </div>
                      <div className={`text-xs ${
                        estaDesbloqueado ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {logro.descripcion}
                      </div>
                    </div>
                    {estaDesbloqueado && (
                      <div className="text-green-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Cronómetro */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Cronómetro</h3>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(tiempoTranscurrido / 60)}:{(tiempoTranscurrido % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">Tiempo total</div>
          </div>
        </div>
      </div>

      {/* Información de la transformación actual */}
      <div className="transformation-info mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">
          {transformationConfigs[transformationType].name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-purple-700">Transformación:</span>
            <span className="ml-2 font-mono text-purple-600">
              {transformationConfigs[transformationType].formula}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Valor actual:</span>
            <span className="ml-2 font-mono text-purple-600">
              {transformationValue.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Descripción:</span>
            <span className="ml-2 text-purple-600">
              {transformationConfigs[transformationType].description}
            </span>
          </div>
          <div>
            <span className="font-medium text-purple-700">Estado:</span>
            <span className="ml-2 text-purple-600">
              {showParticles ? 'Partículas activas' : 'Partículas inactivas'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariableChangeVisualization

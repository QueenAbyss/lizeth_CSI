"use client"

import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

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
  
  // Referencias para D3
  const svgRef = useRef<SVGSVGElement>(null)
  const [svg, setSvg] = useState<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null)
  
  // Configuración de la gráfica
  const margin = { top: 20, right: 20, bottom: 60, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  
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
    const familyPoints = []
    const step = 0.1
    
    cValues.forEach((c, index) => {
      const points = []
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

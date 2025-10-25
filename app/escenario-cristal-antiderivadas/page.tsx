"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  StarIcon,
  Wand2Icon,
  BookIcon,
  EyeIcon,
  LightbulbIcon,
  TrophyIcon,
  ClockIcon,
  SparklesIcon,
  DiamondIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  SparkleIcon
} from 'lucide-react'

// Importar las clases del escenario
import { EscenarioFactory } from '@/src/escenarios/EscenarioFactory.js'
import { CalculadoraAntiderivadas } from '@/src/servicios/CalculadoraAntiderivadas.js'
import { FuncionMatematica } from '@/src/entidades/FuncionMatematica.js'
import { Antiderivada } from '@/src/entidades/Antiderivada.js'

// Componente de visualización de Integrales Indefinidas
const IndefiniteIntegralsVisualization = ({
  funcionSeleccionada,
  constanteC,
  mostrarFamilia,
  animacionActiva,
  setConstanteC,
  setAnimacionActiva,
  setMostrarFamilia,
  funciones,
  logrosDesbloqueados,
  tiempoSesion
}: any) => {
  return (
    <div className="flex gap-6">
      {/* Panel Principal de Visualización */}
      <div className="flex-1 bg-white rounded-lg p-6 shadow-lg">
        <div className="mb-4">
          <select className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
            <option>¿Qué muestra la gráfica?</option>
            <option>La función original f(x) y su familia de antiderivadas F(x) + C</option>
          </select>
        </div>

        {/* Gráfico Principal */}
        <div className="relative bg-gray-50 rounded-lg p-4 h-96">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Ejes */}
            <line x1="50" y1="150" x2="350" y2="150" stroke="black" strokeWidth="2"/>
            <line x1="200" y1="50" x2="200" y2="250" stroke="black" strokeWidth="2"/>
            
            {/* Función original f(x) */}
            <path 
              d="M 50 250 Q 200 50 350 50" 
              stroke="red" 
              strokeWidth="3" 
              fill="none"
            />
            <text x="300" y="40" className="text-sm font-semibold text-red-600">f(x) = x²</text>
            
            {/* Familia de antiderivadas F(x) + C */}
            {mostrarFamilia && (
              <>
                {[-2, -1, 0, 1, 2].map((c, index) => (
                  <path 
                    key={index}
                    d={`M 50 ${250 - c*20} Q 200 ${150 - c*20} 350 ${150 - c*20}`}
                    stroke={index === 2 ? 'blue' : 'gray'}
                    strokeWidth={index === 2 ? '3' : '2'}
                    strokeDasharray="5,5"
                    fill="none"
                  />
                ))}
                <text x="300" y="120" className="text-sm font-semibold text-blue-600">
                  F(x) = x³/3 + C
                </text>
                <text x="300" y="140" className="text-xs text-gray-600">C = 0</text>
              </>
            )}

            {/* Indicador de C actual */}
            <rect x="180" y="140" width="40" height="20" fill="yellow" stroke="orange" strokeWidth="2"/>
            <text x="185" y="152" className="text-xs font-bold">F(x) + 0</text>
          </svg>
        </div>
      </div>

      {/* Panel de Control Derecho */}
      <div className="w-80 space-y-6">
        {/* Selección de Hada/Función */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <SparkleIcon className="w-5 h-5" />
              Elige tu Hada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(funciones).map(([key, func]) => (
                <Button
                  key={key}
                  onClick={() => {/* Lógica de selección */}}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    funcionSeleccionada === key 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {key === 'quadratic' && 'Hada Cuadrática'}
                  {key === 'linear' && 'Hada Lineal'}
                  {key === 'exponential' && 'Hada Exponencial'}
                  {key === 'sine' && 'Hada Ondulante'}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Control de Familia Mágica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <SparkleIcon className="w-5 h-5" />
              Familia Mágica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setMostrarFamilia(!mostrarFamilia)}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mb-4"
            >
              {mostrarFamilia ? 'Ocultar' : 'Mostrar'}
            </Button>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Constante C</label>
              <Input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={constanteC}
                onChange={(e) => setConstanteC(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                Valor: {constanteC.toFixed(1)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animación */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <SparkleIcon className="w-5 h-5" />
              Animación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setAnimacionActiva(!animacionActiva)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mb-2"
            >
              {animacionActiva ? 'Pausar' : 'Deslizar'}
            </Button>
            <p className="text-sm text-gray-600">
              Desliza automáticamente por las familias
            </p>
          </CardContent>
        </Card>

        {/* Información de la Función Seleccionada */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <SparkleIcon className="w-5 h-5" />
              {funciones[funcionSeleccionada as keyof typeof funciones]?.nombre || 'Hada Seleccionada'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">f(x):</span>
                <span className="font-mono">{funciones[funcionSeleccionada as keyof typeof funciones]?.f}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">F(x):</span>
                <span className="font-mono">{funciones[funcionSeleccionada as keyof typeof funciones]?.F}</span>
              </div>
              <div className="text-center text-gray-600">
                C = {constanteC.toFixed(1)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logros y Cronómetro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <TrophyIcon className="w-5 h-5" />
              Logros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <div>{logrosDesbloqueados.length} de 5 desbloqueados</div>
              <div className="mt-2">
                <div className="font-medium">Primera Exploración</div>
                <div className="text-xs">Explora tu primera función</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              Cronómetro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-mono">{new Date(tiempoSesion * 1000).toISOString().substring(11, 19)}</div>
              <div className="text-sm text-gray-600">Tiempo en visualización</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente de visualización de Cambio de Variable
const VariableChangeVisualization = ({
  tipoTransformacion,
  valorTransformacion,
  mostrarTransformacion,
  mostrarParticulas,
  setValorTransformacion,
  setMostrarTransformacion,
  setMostrarParticulas,
  transformaciones,
  logrosDesbloqueados,
  tiempoSesion
}: any) => {
  return (
    <div className="flex gap-6">
      {/* Panel Principal de Visualización */}
      <div className="flex-1 bg-white rounded-lg p-6 shadow-lg">
        <div className="mb-4">
          <select className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
            <option>¿Qué muestra la gráfica?</option>
            <option>La función original f(x) y su transformación f(u)</option>
          </select>
        </div>

        {/* Gráfico Principal */}
        <div className="relative bg-gray-50 rounded-lg p-4 h-96">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            {/* Ejes */}
            <line x1="50" y1="150" x2="350" y2="150" stroke="black" strokeWidth="2"/>
            <line x1="200" y1="50" x2="200" y2="250" stroke="black" strokeWidth="2"/>
            
            {/* Función original f(x) = x² */}
            <path 
              d="M 50 250 Q 200 50 350 250" 
              stroke="purple" 
              strokeWidth="3" 
              fill="none"
            />
            <text x="300" y="40" className="text-sm font-semibold text-purple-600">f(x) = x²</text>
            
            {/* Función transformada f(u) */}
            <path 
              d="M 50 250 Q 150 50 300 250" 
              stroke="red" 
              strokeWidth="3" 
              strokeDasharray="5,5"
              fill="none"
            />
            <text x="250" y="40" className="text-sm font-semibold text-red-600">f(u) = x²</text>
            
            {/* Flecha de transformación */}
            <path 
              d="M 200 50 Q 175 30 150 50" 
              stroke="yellow" 
              strokeWidth="3" 
              fill="none"
            />
            <text x="160" y="35" className="text-xs font-bold">Transformación</text>
            
            {/* Información de transformación */}
            <text x="50" y="30" className="text-sm font-semibold">f(x) = x²</text>
            <text x="50" y="45" className="text-sm">Transformación: u = x + 1</text>
            <text x="50" y="60" className="text-sm">Valor: {valorTransformacion}</text>
          </svg>
        </div>

        {/* Información de la transformación actual */}
        <div className="mt-4 bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 flex items-center gap-2">
            <Wand2Icon className="w-5 h-5" />
            {transformaciones[tipoTransformacion as keyof typeof transformaciones]?.name}
          </h3>
          <p className="text-sm text-purple-700 mt-1">
            Transformación lineal simple
          </p>
          <p className="text-sm font-mono text-purple-600">
            Transformación: u = x + {valorTransformacion}
          </p>
        </div>
      </div>

      {/* Panel de Control Derecho */}
      <div className="w-80 space-y-6">
        {/* Transformaciones Mágicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <Wand2Icon className="w-5 h-5" />
              Transformaciones Mágicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(transformaciones).map(([key, trans]) => (
                <Button
                  key={key}
                  onClick={() => {/* Lógica de selección */}}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    tipoTransformacion === key 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {trans.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Control Mágico */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <Wand2Icon className="w-5 h-5" />
              Control Mágico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setMostrarTransformacion(!mostrarTransformacion)}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mb-4"
            >
              {mostrarTransformacion ? 'Ocultar' : 'Mostrar'}
            </Button>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Valor de Transformación</label>
              <Input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={valorTransformacion}
                onChange={(e) => setValorTransformacion(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                Valor = {valorTransformacion.toFixed(1)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Efectos Mágicos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <Wand2Icon className="w-5 h-5" />
              Efectos Mágicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                onClick={() => setMostrarParticulas(!mostrarParticulas)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                {mostrarParticulas ? 'Ocultar Partículas' : 'Mostrar Partículas'}
              </Button>
              <Button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg">
                Mostrar Partículas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logros y Cronómetro */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <TrophyIcon className="w-5 h-5" />
              Logros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Logros desbloqueados</span>
                <span className="text-purple-600">▼</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              Cronómetro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-mono">{new Date(tiempoSesion * 1000).toISOString().substring(11, 19)}</div>
              <div className="text-sm text-gray-600">Tiempo total</div>
              <div className="text-xs text-gray-500">Detenido</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function EscenarioCristalAntiderivadas() {
  const router = useRouter()
  const escenarioFactory = useRef(new EscenarioFactory())
  const escenario = useRef(escenarioFactory.current.crearEscenario('escenario-4'))

  // Estados principales del escenario
  const [temaActivo, setTemaActivo] = useState<'integrales_indefinidas' | 'cambio_variable'>('integrales_indefinidas')
  const [seccionActiva, setSeccionActiva] = useState<'teoria' | 'visualizacion' | 'ejemplos'>('teoria')

  // Estados para Integrales Indefinidas
  const [funcionSeleccionada, setFuncionSeleccionada] = useState('quadratic')
  const [constanteC, setConstanteC] = useState(0)
  const [mostrarFamilia, setMostrarFamilia] = useState(true)
  const [animacionActiva, setAnimacionActiva] = useState(false)

  // Estados para Cambio de Variable
  const [tipoTransformacion, setTipoTransformacion] = useState('linear')
  const [valorTransformacion, setValorTransformacion] = useState(1)
  const [mostrarTransformacion, setMostrarTransformacion] = useState(true)
  const [mostrarParticulas, setMostrarParticulas] = useState(false)

  // Estados de tiempo y logros (simulados por ahora)
  const [tiempoSesion, setTiempoSesion] = useState(0)
  const [logrosDesbloqueados, setLogrosDesbloqueados] = useState<string[]>([])
  const [progresoLogros, setProgresoLogros] = useState({ total: 9, desbloqueados: 0 })

  // Funciones disponibles para Integrales Indefinidas
  const funciones = {
    quadratic: { f: 'x²', F: 'x³/3 + C', color: 'red', nombre: 'Hada Cuadrática' },
    linear: { f: 'x', F: 'x²/2 + C', color: 'blue', nombre: 'Hada Lineal' },
    exponential: { f: 'eˣ', F: 'eˣ + C', color: 'green', nombre: 'Hada Exponencial' },
    sine: { f: 'sin(x)', F: '-cos(x) + C', color: 'purple', nombre: 'Hada Ondulante' }
  }

  // Transformaciones disponibles para Cambio de Variable
  const transformaciones = {
    linear: { name: 'Hada Lineal', formula: 'u = x + C' },
    quadratic: { name: 'Hada Cuadrática', formula: 'u = x² + C' },
    exponential: { name: 'Hada Exponencial', formula: 'u = eˣ + C' },
    sine: { name: 'Hada Ondulante', formula: 'u = sin(x) + C' }
  }

  // Simulación de cronómetro
  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoSesion(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulación de logros
  useEffect(() => {
    // Lógica para desbloquear logros basada en interacciones
    if (temaActivo === 'integrales_indefinidas' && funcionSeleccionada !== 'quadratic' && !logrosDesbloqueados.includes('primera_exploracion_indefinidas')) {
      setLogrosDesbloqueados(prev => [...prev, 'primera_exploracion_indefinidas'])
    }
    if (temaActivo === 'cambio_variable' && tipoTransformacion !== 'linear' && !logrosDesbloqueados.includes('primera_transformacion_variable')) {
      setLogrosDesbloqueados(prev => [...prev, 'primera_transformacion_variable'])
    }
    setProgresoLogros({ total: 9, desbloqueados: logrosDesbloqueados.length })
  }, [temaActivo, funcionSeleccionada, tipoTransformacion, logrosDesbloqueados])

  // Función para obtener consejos contextuales
  const getCurrentTip = (topic: string, section: string) => {
    if (topic === 'integrales_indefinidas') {
      if (section === 'teoria') return "Recuerda que la constante C representa todas las posibles 'alturas' de la familia de antiderivadas."
      if (section === 'visualizacion') return "Cambia el valor de C para ver cómo se desplaza toda la familia de curvas verticalmente."
      if (section === 'ejemplos') return "Cada función tiene su propia regla de integración. ¡Practica con diferentes tipos!"
    }

    if (topic === 'cambio_variable') {
      if (section === 'teoria') return "La clave del cambio de variable es identificar qué parte de la integral necesita ser sustituida."
      if (section === 'visualizacion') return "Observa cómo la transformación 'mueve' la función en el espacio matemático."
      if (section === 'ejemplos') return "Siempre recuerda sustituir de vuelta al final: reemplaza u con la función original."
    }

    return "¡Explora todas las secciones para dominar estos conceptos matemáticos!"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Navegación Principal */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex bg-purple-100 rounded-full p-1">
            <Button
              onClick={() => setTemaActivo('integrales_indefinidas')}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
                temaActivo === 'integrales_indefinidas'
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-700 hover:bg-purple-200'
              }`}
            >
              <StarIcon className="w-4 h-4" />
              Integrales Indefinidas
            </Button>
            <Button
              onClick={() => setTemaActivo('cambio_variable')}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
                temaActivo === 'cambio_variable'
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-700 hover:bg-purple-200'
              }`}
            >
              <Wand2Icon className="w-4 h-4" />
              Cambio de Variable
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navegación Secundaria */}
        <div className="mb-8">
          <div className="flex bg-purple-100 rounded-full p-1">
            <Button
              onClick={() => setSeccionActiva('teoria')}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
                seccionActiva === 'teoria'
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-700 hover:bg-purple-200'
              }`}
            >
              <BookIcon className="w-4 h-4" />
              Teoría
            </Button>
            <Button
              onClick={() => setSeccionActiva('visualizacion')}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
                seccionActiva === 'visualizacion'
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-700 hover:bg-purple-200'
              }`}
            >
              <EyeIcon className="w-4 h-4" />
              Visualización
            </Button>
            <Button
              onClick={() => setSeccionActiva('ejemplos')}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
                seccionActiva === 'ejemplos'
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-700 hover:bg-purple-200'
              }`}
            >
              <LightbulbIcon className="w-4 h-4" />
              Ejemplos
            </Button>
          </div>
        </div>

        {/* Renderizado del Contenido */}
        {temaActivo === 'integrales_indefinidas' && (
          <>
            {seccionActiva === 'teoria' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-purple-800 flex items-center justify-center gap-3">
                    <StarIcon className="w-8 h-8" />
                    Integrales Indefinidas
                    <DiamondIcon className="w-8 h-8 text-pink-500" />
                  </CardTitle>
                  <CardDescription className="text-lg text-purple-600 mt-2 flex items-center justify-center gap-2">
                    <SparkleIcon className="w-5 h-5 text-yellow-500" />
                    Descubre las familias de antiderivadas y cómo la constante C crea infinitas posibilidades
                    <SparkleIcon className="w-5 h-5 text-yellow-500" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">¿Qué son las Integrales Indefinidas?</h2>
                    <p className="text-gray-700 mb-4">
                      Las integrales indefinidas son el proceso inverso de la derivación. Si F'(x) = f(x),
                      entonces ∫f(x)dx = F(x) + C, donde C es una constante arbitraria.
                    </p>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800">Conceptos Clave:</h3>
                      <ul className="list-disc list-inside text-purple-700 mt-2 space-y-1">
                        <li><strong>Antiderivada:</strong> Una función F(x) tal que F'(x) = f(x)</li>
                        <li><strong>Constante C:</strong> Representa todas las posibles "alturas" de la familia</li>
                        <li><strong>Familia de funciones:</strong> Infinitas curvas que difieren solo en una constante</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {seccionActiva === 'visualizacion' && (
              <IndefiniteIntegralsVisualization
                funcionSeleccionada={funcionSeleccionada}
                constanteC={constanteC}
                mostrarFamilia={mostrarFamilia}
                animacionActiva={animacionActiva}
                setConstanteC={setConstanteC}
                setAnimacionActiva={setAnimacionActiva}
                setMostrarFamilia={setMostrarFamilia}
                funciones={funciones}
                logrosDesbloqueados={logrosDesbloqueados}
                tiempoSesion={tiempoSesion}
              />
            )}
            {seccionActiva === 'ejemplos' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-800">Ejemplos de Integrales Indefinidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      id: 1,
                      title: "Integral de una Potencia",
                      problem: "∫ x² dx",
                      solution: "x³/3 + C",
                      explanation: "Aplicamos la regla de la potencia: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C"
                    },
                    {
                      id: 2,
                      title: "Integral de una Constante",
                      problem: "∫ 5 dx",
                      solution: "5x + C",
                      explanation: "La integral de una constante es la constante por x más C"
                    },
                    {
                      id: 3,
                      title: "Integral de una Exponencial",
                      problem: "∫ eˣ dx",
                      solution: "eˣ + C",
                      explanation: "La exponencial es su propia antiderivada"
                    }
                  ].map((example) => (
                    <div key={example.id} className="bg-white rounded-lg p-6 shadow-lg">
                      <h3 className="text-xl font-semibold mb-3">{example.title}</h3>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="text-lg font-mono text-center">
                          {example.problem} = {example.solution}
                        </div>
                      </div>
                      <p className="text-gray-700">{example.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {temaActivo === 'cambio_variable' && (
          <>
            {seccionActiva === 'teoria' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-purple-800 flex items-center justify-center gap-3">
                    <Wand2Icon className="w-8 h-8" />
                    Cambio de Variable
                    <SparkleIcon className="w-8 h-8 text-pink-500" />
                  </CardTitle>
                  <CardDescription className="text-lg text-purple-600 mt-2 flex items-center justify-center gap-2">
                    <SparkleIcon className="w-5 h-5 text-yellow-500" />
                    Aprende el arte de la transformación mágica que simplifica las integrales más complejas
                    <SparkleIcon className="w-5 h-5 text-yellow-500" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">¿Qué es el Cambio de Variable?</h2>
                    <p className="text-gray-700 mb-4">
                      El cambio de variable (o sustitución) es una técnica que transforma integrales complejas
                      en formas más simples mediante la sustitución u = g(x).
                    </p>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800">Pasos del Método:</h3>
                      <ol className="list-decimal list-inside text-purple-700 mt-2 space-y-1">
                        <li><strong>Identificar:</strong> Encontrar la función interna g(x) para sustituir</li>
                        <li><strong>Sustituir:</strong> Hacer u = g(x) y du = g'(x)dx</li>
                        <li><strong>Integrar:</strong> Resolver la integral en términos de u</li>
                        <li><strong>Reemplazar:</strong> Sustituir u de vuelta con g(x)</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {seccionActiva === 'visualizacion' && (
              <VariableChangeVisualization
                tipoTransformacion={tipoTransformacion}
                valorTransformacion={valorTransformacion}
                mostrarTransformacion={mostrarTransformacion}
                mostrarParticulas={mostrarParticulas}
                setValorTransformacion={setValorTransformacion}
                setMostrarTransformacion={setMostrarTransformacion}
                setMostrarParticulas={setMostrarParticulas}
                transformaciones={transformaciones}
                logrosDesbloqueados={logrosDesbloqueados}
                tiempoSesion={tiempoSesion}
              />
            )}
            {seccionActiva === 'ejemplos' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-800">Ejemplos de Cambio de Variable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      id: 1,
                      title: "Cambio de Variable Lineal",
                      problem: "∫ (2x + 1)³ dx",
                      steps: [
                        "Identificar: u = 2x + 1",
                        "Calcular: du = 2dx, entonces dx = du/2",
                        "Sustituir: ∫ u³ (du/2) = (1/2)∫ u³ du",
                        "Integrar: (1/2)(u⁴/4) + C = u⁴/8 + C",
                        "Reemplazar: (2x + 1)⁴/8 + C"
                      ],
                      solution: "(2x + 1)⁴/8 + C"
                    },
                    {
                      id: 2,
                      title: "Cambio de Variable con Exponencial",
                      problem: "∫ x e^(x²) dx",
                      steps: [
                        "Identificar: u = x²",
                        "Calcular: du = 2x dx, entonces x dx = du/2",
                        "Sustituir: ∫ e^u (du/2) = (1/2)∫ e^u du",
                        "Integrar: (1/2)e^u + C",
                        "Reemplazar: (1/2)e^(x²) + C"
                      ],
                      solution: "(1/2)e^(x²) + C"
                    }
                  ].map((example) => (
                    <div key={example.id} className="bg-white rounded-lg p-6 shadow-lg">
                      <h3 className="text-xl font-semibold mb-3">{example.title}</h3>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="text-lg font-mono text-center">
                          {example.problem}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-purple-800">Pasos de la Solución:</h4>
                        {example.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 bg-green-50 p-4 rounded-lg">
                        <div className="text-lg font-mono text-center text-green-800">
                          Solución: {example.solution}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Barra de Consejos */}
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-300 p-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-yellow-800 font-medium">
            💡 Consejo de las Hadas: {getCurrentTip(temaActivo, seccionActiva)}
          </p>
        </div>
      </div>
    </div>
  )
}
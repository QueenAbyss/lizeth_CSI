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
  RotateCcwIcon
} from 'lucide-react'

// Importar las clases del escenario
import { EscenarioFactory } from '@/src/escenarios/EscenarioFactory.js'
import { CalculadoraAntiderivadas } from '@/src/servicios/CalculadoraAntiderivadas.js'
import { FuncionMatematica } from '@/src/entidades/FuncionMatematica.js'
import { Antiderivada } from '@/src/entidades/Antiderivada.js'

// Importar los nuevos componentes
import IndefiniteIntegralsVisualization from '@/components/IndefiniteIntegralsVisualization'
import IndefiniteIntegralsExamples from '@/components/IndefiniteIntegralsExamples'
import VariableChangeVisualization from '@/components/VariableChangeVisualization'
import VariableChangeExamples from '@/components/VariableChangeExamples'


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

  // Estados de tiempo y logros (simulados por ahora)
  const [tiempoSesion, setTiempoSesion] = useState(0)
  const [logrosDesbloqueados, setLogrosDesbloqueados] = useState<string[]>([])
  const [progresoLogros, setProgresoLogros] = useState({ total: 9, desbloqueados: 0 })

  // Funciones disponibles para Integrales Indefinidas
  const funciones = {
    quadratic: { f: 'x^2', F: 'x^3/3 + C', color: 'red', nombre: 'Hada Cuadratica' },
    linear: { f: 'x', F: 'x^2/2 + C', color: 'blue', nombre: 'Hada Lineal' },
    exponential: { f: 'e^x', F: 'e^x + C', color: 'green', nombre: 'Hada Exponencial' },
    sine: { f: 'sin(x)', F: '-cos(x) + C', color: 'purple', nombre: 'Hada Ondulante' }
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
    setProgresoLogros({ total: 9, desbloqueados: logrosDesbloqueados.length })
  }, [temaActivo, funcionSeleccionada, logrosDesbloqueados])

  // Función para obtener consejos contextuales
  const getCurrentTip = (topic: string, section: string) => {
    if (topic === 'integrales_indefinidas') {
      if (section === 'teoria') return "Recuerda que la constante C representa todas las posibles 'alturas' de la familia de antiderivadas."
      if (section === 'visualizacion') return "Cambia el valor de C para ver como se desplaza toda la familia de curvas verticalmente."
      if (section === 'ejemplos') return "Cada función tiene su propia regla de integración. ¡Practica con diferentes tipos!"
    }

    if (topic === 'cambio_variable') {
      if (section === 'teoria') return "La clave del cambio de variable es identificar que parte de la integral necesita ser sustituida."
      if (section === 'visualizacion') return "Observa como la transformacion 'mueve' la funcion en el espacio matematico."
      if (section === 'ejemplos') return "Siempre recuerda sustituir de vuelta al final: reemplaza u con la funcion original."
    }

    return "¡Explora todas las secciones para dominar estos conceptos matematicos!"
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
              Teoria
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
              Visualizacion
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
                    <SparklesIcon className="w-5 h-5 text-yellow-500" />
                    Descubre las familias de antiderivadas y como la constante C crea infinitas posibilidades
                    <SparklesIcon className="w-5 h-5 text-yellow-500" />
                  </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Que son las Integrales Indefinidas?</h2>
                    <p className="text-gray-700 mb-4">
                      Las integrales indefinidas son el proceso inverso de la derivacion. Si F'(x) = f(x),
                      entonces ∫f(x)dx = F(x) + C, donde C es una constante arbitraria.
                    </p>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800">Conceptos Clave:</h3>
                      <ul className="list-disc list-inside text-purple-700 mt-2 space-y-1">
                        <li><strong>Antiderivada:</strong> Una funcion F(x) tal que F'(x) = f(x)</li>
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
                width={800}
                height={600}
                className="w-full"
              />
            )}
            {seccionActiva === 'ejemplos' && (
              <IndefiniteIntegralsExamples />
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
                    <SparklesIcon className="w-8 h-8 text-pink-500" />
                  </CardTitle>
                  <CardDescription className="text-lg text-purple-600 mt-2 flex items-center justify-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-yellow-500" />
                    Aprende el arte de la transformacion magica que simplifica las integrales mas complejas
                    <SparklesIcon className="w-5 h-5 text-yellow-500" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Que es el Cambio de Variable?</h2>
                    <p className="text-gray-700 mb-4">
                      El cambio de variable (o sustitucion) es una tecnica que transforma integrales complejas
                      en formas mas simples mediante la sustitucion u = g(x).
                    </p>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800">Pasos del Metodo:</h3>
                      <ol className="list-decimal list-inside text-purple-700 mt-2 space-y-1">
                        <li><strong>Identificar:</strong> Encontrar la funcion interna g(x) para sustituir</li>
                        <li><strong>Sustituir:</strong> Hacer u = g(x) y du = g'(x)dx</li>
                        <li><strong>Integrar:</strong> Resolver la integral en terminos de u</li>
                        <li><strong>Reemplazar:</strong> Sustituir u de vuelta con g(x)</li>
                      </ol>
                  </div>
                  </div>
            </CardContent>
          </Card>
            )}
            {seccionActiva === 'visualizacion' && (
              <VariableChangeVisualization 
                width={800}
                height={600}
                className="w-full"
              />
            )}
            {seccionActiva === 'ejemplos' && (
              <VariableChangeExamples />
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
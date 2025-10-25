"use client"

import React, { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline'

interface Example {
  id: number
  title: string
  problem: string
  solution: string
  explanation: string
  steps: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

const IndefiniteIntegralsExamples: React.FC = () => {
  const [currentExample, setCurrentExample] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [completedExamples, setCompletedExamples] = useState<number[]>([])

  // Base de datos de ejemplos
  const examples: Example[] = [
    {
      id: 1,
      title: "Integral de una Potencia",
      problem: "∫ x² dx",
      solution: "x³/3 + C",
      explanation: "Aplicamos la regla de la potencia: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
      steps: [
        "Identificar que es una integral de potencia",
        "Aplicar la regla: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
        "Para n = 2: ∫ x² dx = x²⁺¹/(2+1) + C",
        "Simplificar: x³/3 + C"
      ],
      difficulty: 'easy',
      category: 'power'
    },
    {
      id: 2,
      title: "Integral de una Constante",
      problem: "∫ 5 dx",
      solution: "5x + C",
      explanation: "La integral de una constante es la constante por x más C",
      steps: [
        "Identificar que es una integral de constante",
        "Aplicar la regla: ∫ k dx = kx + C",
        "Para k = 5: ∫ 5 dx = 5x + C"
      ],
      difficulty: 'easy',
      category: 'constant'
    },
    {
      id: 3,
      title: "Integral de una Exponencial",
      problem: "∫ eˣ dx",
      solution: "eˣ + C",
      explanation: "La exponencial es su propia antiderivada",
      steps: [
        "Identificar que es una integral exponencial",
        "Aplicar la regla: ∫ eˣ dx = eˣ + C",
        "La exponencial es su propia antiderivada"
      ],
      difficulty: 'easy',
      category: 'exponential'
    },
    {
      id: 4,
      title: "Integral de una Función Trigonométrica",
      problem: "∫ sin(x) dx",
      solution: "-cos(x) + C",
      explanation: "La antiderivada del seno es menos coseno",
      steps: [
        "Identificar que es una integral trigonométrica",
        "Aplicar la regla: ∫ sin(x) dx = -cos(x) + C",
        "Recordar que la derivada de -cos(x) es sin(x)"
      ],
      difficulty: 'medium',
      category: 'trigonometric'
    },
    {
      id: 5,
      title: "Integral de una Suma",
      problem: "∫ (x² + 3x + 2) dx",
      solution: "x³/3 + 3x²/2 + 2x + C",
      explanation: "La integral de una suma es la suma de las integrales",
      steps: [
        "Aplicar la propiedad de linealidad: ∫ (f + g) dx = ∫ f dx + ∫ g dx",
        "Integrar cada término por separado",
        "∫ x² dx = x³/3 + C₁",
        "∫ 3x dx = 3x²/2 + C₂",
        "∫ 2 dx = 2x + C₃",
        "Combinar: x³/3 + 3x²/2 + 2x + C"
      ],
      difficulty: 'medium',
      category: 'sum'
    }
  ]

  // Función para normalizar respuestas
  const normalizeAnswer = (answer: string) => {
    return answer
      .trim()                    // Eliminar espacios al inicio y final
      .replace(/\s+/g, '')       // Eliminar todos los espacios internos
      .toLowerCase()             // Convertir a minúsculas
      .replace(/\^/g, '')        // Eliminar símbolos de potencia
      .replace(/\*/g, '')        // Eliminar asteriscos
  }

  // Función para verificar la respuesta
  const checkAnswer = () => {
    const correctAnswer = examples[currentExample].solution
    const normalizedUserAnswer = normalizeAnswer(userAnswer)
    const normalizedCorrectAnswer = normalizeAnswer(correctAnswer)
    
    const isAnswerCorrect = normalizedUserAnswer === normalizedCorrectAnswer
    setIsCorrect(isAnswerCorrect)
    
    if (isAnswerCorrect && !completedExamples.includes(currentExample)) {
      setCompletedExamples([...completedExamples, currentExample])
    }
  }

  // Función para mostrar la solución
  const showSolutionHandler = () => {
    setShowSolution(true)
    setIsCorrect(null)
  }

  // Función para ir al siguiente ejemplo
  const nextExample = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample(currentExample + 1)
      setUserAnswer('')
      setShowSolution(false)
      setIsCorrect(null)
    }
  }

  // Función para ir al ejemplo anterior
  const previousExample = () => {
    if (currentExample > 0) {
      setCurrentExample(currentExample - 1)
      setUserAnswer('')
      setShowSolution(false)
      setIsCorrect(null)
    }
  }

  // Función para reiniciar el ejemplo
  const resetExample = () => {
    setUserAnswer('')
    setShowSolution(false)
    setIsCorrect(null)
  }

  return (
    <div className="indefinite-integrals-examples">
      {/* Header con progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-800">
            Ejemplos de Integrales Indefinidas
          </h2>
          <div className="text-sm text-gray-600">
            {completedExamples.length} de {examples.length} completados
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedExamples.length / examples.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Navegación de ejemplos */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={previousExample}
          disabled={currentExample === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentExample === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          ← Anterior
        </button>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-800">
            Ejemplo {currentExample + 1} de {examples.length}
          </div>
          <div className="text-sm text-gray-600">
            {examples[currentExample].title}
          </div>
        </div>
        
        <button
          onClick={nextExample}
          disabled={currentExample === examples.length - 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentExample === examples.length - 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          Siguiente →
        </button>
      </div>

      {/* Ejemplo actual */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-purple-800">
              {examples[currentExample].title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              examples[currentExample].difficulty === 'easy' 
                ? 'bg-green-100 text-green-800'
                : examples[currentExample].difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {examples[currentExample].difficulty === 'easy' ? 'Fácil' : 
               examples[currentExample].difficulty === 'medium' ? 'Medio' : 'Difícil'}
            </span>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-xl font-mono text-center text-gray-800">
              {examples[currentExample].problem}
            </div>
          </div>
        </div>

        {/* Área de respuesta del usuario */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu respuesta:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
            />
            <button
              onClick={checkAnswer}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Verificar
            </button>
          </div>
        </div>

        {/* Resultado de la verificación */}
        {isCorrect !== null && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {isCorrect ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            ) : (
              <XCircleIcon className="w-6 h-6 text-red-500" />
            )}
            <div>
              <div className={`font-semibold ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </div>
              {!isCorrect && (
                <div className="text-sm text-red-600">
                  Inténtalo de nuevo o revisa la solución
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={showSolutionHandler}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Ver Solución
          </button>
          <button
            onClick={resetExample}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Reiniciar
          </button>
        </div>

        {/* Solución paso a paso */}
        {showSolution && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <LightBulbIcon className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Solución Paso a Paso</h4>
            </div>
            
            <div className="mb-3">
              <div className="text-sm font-medium text-blue-700 mb-1">Problema:</div>
              <div className="text-lg font-mono text-blue-800">
                {examples[currentExample].problem}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-sm font-medium text-blue-700 mb-1">Solución:</div>
              <div className="text-lg font-mono text-blue-800">
                {examples[currentExample].solution}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-sm font-medium text-blue-700 mb-2">Pasos:</div>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                {examples[currentExample].steps.map((step, index) => (
                  <li key={index} className="text-sm">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="text-sm text-blue-700">
              <strong>Explicación:</strong> {examples[currentExample].explanation}
            </div>
          </div>
        )}
      </div>

      {/* Lista de ejemplos completados */}
      {completedExamples.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">
            Ejemplos Completados ({completedExamples.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {completedExamples.map((exampleId) => (
              <span
                key={exampleId}
                className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium"
              >
                {examples[exampleId].title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Consejos y ayuda */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-600" />
          <h4 className="font-semibold text-yellow-800">Consejos</h4>
        </div>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Recuerda siempre agregar la constante C al final</li>
          <li>• La integral de una suma es la suma de las integrales</li>
          <li>• Para potencias: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C</li>
          <li>• Para constantes: ∫ k dx = kx + C</li>
          <li>• Para exponenciales: ∫ eˣ dx = eˣ + C</li>
        </ul>
      </div>
    </div>
  )
}

export default IndefiniteIntegralsExamples

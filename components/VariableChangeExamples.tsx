import React, { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface Example {
  id: number
  title: string
  problem: string
  solution: string
  explanation: string
  steps: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  transformation: string
}

const VariableChangeExamples: React.FC = () => {
  const [currentExample, setCurrentExample] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showSolution, setShowSolution] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [completedExamples, setCompletedExamples] = useState<number[]>([])

  // Base de datos de ejemplos
  const examples: Example[] = [
    {
      id: 1,
      title: "Hada Lineal",
      problem: "∫ (2x + 1)³ ⋅ 2 dx",
      solution: "(2x + 1)⁴/8 + C",
      explanation: "Aplicamos la sustitución u = 2x + 1, entonces du = 2dx",
      steps: [
        "Identificar la sustitución: u = 2x + 1",
        "Calcular du: du = 2dx, entonces dx = du/2",
        "Sustituir en la integral: ∫ u³ (du/2)",
        "Simplificar: (1/2)∫ u³ du",
        "Integrar: (1/2)(u⁴/4) + C = u⁴/8 + C",
        "Sustituir de vuelta: (2x + 1)⁴/8 + C"
      ],
      difficulty: 'easy',
      category: 'linear',
      transformation: 'u = 2x + 1'
    },
    {
      id: 2,
      title: "Hada Cuadrática",
      problem: "∫ x e^(x²) dx",
      solution: "(1/2)e^(x²) + C",
      explanation: "Aplicamos la sustitución u = x², entonces du = 2x dx",
      steps: [
        "Identificar la sustitución: u = x²",
        "Calcular du: du = 2x dx, entonces x dx = du/2",
        "Sustituir en la integral: ∫ e^u (du/2)",
        "Simplificar: (1/2)∫ e^u du",
        "Integrar: (1/2)e^u + C",
        "Sustituir de vuelta: (1/2)e^(x²) + C"
      ],
      difficulty: 'medium',
      category: 'exponential',
      transformation: 'u = x²'
    },
    {
      id: 3,
      title: "Hada Exponencial",
      problem: "∫ (3x + 2)⁵ dx",
      solution: "(3x + 2)⁶/18 + C",
      explanation: "Aplicamos la sustitución u = 3x + 2, entonces du = 3dx",
      steps: [
        "Identificar la sustitución: u = 3x + 2",
        "Calcular du: du = 3dx, entonces dx = du/3",
        "Sustituir en la integral: ∫ u⁵ (du/3)",
        "Simplificar: (1/3)∫ u⁵ du",
        "Integrar: (1/3)(u⁶/6) + C = u⁶/18 + C",
        "Sustituir de vuelta: (3x + 2)⁶/18 + C"
      ],
      difficulty: 'medium',
      category: 'power',
      transformation: 'u = 3x + 2'
    },
    {
      id: 4,
      title: "Hada Ondulante",
      problem: "∫ sin(x) cos(x) dx",
      solution: "sin²(x)/2 + C",
      explanation: "Aplicamos la sustitución u = sin(x), entonces du = cos(x) dx",
      steps: [
        "Identificar la sustitución: u = sin(x)",
        "Calcular du: du = cos(x) dx",
        "Sustituir en la integral: ∫ u du",
        "Integrar: u²/2 + C",
        "Sustituir de vuelta: sin²(x)/2 + C"
      ],
      difficulty: 'hard',
      category: 'trigonometric',
      transformation: 'u = sin(x)'
    },
    {
      id: 5,
      title: "Hada Trigonométrica",
      problem: "∫ x √(x² + 1) dx",
      solution: "(x² + 1)^(3/2)/3 + C",
      explanation: "Aplicamos la sustitución u = x² + 1, entonces du = 2x dx",
      steps: [
        "Identificar la sustitución: u = x² + 1",
        "Calcular du: du = 2x dx, entonces x dx = du/2",
        "Sustituir en la integral: ∫ √u (du/2)",
        "Simplificar: (1/2)∫ u^(1/2) du",
        "Integrar: (1/2)(u^(3/2)/(3/2)) + C = u^(3/2)/3 + C",
        "Sustituir de vuelta: (x² + 1)^(3/2)/3 + C"
      ],
      difficulty: 'hard',
      category: 'radical',
      transformation: 'u = x² + 1'
    }
  ]

  // Función para verificar la respuesta
  const checkAnswer = () => {
    const correctAnswer = examples[currentExample].solution
    const normalizedUserAnswer = userAnswer.trim().replace(/\s+/g, '')
    const normalizedCorrectAnswer = correctAnswer.replace(/\s+/g, '')
    
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
    <div className="variable-change-examples">
      {/* Header con progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6" />
            Transformaciones Mágicas
            <SparklesIcon className="w-6 h-6" />
          </h2>
          <div className="text-sm text-gray-600">
            {completedExamples.length} de {examples.length} completados
          </div>
        </div>
        
        <p className="text-purple-600 mb-4 flex items-center gap-2">
          <SparklesIcon className="w-4 h-4" />
          Practica el arte de la transformación y domina el cambio de variable
          <SparklesIcon className="w-4 h-4" />
        </p>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedExamples.length / examples.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Transformaciones Disponibles */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-800">Transformaciones Disponibles</h3>
            </div>
            
            <div className="space-y-2">
              {examples.map((example, index) => (
                <button
                  key={example.id}
                  onClick={() => {
                    setCurrentExample(index)
                    setUserAnswer('')
                    setShowSolution(false)
                    setIsCorrect(null)
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                    currentExample === index
                      ? 'bg-green-100 border-2 border-green-500 text-green-800'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`text-lg ${
                      example.difficulty === 'easy' ? 'text-green-600' :
                      example.difficulty === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {example.difficulty === 'easy' ? '✨' :
                       example.difficulty === 'medium' ? '✨' : '🌊'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{example.title}</div>
                      <div className="text-xs text-gray-600">{example.transformation}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      example.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-800'
                        : example.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {example.difficulty === 'easy' ? 'easy' : 
                       example.difficulty === 'medium' ? 'medium' : 'hard'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
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
              
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <div className="text-xl font-mono text-center text-gray-800">
                  {examples[currentExample].problem}
                </div>
              </div>
            </div>

            {/* Información de la transformación */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-1">
                Sustitución Sugerida:
              </div>
              <div className="text-lg font-mono text-blue-600">
                {examples[currentExample].transformation}
              </div>
            </div>

            {/* Área de respuesta del usuario */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu Respuesta:
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
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
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
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
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
        </div>
      </div>

      {/* Consejos y ayuda */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-600" />
          <h4 className="font-semibold text-yellow-800">Consejos de las Hadas</h4>
        </div>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Identifica patrones: Busca funciones dentro de otras funciones</li>
          <li>• Calcula du cuidadosamente: No olvides el dx en tu sustitución</li>
          <li>• Verifica tu respuesta: Deriva para confirmar que es correcta</li>
          <li>• Practica mucho: El cambio de variable se vuelve intuitivo con la práctica</li>
        </ul>
      </div>
    </div>
  )
}

export default VariableChangeExamples

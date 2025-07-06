import React, { useState, useEffect } from 'react';
import { Clock, BarChart3, History, BookOpen, Calculator, Atom, Globe, Play, ArrowRight, ArrowLeft, Flag, Home } from 'lucide-react';

const FlowLabENEMSimulator = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedMode, setSelectedMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [currentSimulation, setCurrentSimulation] = useState(null);

  // Banco de questões fictícias
  const questionBank = {
    linguagens: [
      {
        id: 1,
        area: "Linguagens",
        subject: "Português",
        context: "O texto a seguir é um fragmento de uma crônica contemporânea:",
        text: "'A vida urbana moderna transformou nossos hábitos de comunicação. Onde antes conversávamos pessoalmente, agora trocamos mensagens instantâneas.'",
        question: "Qual característica da comunicação moderna é evidenciada no texto?",
        options: [
          "A predominância da oralidade sobre a escrita",
          "A substituição do contato presencial pela comunicação digital",
          "A valorização do diálogo face a face",
          "A resistência às novas tecnologias",
          "A manutenção dos padrões tradicionais de comunicação"
        ],
        correct: 1
      },
      // Mais questões de linguagens...
      {
        id: 2,
        area: "Linguagens",
        subject: "Literatura",
        context: "Sobre o Modernismo brasileiro, analise o contexto histórico:",
        text: "A Semana de Arte Moderna de 1922 marcou uma ruptura com os padrões estéticos vigentes, propondo uma arte genuinamente brasileira.",
        question: "O movimento modernista brasileiro caracterizou-se principalmente por:",
        options: [
          "Manter as tradições parnasianas",
          "Buscar uma identidade nacional na arte",
          "Copiar modelos europeus",
          "Rejeitar qualquer influência externa",
          "Valorizar apenas a arte acadêmica"
        ],
        correct: 1
      }
    ],
    matematica: [
      {
        id: 1,
        area: "Matemática",
        subject: "Álgebra",
        context: "Uma empresa de delivery cobra uma taxa fixa de R$ 5,00 mais R$ 2,00 por quilômetro rodado.",
        text: "",
        question: "Se uma entrega custou R$ 23,00, quantos quilômetros foram percorridos?",
        options: [
          "7 km",
          "8 km", 
          "9 km",
          "10 km",
          "11 km"
        ],
        correct: 2
      },
      {
        id: 2,
        area: "Matemática", 
        subject: "Geometria",
        context: "Um terreno retangular tem 30 metros de largura e 50 metros de comprimento.",
        text: "",
        question: "Qual é a área deste terreno em metros quadrados?",
        options: [
          "80 m²",
          "160 m²",
          "800 m²", 
          "1500 m²",
          "3000 m²"
        ],
        correct: 3
      }
    ],
    cienciasNatureza: [
      {
        id: 1,
        area: "Ciências da Natureza",
        subject: "Física",
        context: "Um objeto é abandonado de uma altura de 45 metros em queda livre.",
        text: "Considerando g = 10 m/s² e desprezando a resistência do ar:",
        question: "Quanto tempo leva para o objeto atingir o solo?",
        options: [
          "1 segundo",
          "2 segundos",
          "3 segundos", 
          "4 segundos",
          "5 segundos"
        ],
        correct: 2
      },
      {
        id: 2,
        area: "Ciências da Natureza",
        subject: "Química", 
        context: "A água (H₂O) é uma substância fundamental para a vida.",
        text: "",
        question: "Qual é a geometria molecular da água?",
        options: [
          "Linear",
          "Angular",
          "Trigonal plana", 
          "Tetraédrica",
          "Octaédrica"
        ],
        correct: 1
      }
    ],
    cienciasHumanas: [
      {
        id: 1,
        area: "Ciências Humanas",
        subject: "História",
        context: "A Revolução Industrial iniciada na Inglaterra no século XVIII transformou profundamente a sociedade.",
        text: "",
        question: "Qual foi uma das principais consequências sociais da Revolução Industrial?",
        options: [
          "O fortalecimento do sistema feudal",
          "A formação da classe operária urbana",
          "O fim do comércio internacional", 
          "A diminuição da população urbana",
          "O retorno à economia agrícola"
        ],
        correct: 1
      },
      {
        id: 2,
        area: "Ciências Humanas",
        subject: "Geografia",
        context: "O Brasil possui uma grande diversidade climática devido à sua extensão territorial.",
        text: "",
        question: "Qual fator geográfico mais influencia o clima brasileiro?",
        options: [
          "Apenas a altitude",
          "Apenas a longitude",
          "A latitude e a continentalidade",
          "Apenas as correntes marítimas", 
          "Apenas a vegetação"
        ],
        correct: 2
      }
    ]
  };

  const areas = [
    { id: 'linguagens', name: 'Linguagens', icon: BookOpen, color: 'from-pink-500 to-purple-600', questions: 45, time: 90 },
    { id: 'matematica', name: 'Matemática', icon: Calculator, color: 'from-purple-500 to-blue-600', questions: 45, time: 90 },
    { id: 'cienciasNatureza', name: 'Ciências da Natureza', icon: Atom, color: 'from-blue-500 to-cyan-600', questions: 45, time: 90 },
    { id: 'cienciasHumanas', name: 'Ciências Humanas', icon: Globe, color: 'from-cyan-500 to-pink-600', questions: 45, time: 90 }
  ];

  // Timer effect
  useEffect(() => {
    let timer;
    if (currentScreen === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishSimulation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentScreen, timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSimulation = (mode) => {
    setSelectedMode(mode);
    setCurrentQuestion(0);
    setAnswers({});
    
    if (mode === 'complete') {
      setTimeLeft(19800); // 5h30min
    } else {
      const area = areas.find(a => a.id === mode);
      setTimeLeft(area.time * 60); // converter para segundos
    }
    
    setCurrentScreen('quiz');
    setCurrentSimulation({
      id: Date.now(),
      mode,
      startTime: new Date(),
      questions: getQuestionsForMode(mode)
    });
  };

  const getQuestionsForMode = (mode) => {
    if (mode === 'complete') {
      return [
        ...questionBank.linguagens,
        ...questionBank.matematica, 
        ...questionBank.cienciasNatureza,
        ...questionBank.cienciasHumanas
      ];
    } else {
      return questionBank[mode] || [];
    }
  };

  const getCurrentQuestions = () => {
    return currentSimulation?.questions || [];
  };

  const selectAnswer = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < getCurrentQuestions().length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishSimulation = () => {
    const questions = getCurrentQuestions();
    const results = calculateResults(questions);
    
    const simulation = {
      ...currentSimulation,
      endTime: new Date(),
      answers,
      results,
      completed: true
    };
    
    setSimulationHistory(prev => [simulation, ...prev]);
    setCurrentScreen('results');
  };

  const calculateResults = (questions) => {
    const results = {
      total: questions.length,
      correct: 0,
      byArea: {}
    };

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correct;
      
      if (isCorrect) results.correct++;
      
      if (!results.byArea[question.area]) {
        results.byArea[question.area] = { total: 0, correct: 0 };
      }
      
      results.byArea[question.area].total++;
      if (isCorrect) results.byArea[question.area].correct++;
    });

    return results;
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <Play className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            FlowLab
          </h1>
          <span className="ml-2 text-gray-600">Simulador ENEM</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Simulador do <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">ENEM</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pratique com questões no estilo ENEM e acompanhe seu desempenho por área de conhecimento
          </p>
        </div>

        {/* Simulation Options */}
        <div className="grid gap-6 mb-8">
          {/* Prova Completa */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6">
                  <Flag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Prova Completa</h3>
                  <p className="text-gray-600">180 questões • 5h30min • Todas as áreas</p>
                </div>
              </div>
              <button
                onClick={() => startSimulation('complete')}
                className="bg-gradient-to-r from-pink-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
              >
                Começar
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* Simulados por Área */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {areas.map((area) => {
              const Icon = area.icon;
              return (
                <div key={area.id} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{area.name}</h3>
                      <p className="text-sm text-gray-600">{area.questions} questões • {area.time}min</p>
                    </div>
                  </div>
                  <button
                    onClick={() => startSimulation(area.id)}
                    className={`w-full bg-gradient-to-r ${area.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                  >
                    Começar
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentScreen('history')}
            className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <History className="w-5 h-5 mr-2" />
            Histórico
          </button>
        </div>
      </div>
    </div>
  );

  const QuizScreen = () => {
    const questions = getCurrentQuestions();
    const question = questions[currentQuestion];
    
    if (!question) return <div>Carregando...</div>;

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
                >
                  <Home className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">
                  Questão {currentQuestion + 1} de {questions.length}
                </h1>
              </div>
              <div className="flex items-center text-lg font-semibold text-gray-800">
                <Clock className="w-5 h-5 mr-2" />
                {formatTime(timeLeft)}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Question Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-8">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="bg-gradient-to-r from-pink-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {question.area}
                </span>
                <span className="ml-3 text-gray-600">{question.subject}</span>
              </div>
              
              {question.context && (
                <div className="bg-gray-50 p-4 rounded-xl mb-4">
                  <p className="text-gray-700">{question.context}</p>
                  {question.text && <p className="text-gray-700 mt-2 font-medium">{question.text}</p>}
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(currentQuestion, index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    answers[currentQuestion] === index
                      ? 'border-pink-500 bg-pink-50 text-pink-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-gray-300 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>

            <div className="flex gap-2">
              {questions.slice(Math.max(0, currentQuestion - 2), Math.min(questions.length, currentQuestion + 3)).map((_, index) => {
                const questionIndex = Math.max(0, currentQuestion - 2) + index;
                return (
                  <button
                    key={questionIndex}
                    onClick={() => setCurrentQuestion(questionIndex)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                      questionIndex === currentQuestion
                        ? 'bg-gradient-to-r from-pink-500 to-blue-600 text-white'
                        : answers[questionIndex] !== undefined
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={finishSimulation}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Flag className="w-5 h-5 mr-2" />
                Finalizar
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Próxima
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ResultsScreen = () => {
    const lastSimulation = simulationHistory[0];
    if (!lastSimulation) return <div>Nenhum resultado encontrado</div>;

    const { results } = lastSimulation;
    const percentage = Math.round((results.correct / results.total) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Resultado do Simulado</h1>
            <button
              onClick={() => setCurrentScreen('home')}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <Home className="w-5 h-5 mr-2" />
              Início
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Overall Results */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-8">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{percentage}%</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {results.correct} de {results.total} questões corretas
              </h2>
              <p className="text-gray-600">
                {percentage >= 70 ? 'Excelente desempenho!' : 
                 percentage >= 50 ? 'Bom desempenho!' : 
                 'Continue estudando!'}
              </p>
            </div>
          </div>

          {/* Performance by Area */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3" />
              Desempenho por Área
            </h3>
            
            <div className="space-y-4">
              {Object.entries(results.byArea).map(([areaName, areaResult]) => {
                const areaPercentage = Math.round((areaResult.correct / areaResult.total) * 100);
                const area = areas.find(a => a.name === areaName) || { color: 'from-gray-400 to-gray-600' };
                
                return (
                  <div key={areaName} className="flex items-center">
                    <div className="w-32 font-semibold text-gray-700">{areaName}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${area.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${areaPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="font-semibold text-gray-800">{areaPercentage}%</span>
                      <div className="text-sm text-gray-600">
                        {areaResult.correct}/{areaResult.total}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCurrentScreen('home')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Novo Simulado
            </button>
            <button
              onClick={() => setCurrentScreen('history')}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-300 hover:shadow-lg transition-all duration-300"
            >
              Ver Histórico
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HistoryScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Histórico de Simulados</h1>
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Início
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {simulationHistory.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Nenhum simulado realizado</h2>
            <p className="text-gray-500 mb-6">Faça seu primeiro simulado para ver o histórico aqui</p>
            <button
              onClick={() => setCurrentScreen('home')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Começar Simulado
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {simulationHistory.map((simulation, index) => {
              const percentage = Math.round((simulation.results.correct / simulation.results.total) * 100);
              const duration = new Date(simulation.endTime) - new Date(simulation.startTime);
              const durationMinutes = Math.round(duration / 60000);
              
              return (
                <div key={simulation.id} className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6">
                        <span className="text-white font-bold text-lg">{percentage}%</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {simulation.mode === 'complete' ? 'Prova Completa' : 
                           areas.find(a => a.id === simulation.mode)?.name || simulation.mode}
                        </h3>
                        <p className="text-gray-600">
                          {simulation.results.correct}/{simulation.results.total} corretas • {durationMinutes} min
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(simulation.startTime).toLocaleDateString('pt-BR')} às {' '}
                          {new Date(simulation.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {percentage}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {percentage >= 70 ? 'Excelente' : 
                         percentage >= 50 ? 'Bom' : 
                         'Pode melhorar'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Mini performance chart */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(simulation.results.byArea).map(([areaName, areaResult]) => {
                        const areaPercentage = Math.round((areaResult.correct / areaResult.total) * 100);
                        return (
                          <div key={areaName} className="text-center">
                            <div className="text-sm font-semibold text-gray-700 mb-1">{areaName}</div>
                            <div className="text-lg font-bold text-gray-800">{areaPercentage}%</div>
                            <div className="text-xs text-gray-500">{areaResult.correct}/{areaResult.total}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Render current screen
  switch (currentScreen) {
    case 'home':
      return <HomeScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'history':
      return <HistoryScreen />;
    default:
      return <HomeScreen />;
  }
};

export default FlowLabENEMSimulator;
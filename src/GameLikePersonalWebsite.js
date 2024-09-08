import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Github, Linkedin, Mail, User, Code, Briefcase, Award, Gamepad2 } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import LoadingScreen from './LoadingScreen';
import dadJokes from './dad-jokes.txt';
import profilePicture from './linked in profile.jpeg';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const GameLikePersonalWebsite = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [dadJoke, setDadJoke] = useState({ setup: '', punchline: '' });
  const [showPunchline, setShowPunchline] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(true);
  
  // Snake game state
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
    fetchDadJoke();
  }, []);

  const fetchDadJoke = useCallback(async () => {
    try {
      const response = await fetch(dadJokes);
      const text = await response.text();
      const jokesList = text.split('\n').filter(joke => joke.trim() !== '');
      const randomJoke = jokesList[Math.floor(Math.random() * jokesList.length)];
      const [setup, punchline] = randomJoke.split('<>');
      setDadJoke({ setup, punchline });
      setShowPunchline(false);
    } catch (error) {
      console.error('Error fetching dad joke:', error);
      setDadJoke({ 
        setup: "Why don't scientists trust atoms?", 
        punchline: "Because they make up everything!" 
      });
    }
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Check for collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        newSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 1);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        });
        setExp(prevExp => {
          const newExp = prevExp + 5;
          if (newExp >= 100) {
            setLevel(prevLevel => prevLevel + 1);
            return newExp - 100;
          }
          return newExp;
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (activeSection !== 'snake-game') return;
      
      // Prevent default behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowUp': setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': setDirection({ x: 1, y: 0 }); break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'snake-game') return;

    const gameInterval = setInterval(moveSnake, 200);
    return () => clearInterval(gameInterval);
  }, [moveSnake, activeSection]);

  useEffect(() => {
    if (activeSection !== 'snake-game' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // Draw snake
    ctx.fillStyle = '#0f0';
    snake.forEach(segment => {
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }, [snake, food, activeSection]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 15, y: 15 });
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if (activeSection === 'profile' && showProfilePopup) {
      setTimeout(() => {
        setShowProfilePopup(false);
      }, 3000);
    }
  }, [activeSection, showProfilePopup]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-4 relative">
            {showProfilePopup && (
              <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-10">
                <p>Bored? Play the Snake Game to increase your level!</p>
                <button
                  onClick={() => setActiveSection('snake-game')}
                  className="mt-2 bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                >
                  Play Snake Game
                </button>
              </div>
            )}
            <h2 className="text-2xl font-bold text-yellow-300">Character Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-blue-300 font-bold mb-2">Programming</h3>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-green-300 font-bold mb-2">AI/ML</h3>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div className="bg-green-500 h-4 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-red-300 font-bold mb-2">Mathematics</h3>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div className="bg-red-500 h-4 rounded-full" style={{width: '98%'}}></div>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-purple-300 font-bold mb-2">Leadership</h3>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div className="bg-purple-500 h-4 rounded-full" style={{width: '88%'}}></div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Dad Joke of the Day</h3>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-yellow-500">
                <p className="text-white text-xl italic mb-4">{dadJoke.setup}</p>
                {showPunchline ? (
                  <p className="text-yellow-300 text-right">{dadJoke.punchline}</p>
                ) : (
                  <button
                    onClick={() => setShowPunchline(true)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Reveal Punchline
                  </button>
                )}
              </div>
            </div>
          </div>
        );
        case 'skills':
          return (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-300">Skills</h2>
              <div className="grid grid-cols-1 gap-4">
                {['Java', 'Python', 'C', 'AWS', 'Docker', 'React', 'PyTorch', 'NLP', 'DBMS'].map((skill) => (
                  <div key={skill} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <span className="text-white font-bold">{skill}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current text-yellow-500" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'quests':
          return (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-300">Completed Quests</h2>
              <div className="space-y-4">
                {[
                  { name: 'ScoutX Mission', description: 'Architected NLP pipeline for contract risk analysis' },
                  { name: 'Herriot AI Challenge', description: 'Fine-tuned LLM for veterinary domain' },
                  { name: 'Laion AI Expedition', description: 'Analyzed multimodal datasets for LAION-5B' },
                  { name: 'GirlCode Teaching', description: 'Instructed Java SE 8 to underprivileged women' },
                ].map((quest) => (
                  <div key={quest.name} className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-blue-300 font-bold mb-2">{quest.name}</h3>
                    <p className="text-gray-400">{quest.description}</p>
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        case 'achievements':
          return (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-300">Achievements</h2>
              <div className="space-y-4">
                {[
                  'Bronze in national programming olympiad',
                  'Chosen for national team selection camp',
                  'Led provincial Mathematics team to 6th place',
                  "Awarded Vice Chancellor's Scholarship",
                ].map((achievement, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg flex items-center">
                    <Award className="text-yellow-500 mr-4" size={24} />
                    <span className="text-white">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          );
      case 'snake-game':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-yellow-300">Snake Game</h2>
            <p className="text-white mb-4">Use arrow keys to control the snake. Eat red food to grow and gain EXP!</p>
            <div className="flex justify-center">
              <canvas 
                ref={canvasRef} 
                width={GRID_SIZE * CELL_SIZE} 
                height={GRID_SIZE * CELL_SIZE}
                className="border-2 border-yellow-300"
              />
            </div>
            <p className="text-white mt-4">Score: {score}</p>
            {gameOver && (
              <div>
                <p className="text-red-500 mt-2">Game Over!</p>
                <button
                  onClick={resetGame}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Restart
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
      <header className="bg-gray-800 bg-opacity-75 p-6 rounded-t-lg border-b-4 border-yellow-500">
  <div className="flex items-center">
    <div className="flex-shrink-0 mr-6 ml-8"> {/* Added ml-8 for left margin */}
      <img 
        src={profilePicture}
        alt="Fei Xiang Darren Peng" 
        className="w-24 h-24 rounded-full border-2 border-yellow-300"
      />
    </div>
    <div className="flex-grow flex flex-col items-center">
      <h1 className="text-4xl font-bold text-yellow-300 mb-2">Fei Xiang "Darren" Peng</h1>
      <p className="text-blue-300">Level {level} Computer Science & Computational Mathematics Wizard</p>
      <div className="mt-2 w-64">
        <div className="text-sm text-gray-300 text-center">Experience</div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${exp}%` }}
          ></div>
        </div>
      </div>
    </div>
    <div className="flex-shrink-0 w-24 ml-8"></div> {/* Added ml-8 to match the left side */}
  </div>
</header>
        <main className="bg-gray-800 bg-opacity-75 p-6">
          <div className="flex mb-6">
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex-1 py-2 px-4 ${activeSection === 'profile' ? 'bg-blue-600' : 'bg-gray-700'} rounded-l-lg transition-colors duration-200 hover:bg-blue-500`}
            >
              <User className="inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveSection('skills')}
              className={`flex-1 py-2 px-4 ${activeSection === 'skills' ? 'bg-blue-600' : 'bg-gray-700'} transition-colors duration-200 hover:bg-blue-500`}
            >
              <Code className="inline-block mr-2" />
              Skills
            </button>
            <button
              onClick={() => setActiveSection('quests')}
              className={`flex-1 py-2 px-4 ${activeSection === 'quests' ? 'bg-blue-600' : 'bg-gray-700'} transition-colors duration-200 hover:bg-blue-500`}
            >
              <Briefcase className="inline-block mr-2" />
              Quests
            </button>
            <button
              onClick={() => setActiveSection('achievements')}
              className={`flex-1 py-2 px-4 ${activeSection === 'achievements' ? 'bg-blue-600' : 'bg-gray-700'} transition-colors duration-200 hover:bg-blue-500`}
            >
              <Award className="inline-block mr-2" />
              Achievements
            </button>
            <button
              onClick={() => setActiveSection('snake-game')}
              className={`flex-1 py-2 px-4 ${activeSection === 'snake-game' ? 'bg-blue-600' : 'bg-gray-700'} rounded-r-lg transition-colors duration-200 hover:bg-blue-500`}
            >
              <Gamepad2 className="inline-block mr-2" />
              Snake Game
            </button>
          </div>

          <TransitionGroup>
            <CSSTransition key={activeSection} classNames="fade" timeout={300}>
              {renderContent()}
            </CSSTransition>
          </TransitionGroup>
        </main>

        <footer className="bg-gray-800 bg-opacity-75 p-6 rounded-b-lg border-t-4 border-yellow-500 mt-4">
          <div className="flex justify-center space-x-4">
            <a href="https://github.com/feixiangpeng" className="text-blue-300 hover:text-blue-100 transition-colors">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/feixiang-darren-peng" className="text-blue-300 hover:text-blue-100 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:feixiang@uchicago.edu" className="text-blue-300 hover:text-blue-100 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GameLikePersonalWebsite;
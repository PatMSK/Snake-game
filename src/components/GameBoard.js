// src/components/GameBoard.js
import React, { useState, useEffect, useCallback } from 'react';
import Snake from './Snake';
import Food from './Food';
import './GameBoard.css';

const CELL_SIZE = 20; // Each cell is 20x20 pixels
const INITIAL_SPEED = 200;
const INITIAL_FOOD_COUNT = 5;

function GameBoard() {
  const [boardSize, setBoardSize] = useState({
    width: Math.floor(window.innerWidth / CELL_SIZE),
    height: Math.floor(window.innerHeight / CELL_SIZE),
  });
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [foods, setFoods] = useState(generateRandomFoodPositions(INITIAL_FOOD_COUNT));
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  useEffect(() => {
    const updateBoardSize = () => {
      setBoardSize({
        width: Math.floor(window.innerWidth / CELL_SIZE),
        height: Math.floor(window.innerHeight / CELL_SIZE),
      });
    };
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
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
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = {
      x: (snake[0].x + direction.x + boardSize.width) % boardSize.width,
      y: (snake[0].y + direction.y + boardSize.height) % boardSize.height,
    };

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if the snake head is on any of the food items
    const foodEatenIndex = foods.findIndex(food => food.x === head.x && food.y === head.y);
    if (foodEatenIndex !== -1) {
      setScore(prevScore => prevScore + 1);
      setSpeed(prevSpeed => Math.max(50, prevSpeed - 10));

      // Replace the eaten food with a new one
      const newFoods = [...foods];
      newFoods[foodEatenIndex] = generateRandomPosition();
      setFoods(newFoods);
    } else {
      newSnake.pop(); // Remove last segment if no food is eaten
    }

    setSnake(newSnake);
  }, [snake, direction, foods, gameOver, boardSize]);

  const checkCollision = (head) => {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: 1 });
    setFoods(generateRandomFoodPositions(INITIAL_FOOD_COUNT));
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  function generateRandomPosition() {
    return {
      x: Math.floor(Math.random() * boardSize.width),
      y: Math.floor(Math.random() * boardSize.height),
    };
  }

  function generateRandomFoodPositions(count) {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push(generateRandomPosition());
    }
    return positions;
  }

  return (
    <div className="game-board" style={{ width: '100vw', height: '100vh' }}>
      {/* Scoreboard */}
      <div className="scoreboard">
        Score : {score}
      </div>
      {gameOver && <div className="game-over">Game Over!</div>}
      <Snake segments={snake} />
      {foods.map((food, index) => (
        <Food key={index} position={food} />
      ))}
      <button onClick={resetGame} className="reset-button">Restart Game</button>
    </div>
  );
}

export default GameBoard;

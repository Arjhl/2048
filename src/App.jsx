import { useCallback, useEffect, useState } from "react";
import styles from "./App.module.css";
import { cloneDeep, update } from "lodash";
import useEvent from "./useevent";
import Swipe from "react-easy-swipe";

const colors = {
  0: "transparent",
  2: "#a6cee3",
  4: "#1f78b4",
  8: "#b2df8a",
  16: "#33a02c",
  32: "#fb9a99",
  64: "#e31a1c",
  128: "#fdbf6f",
  256: "#ff7f00",
  512: "#cab2d6",
  1024: "#6a3d9a",
  2048: "#ffff99",
};

const getColors = (val) => {
  return colors[val];
};

function App() {
  const [score, setScore] = useState(0);
  const [data, setData] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const addNum = (newGrid) => {
    let added = false;
    let gridFull = false;
    let attempts = 0;

    while (!added) {
      let r1 = Math.floor(Math.random() * 4);
      let r2 = Math.floor(Math.random() * 4);

      if (gridFull) {
        break;
      }

      if (newGrid[r1][r2] == 0) {
        newGrid[r1][r2] = Math.random() > 0.5 ? 2 : 4;
        added = true;
      }

      if (attempts > 50) {
        gridFull = true;
        setGameOver(true);
      }
    }
  };

  //initialize
  const init = () => {
    const newGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    addNum(newGrid);
    addNum(newGrid);

    setData(newGrid);
  };

  //functions
  //swipe left
  const swipeLeft = (flag) => {
    let scoreLeft = 0;
    let oldGrid = data;
    const newGrid = cloneDeep(data);

    for (let i = 0; i < 4; i++) {
      let b = newGrid[i];
      let s = 0;
      let f = 1;

      while (s < 4) {
        if (f === 4) {
          f = s + 1;
          s++;
          continue;
        }

        if (b[s] === 0 && b[f] === 0) {
          f++;
        } else if (b[s] === 0 && b[f] !== 0) {
          b[s] = b[f];
          b[f] = 0;
          f++;
        } else if (b[s] !== 0 && b[f] === 0) {
          f++;
        } else if ((b[s] !== 0) & (b[f] !== 0)) {
          if (b[s] === b[f]) {
            b[s] = b[s] + b[f];
            b[f] = 0;
            if (b[s] === 2048) setWin(true);

            scoreLeft += b[s];
            f = s + 1;
            s++;
          } else {
            s++;
            f = s + 1;
          }
        }
      }
    }

    if (JSON.stringify(oldGrid) !== JSON.stringify(newGrid)) {
      addNum(newGrid);
    }

    if (flag) {
      return newGrid;
    } else {
      setScore(score + scoreLeft);
      setData(newGrid);
    }
  };

  //right
  const swipeRight = (flag) => {
    let scoreRight = 0;
    let oldGrid = data;
    const newGrid = cloneDeep(data);

    for (let i = 3; i >= 0; i--) {
      let b = newGrid[i];
      let s = 3;
      let f = 2;

      while (s > 0) {
        if (f === -1) {
          f = s - 1;
          s--;
          continue;
        }

        if (b[s] === 0 && b[f] === 0) {
          f--;
        } else if (b[s] === 0 && b[f] !== 0) {
          b[s] = b[f];
          b[f] = 0;
          f--;
        } else if (b[s] !== 0 && b[f] === 0) {
          f--;
        } else if ((b[s] !== 0) & (b[f] !== 0)) {
          if (b[s] === b[f]) {
            b[s] = b[s] + b[f];
            b[f] = 0;
            if (b[s] === 2048) setWin(true);

            scoreRight += b[s];
            f = s - 1;
            s--;
          } else {
            s--;
            f = s - 1;
          }
        }
      }
    }

    if (JSON.stringify(oldGrid) !== JSON.stringify(newGrid)) {
      addNum(newGrid);
    }

    if (flag) {
      return newGrid;
    } else {
      setScore(score + scoreRight);
      setData(newGrid);
    }
  };

  //up
  const swipeUp = (flag) => {
    let scoreUp = 0;
    let oldGrid = data;
    const newGrid = cloneDeep(data);

    for (let i = 0; i < 4; i++) {
      let s = 0;
      let f = 1;

      while (s < 4) {
        if (f === 4) {
          f = s + 1;
          s++;
          continue;
        }

        if (newGrid[s][i] === 0 && newGrid[f][i] === 0) {
          f++;
        } else if (newGrid[s][i] === 0 && newGrid[f][i] !== 0) {
          newGrid[s][i] = newGrid[f][i];
          newGrid[f][i] = 0;
          f++;
        } else if (newGrid[s][i] !== 0 && newGrid[f][i] === 0) {
          f++;
        } else if (newGrid[s][i] !== 0 && newGrid[f][i] !== 0) {
          if (newGrid[s][i] === newGrid[f][i]) {
            newGrid[s][i] = newGrid[s][i] + newGrid[f][i];
            newGrid[f][i] = 0;
            if (newGrid[s][i] === 2048) setWin(true);
            scoreUp += 0;
            f = s + 1;
            s++;
          } else {
            s++;
            f = s + 1;
          }
        }
      }
    }

    if (JSON.stringify(oldGrid) !== JSON.stringify(newGrid)) {
      addNum(newGrid);
    }

    if (flag) {
      return newGrid;
    } else {
      setScore(score + scoreUp);
      setData(newGrid);
    }
  };

  //down
  const swipeDown = (flag) => {
    let scoreDown = 0;
    let oldGrid = data;
    const newGrid = cloneDeep(data);

    for (let i = 3; i >= 0; i--) {
      let s = 3;
      let f = 2;

      while (s > 0) {
        if (f === -1) {
          f = s - 1;
          s--;
          continue;
        }

        if (newGrid[s][i] === 0 && newGrid[f][i] === 0) {
          f--;
        } else if (newGrid[s][i] === 0 && newGrid[f][i] !== 0) {
          newGrid[s][i] = newGrid[f][i];
          newGrid[f][i] = 0;
          f--;
        } else if (newGrid[s][i] !== 0 && newGrid[f][i] === 0) {
          f--;
        } else if (newGrid[s][i] !== 0 && newGrid[f][i] !== 0) {
          if (newGrid[s][i] === newGrid[f][i]) {
            newGrid[s][i] = newGrid[s][i] + newGrid[f][i];
            newGrid[f][i] = 0;
            if (newGrid[s][i] === 2048) setWin(true);
            scoreDown += newGrid[s][i];
            f = s - 1;
            s--;
          } else {
            s--;
            f = s - 1;
          }
        }
      }
    }

    if (JSON.stringify(oldGrid) !== JSON.stringify(newGrid)) {
      addNum(newGrid);
    }

    if (flag) {
      return newGrid;
    } else {
      setScore(score + scoreDown);
      setData(newGrid);
    }
  };

  //checkifgameover
  const checkGameOver = () => {
    if (JSON.stringify(swipeLeft(true)) !== JSON.stringify(data)) {
      return false;
    } else if (JSON.stringify(swipeDown(true)) !== JSON.stringify(data)) {
      return false;
    } else if (JSON.stringify(swipeRight(true)) !== JSON.stringify(data)) {
      return false;
    } else if (JSON.stringify(swipeUp(true)) !== JSON.stringify(data)) {
      return false;
    } else {
      return true;
    }
  };

  //reset
  const resetGame = () => {
    init();
    setScore(0);
    setGameOver(false);
  };

  const handler = (e) => {
    if (e.key === "ArrowLeft") {
      swipeLeft();
    } else if (e.key === "ArrowRight") {
      swipeRight();
    } else if (e.key === "ArrowDown") {
      swipeDown();
    } else if (e.key === "ArrowUp") {
      swipeUp();
    }

    if (checkGameOver()) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEvent("keydown", handler);
  //phone swipe

  return (
    <Swipe
      onSwipeUp={() => swipeUp()}
      onSwipeDown={() => swipeDown()}
      onSwipeLeft={() => swipeLeft()}
      onSwipeRight={() => swipeRight()}
    >
      <div className={styles.wrapper}>
        <div className={styles.card_box}>
          <h1>2048</h1>
          <div className={styles.score_reset}>
            <p>Score : {score}</p>
            <button onClick={resetGame}>{"RESET"}</button>
          </div>

          {data.map((row, i) => {
            return (
              <div
                className={styles.card}
                key={i}
                style={{
                  filter: `${gameOver || win ? "blur(2px)" : "blur(0)"}`,
                }}
              >
                {row.map((digit, i) => {
                  return (
                    <div
                      className={styles.box}
                      style={{
                        backgroundColor: `${getColors(digit)}`,
                      }}
                      key={i}
                    >
                      <p className={styles.trans}>{digit ? digit : ""}</p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {gameOver && (
          <div className={styles.gameover}>
            <p>GAME OVER</p>
          </div>
        )}
        {win && (
          <div className={styles.gameover}>
            <p>YOU WIN!!</p>
          </div>
        )}
        <p className={styles.foot}>Developed By Arj😑 using React.js</p>
      </div>
    </Swipe>
  );
}

export default App;

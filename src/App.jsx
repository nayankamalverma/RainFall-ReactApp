import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Slider,
  Box,
  CssBaseline,
  Paper,
} from "@mui/material";
import "./App.css";

const App = () => {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(30);
  const [speed, setSpeed] = useState(100);
  const [isRaining, setIsRaining] = useState(true);
  const maxIntensity = 5;
  const rainfallPercentage = 0.03;

  const hueRef = useRef(0);
  const [grid, setGrid] = useState(
    Array(rows)
      .fill()
      .map(() => Array(cols).fill(0))
  );

  // Reset grid on rows/cols change
  useEffect(() => {
    setGrid(
      Array(rows)
        .fill()
        .map(() => Array(cols).fill(0))
    );
  }, [rows, cols]);

  useEffect(() => {
    if (!isRaining) return;

    const interval = setInterval(() => {
      // Advance hue
      hueRef.current = (hueRef.current + 5) % 360;

      setGrid((prevGrid) => {
        const newGrid = Array(rows)
          .fill()
          .map(() => Array(cols).fill(0));

        // Fade trail
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (prevGrid[i][j] > 0) {
              newGrid[i][j] = prevGrid[i][j] - 1;
            }
          }
        }

        // Move heads down
        for (let i = rows - 2; i >= 0; i--) {
          for (let j = 0; j < cols; j++) {
            if (prevGrid[i][j] === maxIntensity) {
              newGrid[i + 1][j] = maxIntensity;
            }
          }
        }

        // New heads
        for (let j = 0; j < cols; j++) {
          if (Math.random() < rainfallPercentage) {
            newGrid[0][j] = maxIntensity;
          }
        }

        return newGrid;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [speed, isRaining, rows, cols]);

  return (
    <div className="App" >
    <Container maxWidth="md" sx={{ py: 8 }}>
      <CssBaseline />
      <Paper
        elevation={4}
        sx={{ p: 3, backgroundColor: "#121212", color: "#ccc" }}
      >
        <Typography variant="h4" gutterBottom>
          🌈 Dynamic Hue Rainfall
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setIsRaining(!isRaining)}
            color={isRaining ? "error" : "success"}
          >
            {isRaining ? "Pause Rain" : "Start Rain"}
          </Button>

          <Box sx={{ width: 200 }}>
            <Typography variant="caption">Speed (ms): {speed}</Typography>
            <Slider
              value={speed}
              onChange={(e, val) => setSpeed(val)}
              min={20}
              max={700}
              step={20}
            />
          </Box>

          <Box sx={{ width: 200 }}>
            <Typography variant="caption">Rows: {rows}</Typography>
            <Slider
              value={rows}
              onChange={(e, val) => setRows(val)}
              min={10}
              max={30}
            />
          </Box>

          <Box sx={{ width: 200 }}>
            <Typography variant="caption">Cols: {cols}</Typography>
            <Slider
              value={cols}
              onChange={(e, val) => setCols(val)}
              min={10}
              max={40}
            />
          </Box>
        </Box>

        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => {
                const hue = hueRef.current;
                const lightness = 15 + cell * 15; // base 15% + intensity scale
                const color =
                  cell > 0 ? `hsl(${hue}, 100%, ${lightness}%)` : "black";
                return (
                  <div
                    key={colIndex}
                    className="cell"
                    style={{ backgroundColor: color }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </Paper>
    </Container>
    </div>
  );
};

export default App;

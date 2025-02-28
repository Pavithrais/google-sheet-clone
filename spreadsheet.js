import React, { useState } from "react";
import "./Spreadsheet.css";

const ROWS = 10;
const COLS = 5;

const Spreadsheet = () => {
  const [cells, setCells] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );

  // Function to handle cell edits
  const handleCellChange = (row, col, value) => {
    const newCells = [...cells];
    newCells[row][col] = value;
    setCells(newCells);
  };

  // Evaluate basic formulas
  const evaluateFormula = (formula) => {
    if (!formula.startsWith("=")) return formula;
    try {
      let expr = formula.substring(1).replace(/[A-Z]\d+/g, (match) => {
        let col = match.charCodeAt(0) - 65;
        let row = parseInt(match.substring(1)) - 1;
        return cells[row] && cells[row][col] ? cells[row][col] : 0;
      });
      return new Function("return " + expr)();
    } catch {
      return "ERROR";
    }
  };

  // Remove duplicate rows
  const removeDuplicates = () => {
    const uniqueRows = [...new Set(cells.map((row) => row.join(",")))].map((row) =>
      row.split(",")
    );
    setCells(uniqueRows);
  };

  // Find and replace function
  const findAndReplace = (findText, replaceText) => {
    const newCells = cells.map((row) =>
      row.map((cell) => cell.replace(new RegExp(findText, "g"), replaceText))
    );
    setCells(newCells);
  };

  return (
    <div>
      <h2>Google Sheets Clone</h2>
      <table>
        <tbody>
          {cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={evaluateFormula(cell)}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Toolbar for functions */}
      <button onClick={() => removeDuplicates()}>REMOVE DUPLICATES</button>
      <button onClick={() => findAndReplace("old", "new")}>FIND & REPLACE</button>
    </div>
  );
};

export default Spreadsheet;

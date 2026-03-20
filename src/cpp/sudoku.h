#ifndef SUDOKU_H
#define SUDOKU_H

#include <string>
#include <vector>

#define UNASSIGNED 0

int genRandNum(int maxLimit);

bool FindUnassignedLocation(int grid[9][9], int& row, int& col);
bool UsedInRow(int grid[9][9], int row, int num);
bool UsedInCol(int grid[9][9], int col, int num);
bool UsedInBox(int grid[9][9], int boxStartRow, int boxStartCol, int num);
bool isSafe(int grid[9][9], int row, int col, int num);

class Sudoku {
   private:
    int grid[9][9];
    int solnGrid[9][9];
    int guessNum[9];
    int gridPos[81];
    int difficultyLevel;
    bool grid_status;

   public:
    Sudoku();
    Sudoku(std::string, bool row_major = true);
    void createSeed();
    void printGrid();
    bool solveGrid();
    std::string getGrid();
    void countSoln(int& number);
    void genPuzzle();
    bool verifyGridStatus();
    void printSVG(int, int);
    void calculateDifficulty();
    int branchDifficultyScore();
};

#endif

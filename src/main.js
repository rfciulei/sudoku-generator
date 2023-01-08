// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const spawn = require("child_process").spawn;
const generatePdf = require("./generatePdf");
const addon = require('bindings')('sudoku')

let cppDirPath = path.join(__dirname, "cpp");
let execPath = path.join(cppDirPath, "sudokuGen.exe");

//these should've been in an env.js file
let devEnv = false;
// TO-DO -> link dll's to exe file before release
let compile = true;


function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 400,
    height: 280,
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");
  // no menu bar
  win.setMenuBarVisibility(false);
  // Open the DevTools.
  if (devEnv == true) win.webContents.openDevTools();

  ipcMain.on("toMain", (event, data) => {
    args = new Array();
    args.push(data.numberOfPuzzles);
    args.push(data.difficulty);
    args.push(data.perPage);
    if (data.solutions) {
      args.push("1");
    } else {
      args.push("0");
    }
    // src/cpp/puzzles dir should be empty for each sudokuGen.exe execution
    //createOrEmptyPuzzlesDirSync();
    addon.generate_sudoku();
	win.webContents.send("fromMain", "finished");
    // will build pdf if code return 0
    generatePdf(4);
  });
}

//ISSUE
const createOrEmptyPuzzlesDirSync = () => {
  let directory = path.join(__dirname, "cpp", "puzzles");

  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      fs.unlinkSync(path.join(directory, file));
    }
  } else fs.mkdirSync(directory);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, also on MacOS.
app.on("window-all-closed", function () {
  app.quit();
});


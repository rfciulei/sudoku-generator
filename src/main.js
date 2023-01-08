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
    createOrEmptyPuzzlesDirSync();
    //ISSUE : does not verify if g++ is present on the system
    if (compile) {
      compileCode(win);
      executeCpp(win, args, data);
    } else {
      executeCpp(win, args, data);
    }
  });
}
// ISSUE -> does not show output
const compileCode = (win) => {
  let c =
    "g++ " +
    path.join(cppDirPath, "sudokuGen.cpp") +
    " -o " +
    path.join(cppDirPath, "sudokuGen");
  // we use execSync so that we make sure the compilation
  // is finished before execution
  child_process.execSync(c, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    if (stdout) {
      console.log(`g++ stdout:\n${stdout}`);
    }
  });
};
// TO-DO : fix error codes passing
const executeCpp = (win, args, data) => {
  const opts = {
    cwd: path.join(__dirname, "cpp"),
    env: process.env,
  };
  exec = spawn(execPath, args, opts);
  exec.stdout.on("data", function (data) {
    console.log("sudokuGen.exe stdout:\n" + data.toString());
  });
  exec.stderr.on("data", function (data) {
    console.log("stderr: " + data.toString());
  });
  exec.on("exit", function (code) {
    if (code.toString() === "0") {
      console.log("[FINISHED][SUCCESS] : sudokuGen.exe execution");
      win.webContents.send("fromMain", "finished");
      // will build pdf if code return 0
      generatePdf(data.perPage);
    } else {
      console.log("[FINISHED][FAIL] : sudokuGen.exe execution");
      win.webContents.send("fromMain", "finished");
    }
  });
};

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

console.log(addon.hello())

Doesn't compile properly at the moment because clfag c++14 is overwritten by electron-rebuild:
/Users/$USER/fun/git/sudoku-generator-electronjs/node_modules/@electron/rebuild/lib/src/module-type/node-gyp.js

Couldn't find any useful docs so:
For the moment to build the program just comment lines 79-81 so that c++17 flag is not added automatically.


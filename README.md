Doesn't compile properly at the moment because clfag c++14 is overwritten by electron-rebuild:<br>
`.../node_modules/@electron/rebuild/lib/src/module-type/node-gyp.js`

Couldn't find any useful docs so:<br>
For the moment to build the program just comment lines `79-81` in the previously mentioned file so that c++17 flag is not added automatically.


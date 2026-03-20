window.api.receive("fromMain", (data) => {
  if (data === "finished") {
    document.getElementById("btnGo").disabled = false;
    document.getElementById("loaderRoot").innerHTML = "";
  }
});

document.getElementById("btnGo").addEventListener("click", go, false);

function go() {
  let data = {
    numberOfPuzzles: document.getElementById("numberOfPuzzles").value,
    perPage: document.getElementById("perPage").value,
    difficulty: document.getElementById("difficulty").value,
    solutions: document.getElementById("solutions").checked,
  };

  window.api.send("toMain", data);

  document.getElementById("btnGo").disabled = true;

  let loaderHTML = `<div class="loader"><div class="loading_1"></div></div>`;
  document.getElementById("loaderRoot").innerHTML = loaderHTML;
}

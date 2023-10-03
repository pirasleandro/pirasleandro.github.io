let size = 5;
let maze = Array(size * 2 - 1)
  .fill(0)
  .map((_) => Array(size * 2 - 1).fill(0));
console.log(maze);

function init() {
  $("#maze").css("grid-template-columns", `repeat(${size * 2 - 1}, auto)`);
  maze.forEach((row, r) =>
    row.forEach((col, c) => {
      $("#maze").append(
        $("<div>").addClass("cell").attr("id", `cell-${r}-${c}`)
      );
    })
  );
}

function render() {
  maze.forEach((row, r) =>
    row.forEach((col, c) => {
      if (col) $(`cell-${r}-${c}`).addClass("visited");
    })
  );
}

init();
render();

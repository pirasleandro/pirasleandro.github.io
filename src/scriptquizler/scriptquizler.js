let sceneMeta = [];
let script = [];
let mainSceneRegex = /Szene \d+$/gm;
let subSceneRegex = /\d+\w$/gm;

let scene;
let current;
let actor = "";
let currentLine = 0;
let sceneOver = false;
let showCues = false;

$.ajax({
  url: "./script.txt",
  async: false,
  success: function (data){
    init(data);
    scene = script[0][0];
    current = [0, 0];
    displayTitle();
  }
});

function init(rawScript) {
  let mainScenes = rawScript.split(mainSceneRegex);
  mainScenes.shift();
  mainScenes.forEach((scene, i) => {
    let tempLines = scene.split('\n');
    tempLines.shift();
    sceneMeta[i] = {};
    sceneMeta[i].title = tempLines[0];
    sceneMeta[i].characters = tempLines[1];
    let subSceneTitles = scene.split('\n').filter(str => str.match(subSceneRegex));
    let subScenes = scene.split(subSceneRegex);
    subScenes.shift();
    script[i] = [];
    subScenes.forEach((subScene, j) => {
      let lines = subScene.split('\n').map(line => line.split(/\s{2,}/gm));
      lines.shift();
      script[i][j] = lines;
    });
  });

  script.forEach((scene, i) => {
    let $optgroup = $('<optgroup>')
      .attr('label', `${i+1} ${sceneMeta[i].title}`);
    scene.forEach((_, j) => {
      $optgroup.append($('<option>')
        .attr('label', `${i+1}${String.fromCharCode(j+65)}`)
        .attr('value', [i, j])
      );
    });
    $('#scene-select').append($optgroup);
  });
}

$('#scene-select').on('change', function(){
	let [i, j] = this.value.split(',').map(str => parseInt(str));
  current = [i, j];
	scene = script[i][j];
  currentLine = 0;
  displayTitle();
});

$('#character-select').on('change', function(){
	actor = this.value;
});

$('#show-cues').on('change', function(){
	showCues = !showCues;
});

$('html').keydown((event) => {
	if ([13, 32, 39].includes(event.which)) {
  	next();
  }
});
$('#output').click(function(){
	next();
});

function next() {
  if (sceneOver) return;
  if (!scene[currentLine]) {
    sceneOver = true;
    $('#output')
      .append(
        $('<div>')
          .addClass('sceneend')
          .append(
            $('<span>').text('Ende der Szene.'),
            $('<button>')
              .attr('id', 'btn_next_scene')
              .text('Nächste Szene')
              .click(function(){
                nextScene();
              })
          )
      );
    return;
  }
	let [speaker, line] = scene[currentLine];
  $('#output')
  	.append($('<div>')
      .append(
        $(line ? '<b>' : '<i>').text(speaker),
        line ? $('<span>').text(line) : undefined
      )
      .addClass(speaker.includes(actor) ? !line ? 'action' : 'line' : '')
      .addClass(showCues && (scene[currentLine+1] || ' ')[0].includes(actor) ? 'cue' : '')
    );
  currentLine++;
}

function nextScene() {
  sceneOver = false;
  let [i, j] = current;
  if (script[i][j+1]) {
    j++;
  } else if (script[i+1][0]) {
    i++;
    j = 0;
  }
  current = [i, j];
  scene = script[i][j];
  currentLine = 0;
  displayTitle();
}

function displayTitle() {
  let [i, j] = current;
  $('#output').empty().append($('<h2>').text(`${i+1}${String.fromCharCode(j+65)} - ${sceneMeta[i].title}`));
}
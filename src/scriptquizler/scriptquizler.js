$.ajax({
  url: "./script.txt",
  async: false,
  success: function (data){
    init(data)
  }
});

let sceneMeta = [];
let script = [];
let mainSceneRegex = /Szene \d+$/gm;
let subSceneRegex = /\d+\w$/gm;

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

let scene = script[0][0];

let actor = "";

let current = 0;

let showCues = false;

$('#scene-select').on('change', function(){
	let [i, j] = this.value.split(',');
  current = 0;
	scene = script[parseInt(i)][parseInt(j)];
  $('#output').empty();
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
$('#output').click((event) => {
	next();
});

function next() {
	let [speaker, line] = scene[current];
  $('#output')
  	.append($('<div>')
      .append(
        $(line ? '<b>' : '<i>').text(speaker),
        line ? $('<span>').text(line) : undefined
      )
      .addClass(speaker.includes(actor) ? !line ? 'action' : 'line' : '')
      .addClass(showCues && (scene[current+1] || ' ')[0].includes(actor) ? 'cue' : '')
    );
  current++;
}
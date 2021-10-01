const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Events = Matter.Events

var engine;
var world;
var flag = true
var particles = [];
var plinkos = [];
var bounds = [];
var cols = 15
var rows = 11;
var ding, ding2, ding3
var colorList = ["red", "orange", "yellow", "#5df542", "green", "#42adf5", "blue",
                 "blue", "#42adf5", "green", "#5df542", "yellow", "orange", "red"];
var scoreList = [1, 5, 10, 20, 50, 100, 200, 200, 100, 50, 20, 10, 5, 1];
var pointList = [];
var score = 0;
var maxParticles = 50;
var createdParticles = 0;
var database
var HighScoreNumber=0
var saveHighScore = 0;

function preload() {
  // add sound
  ding = loadSound("ding4.mp3");
  ding2 = loadSound("ding3.mp3"); 
  ding3 = loadSound("ding.mp3");
}

function setup() {
  //database
 database = firebase.database();
 console.log(database);
var HighScoreNumber = database.ref('highscore');
 HighScoreNumber.on("value", readPosition, showError);

  createCanvas(900, 1030);
  colorMode(HSB);
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 1.2;
//create the color squares which gives score
  for (var i = 0; i < 14; i++) {
    point = new Point(i*60 + 60, 871, 60, 281.5);
    pointList.push(point);
  }
//to play sounds if the ball collides with the plinko
  function collision(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
      var labelA = pairs[i].bodyA.label;
      var labelB = pairs[i].bodyB.label;
      if ((labelA == 'particle' && labelB == 'plinko') ||
          (labelA == 'plinko' && labelB == 'particle')) {
        // Uncomment the line to hear sounds
        ding2.play();
      }
    }
  }

  Events.on(engine, 'collisionStart', collision);
//spacing for plinkos and points
  var spacing = width/cols;
  for (var j = 0; j < rows; j++) {
    if (j % 2 == 0) {
      cols = 16;
      var x = -spacing/2;
    } else {
      cols = 14;
      var x = 0;
    }
    var y = spacing + j * spacing;
//dots around the screen
    for (var i = 0; i < cols; i++) {
      x += spacing;
      var p = new Plinko(x, y, 7);
      plinkos.push(p);
    }    
  }
// creating boundries
  var b1 = new Boundary(width/2, height + 30, width, 100);
  bounds.push(b1);
 var b2 = new Boundary(width+10, height/2, 20, height);
  bounds.push(b2);
  var b3 = new Boundary(-12, height/2, 20, height);
  bounds.push(b3);
 var b4 = new Boundary(0, 1011, 50, 562);
  bounds.push(b4);
  var b5 = new Boundary(width, 1011, 50, 562);
  bounds.push(b5);

  for (var i = 0; i < cols; i++) {
    var x = i * spacing + spacing/2;
    var h = 300;
    var w = 10;
    var y = height-h/2;
    var b = new Boundary(x, y, w, h);
    bounds.push(b);
  }
}

// Mouse click create balls
function mouseClicked() {
  if (mouseX > 35 && mouseX < 865 && createdParticles < maxParticles) {
    var p = new Particle(mouseX, 10, 12);
    createdParticles += 1;
    particles.push(p);
  }
}


function draw() {
  background("#000000");
  //writeScore();
  if(touches.length > 0) {
    if (createdParticles < maxParticles) {
      var p = new Particle(random(35,865), 10, 12);
      createdParticles += 1;
      particles.push(p);
    }
     touches = [];
  }
  //changing the color of the points
  for (var i = 0; i < 14; i++) {
    fill(colorList[i]);
    pointList[i].show();
  }

  Engine.update(engine);
//showing the balls
  for (var i = 0; i < particles.length; i++) {
    particles[i].show();
    
  }
//checking if the game fails
  if(createdParticles === maxParticles && frameCount%750===0){
    gamefail();

  }
//showing the plinkos
  for (var i = 0; i < plinkos.length; i++) {
    plinkos[i].show();
  }
//showing boudries
  for (var i = 0; i < bounds.length; i++) {
    bounds[i].show();
  } 
//adds score
  if (particles.length != 0) {
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].flag == false && particles[i].body.position.y > 750) {
        var x = particles[i].body.position.x;
        var index = floor((x - 30)/60);
        score += scoreList[index];
        HighScoreNumber = score;
        particles[i].flag = true;
        
      }
    }
  }
 //shows all text
  fill("white");
  text("Score: " + score, 800, 30);
  text("High score: " + HighScoreNumber, 400, 30);
  text("Particles Left: " + (maxParticles - createdParticles), 50, 30);
  textAlign(CENTER);
  textSize(20);
  for (var i = 0; i < pointList.length; i++) {
    text(scoreList[i], i*60+60, 800);
  }
console.log(HighScoreNumber);
}


//FUNCTIONS
//show game over
function gamefail() {
  swal(
{
  title: `Try again`,
  confirmButtonText: 'Play again'
  },
    function (isConfirm) {
    if (isConfirm) {
          location.reload();
          gamestate="play";
        }
      }
    );
}


function writeScore(){
  database.ref('highscore').set({
    'highscore' : score,

  })
}

function readPosition(data){
HighScoreNumber = data.val();
  
}

function showError(){
  console.log("Error in writing to the database");
}
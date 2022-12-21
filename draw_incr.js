/*******************- Event Listener -****************/

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

window.addEventListener("load", function() {
 if (document.getElementById("freezebtn") != null) {
  document.getElementById("freezebtn").addEventListener("click", set_freeze);
 }
});

window.addEventListener("load", function() {
 if (document.getElementById("backwardbtn") != null) {
  document.getElementById("backwardbtn").addEventListener("click", backward);
 }
});

window.addEventListener("load", function() {
 if (document.getElementById("forwardbtn") != null) {
  document.getElementById("forwardbtn").addEventListener("click", forward);
 }
});

window.addEventListener("load", function() {
 if (document.getElementById("continuebtn") != null) {
  document.getElementById("continuebtn").addEventListener("click", cont);
 }
});

window.addEventListener("load", function() {
 if (document.getElementById("speed-btn") != null) {
  document.getElementById("speed-btn").addEventListener("click", speeddown);
 }
});

window.addEventListener("load", function() {
 if (document.getElementById("speed+btn") != null) {
  document.getElementById("speed+btn").addEventListener("click", speedup);
 }
});

/**********************- Class Declaration -************************/

class Hull_Part {
  constructor(upper_part, low_part, up_length, lo_length){
    this.up_l = up_length;
    this.low_l = lo_length;

    // creates copy of vectors
    this.up = new Array();
    for (var i = 0; i < this.up_l; i++){
      this.up[i] = upper_part[i];
    }
    this.low = new Array();
    for (var i = 0; i < this.low_l; i++){
      this.low[i] = low_part[i];
    }
  }

  print_hull() {
    console.log("------------------");
    console.log("Upper Hull part: ");
    for (var i = 0; i < this.up_l; i++){
      console.log("x: " + this.up[i][0] + ", y: " + this.up[i][1]);
    }
    console.log("Lower Hull part: ");
    for (var i = 0; i < this.low_l; i++){
      console.log("x: " + this.low[i][0] + ", y: " + this.low[i][1]);
    }
    console.log("------------------");
  }
}

/********************- Variables Declaration -**************************/

var speed = 1000;
var freeze = false;
var only_once = 0;

var points = new Array();
var upper_points = new Array();
var upper_length = 2;

var low_points = new Array();
var low_length = 2;

var backward_saves = new Array();

// index of current point
var index = 2;

var c = document.getElementById("canvas");
var ctx;

var animation;

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

/**********************- Basic Functions -************************/

function set_freeze(){
  freeze = true;
  only_once = 0;
}

function cont() {
  if (ctx != null){
    freeze = false;
    only_once = 0;
    draw_here();
  }
}

function forward(){
  if (freeze){
    only_once = 1;
    draw_here();
  }
}

function backward(){
  if (freeze && index>2){
    index--;
    var last_saves = index-2;
    var class_hull = backward_saves[last_saves];

    upper_points = class_hull.up;
    low_points = class_hull.low;
    upper_length = class_hull.up_l;
    low_length = class_hull.low_l;

    just_draw();
  }
}

function speedup(){
  speed = Math.max(100, speed - 100);
}

function speeddown(){
  speed = speed + 100;
}

function sort(){
  for(var j = 1; j < points.length; j++){
    //sort x values
    for (var k = j-1; k >= 0; k--){
      if (points[k+1][0] < points[k][0]){
        var save = points[k];
        // swap
        points[k] = points[k+1];
        points[k+1] = save;
      }
      else{
        break;
      }
    }
  }
}

/********************- Hull Functions -******************/

function update_hull(){
  update_counter_clockwise();
  update_clockwise();
  index = index + 1;
}

function update_clockwise(){
  // updates the point counter clockwise
  var x0 = points[index][0];
  var y0 = points[index][1];

  for (var j = low_length-1; j > 0; j--){
    var x1 = low_points[j][0];
    var y1 = low_points[j][1];
    // previous point
    var x2 = low_points[j-1][0];
    var y2 = low_points[j-1][1];

    var m1 = -(y1-y0)/(x1-x0);
    var m2 = -(y2-y1)/(x2-x1);

    if (x1 == x0){
      m1 = -m1;
    }

    if (x1 == x2){
      m2 = -m2;
    }

    if (m1 >= m2){
      low_points[j+1] = [x0,y0];
      low_length = j+2;
      return;
    }
  }
  low_points[1] = [x0,y0];
  low_length = 2;
}

function update_counter_clockwise(){
  // updates the point counter clockwise
  var x0 = points[index][0];
  var y0 = points[index][1];

  for (var j = upper_length-1; j > 0; j--){
    var x1 = upper_points[j][0];
    var y1 = upper_points[j][1];
    // previous point
    var x2 = upper_points[j-1][0];
    var y2 = upper_points[j-1][1];
    var m1 = -(y1-y0)/(x1-x0);
    var m2 = -(y2-y1)/(x2-x1);

    if (x1 == x0){ m1 = -m1; }
    if (x1 == x2){ m2 = -m2; }

    if (m1 < m2){
      upper_points[j+1] = [x0,y0];
      upper_length = j+2;
      return;
    }
  }
  upper_points[1] = [x0,y0];
  upper_length = 2;
}

/********************- Main Function -*******************/

function start_incr(){
  ctx = c.getContext("2d");
  slider = document.getElementById("myRange");
  ctx.clearRect(0, 0, c.width, c.height);

  points = new Array(slider.value);
  upper_points = new Array(slider.value);
  low_points = new Array(slider.value);
  for(var i = 0; i < slider.value; i++){
    var x = Math.floor(Math.random()*(c.width));
    var y = Math.floor(Math.random()*(c.height));
    points[i] = [x,y];
    ctx.fillRect(x,y,4,4);
  }

  sort();

  upper_points[0] = points[0];
  upper_points[1] = points[1];
  upper_length = 2;
  low_points[0] = points[0];
  low_points[1] = points[1];
  low_length = 2;
  index = 2;

  var first_hull = new Hull_Part(upper_points, low_points, upper_length, low_length);
  backward_saves[0] = first_hull;

  freeze = false;
  animation = draw_here();
}

/****************- Draw Functions -*************/

function draw_here() {
  if (!only_once){
    if (v.selectedIndex!=0 || index == points.length || freeze){
      window.cancelAnimationFrame(animation);
      return;
    }
  }

  ctx.clearRect(0, 0, c.width, c.height);

  ctx.save();

  // draw every point
  ctx.fillStyle = "#000000";
  for (var j = 0; j < points.length; j++){
    ctx.fillRect(points[j][0], points[j][1], 4, 4);
  }
  if (index < points.length){
    var hull = new Hull_Part(upper_points, low_points, upper_length, low_length);
    backward_saves[index-2] = hull;
    update_hull();
  }
  // draw upper convex hull
  ctx.strokeStyle = "#000000";

  ctx.beginPath();
  ctx.moveTo(upper_points[0][0]+2, upper_points[0][1]+2);
  for (var j = 1; j < upper_length; j++){
    ctx.lineTo(upper_points[j][0]+2, upper_points[j][1]+2);
  }
  // draw lower convex hull
  ctx.moveTo(low_points[0][0]+2, low_points[0][1]+2);
  for (var j = 1; j < low_length; j++){
    ctx.lineTo(low_points[j][0]+2, low_points[j][1]+2);
  }

  ctx.stroke();
  ctx.restore();

  only_once = Math.max(only_once -= 1, 0);

  setTimeout(draw_here, speed);
}

function just_draw(){
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.save();
  // draw every point
  ctx.fillStyle = "#000000";
  for (var j = 0; j < points.length; j++){
    ctx.fillRect(points[j][0], points[j][1], 4, 4);
  }
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(upper_points[0][0]+2, upper_points[0][1]+2);
  for (var j = 1; j < upper_length; j++){
    ctx.lineTo(upper_points[j][0]+2, upper_points[j][1]+2);
  }
  // draw lower convex hull
  ctx.moveTo(low_points[0][0]+2, low_points[0][1]+2);
  for (var j = 1; j < low_length; j++){
    ctx.lineTo(low_points[j][0]+2, low_points[j][1]+2);
  }
  ctx.stroke();
  ctx.restore();
}

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

/**********************- Variable Inititalisation -******************/
var speed = 1000;
var freeze = false;

var points = new Array();
var points_length = 0;

var hull = new Array();
var hull_length = 0;

var c = document.getElementById("canvas");
var ctx;

var animation;

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

/************************- hull functions -**************************/

function update_jarv_hull(){
  var m0;
  var m1;
  var alpha;
  var beta;
  if (hull_length > 1){
    var x0 = hull[hull_length-1][0];
    var y0 = hull[hull_length-1][1];
    var x1 = hull[hull_length][0];
    var y1 = hull[hull_length][1];

    m0 = -(y1-y0)/(x1-x0);
    alpha = Math.atan(m0);
    if (x0 == x1){
      if (y1 < y0){
        alpha = 90
      }
      else{
        alpha = -90
      }
    }
    var next_point = [x0, y0]
    for (var i = 0; i < points_length; i++){
      var x2 = points[i][0];
      var y2 = points[i][1];

      m1 = -(y2-y1)/(x2-x1);

      beta = Math.atan(m1);
      if (x1 == x2){
        if (y2 < y1){
          alpha = 90
        }
        else{
          alpha = -90
        }
      }
    }
  }
  else {
    // only one point in hull
    m0 = 0
    var x1 = hull[0][0];
    var y1 = hull[0][1];

    for (var i = 0; i < points_length; i++){
      var x2 = points[i][0];
      var y2 = points[i][1];

      m1 = -(y2-y1)/(x2-x1);

      beta = Math.atan(m1);
      if (x1 == x2){
        if (y2 < y1){
          alpha = 90
        }
        else{
          alpha = -90
        }
      }
    }
  }
  console.log(m0);
  console.log(alpha);
  console.log(m1);
  console.log(beta);
  // now we got both m
}

/************************- main functions -**************************/

function start_jarv(){
  ctx = c.getContext("2d");
  slider = document.getElementById("myRange");
  ctx.clearRect(0, 0, c.width, c.height);

  points_length = slider.value;
  points = new Array(points_length);
  hull = new Array(points_length);
  var mini = [c.width, 0];
  for(var i = 0; i < points_length; i++){
    var x = Math.floor(Math.random()*(c.width));
    var y = Math.floor(Math.random()*(c.height));
    points[i] = [x,y];
    ctx.fillRect(x,y,4,4);
    if (x < mini[0]){
      mini = [x,y];
    }
  }

  hull[0] = mini;
  hull_length = 1;
  update_jarv_hull();

  animation = draw_jarv_here();
}

function draw_jarv_here() {
  if (hull[hull_length-1] == hull[0] || freeze){
    console.log("Abbruch!");
    window.cancelAnimationFrame(animation);
    return;
  }

  ctx.clearRect(0, 0, c.width, c.height);

  ctx.save();
  // draw every point
  ctx.fillStyle = "#000000";
  for (var j = 0; j < points.length; j++){
    ctx.fillRect(points[j][0], points[j][1], 4, 4);
  }

  update_jarv_hull();

  // draw convex hull
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(hull[0][0]+2, hull[0][1]+2);
  for (var j = 1; j < hull_length; j++){
    ctx.lineTo(hull[j][0]+2, hull[j][1]+2);
  }

  ctx.stroke();
  ctx.restore();

  setTimeout(draw_jarv_here, speed);
}

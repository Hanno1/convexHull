window.addEventListener("load", function() {
 if (document.getElementById("startbtn") != null) {
  document.getElementById("startbtn").addEventListener("click", main);
 }
});

var v = document.getElementById("select_alg");

function main(){
  if (v.selectedIndex == 0){
    start_incr();
  }
  else if (v.selectedIndex == 1){
    start_jarv();
  }
}

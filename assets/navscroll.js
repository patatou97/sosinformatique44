/* Navbar scroll shadow */
var nb=document.getElementById('navbar');
window.addEventListener('scroll',function(){
  nb.classList.toggle('scrolled',window.scrollY>20);
});

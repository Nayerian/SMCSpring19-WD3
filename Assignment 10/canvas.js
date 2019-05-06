var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');
c.fillRect(100, 100, 100, 100); 
c.fillRect(400, 100, 100, 100); 
c.fillRect(300, 300, 100, 100); 
console.log(canvas);
//line
c.beginPath();
c.moveTo(50,300);
c.lineTo(300,100);
c.lineTo(400,300);
c.stroke();
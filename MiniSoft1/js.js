var c = document.getElementById("myCanvas"); // canvas
var ctx = c.getContext("2d");
var maxWidth = c.width;
var lineHeight = 25; // velkost riadnu pre Text
var xText = 5;
var yText = 20;
var widthInput = 50; //sirka inputu
var heightInput = 15; // vyska inputu
var text = ""; // zadanie
ctx.font = '12pt Calibri';
ctx.fillStyle = '#333';
var levels = [["circle","1,2"], ["circle","3,4"], ["circle","4,6"], ["house","2"], ["house","3"], ["flag","2"], ["flag","3"], ["house","4,5"], ["flag","4,5"]];
var progress = 0;
var shapes = [];
var shape = "";
var id = 0; // id shape
var color = "#FFFFFF";
var colShapes = 0; //vyfarbene utvary
var live = false;
var addButt = "";
var result = -1; // vsledok ziaka
var numberColor = 0; // pocet farieb
var isfirstTime = false; // ci na prvykrat trafil vysledok
var numFirstTime = 0; // pocet na prvykrat
var colors = []; // farby v palete;

class Circle {
  constructor(x, y, id, r, color) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.r = r;
		this.color = color;
  }

  createCircle() {
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
  }
}

class Rectangle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
		this.color = color;
  }

  createRectangle() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	 }
}

class Triangle {
  constructor(x1, y1, x2, y2, x3, y3, color) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
		this.color = color;
  }

  createTriangle() {
	ctx.beginPath();
	ctx.moveTo(this.x1, this.y1);
	ctx.lineTo(this.x2, this.y2);
	ctx.lineTo(this.x3, this.y3);
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.closePath();
	ctx.stroke();
	ctx.closePath();
  }
}

function createButton(context, x,y, value, func, ID) { // OK button
		if($("#check") && live){
			$("#check").remove();
		}
    var button = document.createElement("input");
    button.type = "button";
    button.value = value;
    button.id = ID;
    button.style.position = 'fixed';
    button.style.left = (x + 10) + 'px';
    button.style.top = (y + 10) + 'px';
    button.onclick = func;
    document.body.appendChild(button);
}

function addInput(x, y) {

		if($("#number")){
			$("#number").remove()
		}
    var input = document.createElement('input');

    input.type = 'text';
    input.id = 'number';
    input.style.position = 'fixed';
    input.style.left = (x + 10) + 'px';
    input.style.top = (y + 10) + 'px';
    input.style.width = widthInput + 'px';
    input.style.height = heightInput + 'px';
	input.onkeypress = function(){return isNumberKey(event)};
    document.body.appendChild(input);
	document.getElementById("number").value = colShapes; //zmen pocet vyfarbenych v inpute

    hasInput = true;

}
function isNumberKey(evt){ // only numbers in input
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function createPallete(){

	var interval = levels[progress][1].split(",")
	numberColor = parseInt(interval[Math.floor(Math.random() * interval.length)]);
	let height = 0;
	var yColors = c.height / 2 - 100;

	for(var i = 0; i < numberColor; i++){
		var div = document.createElement('input');
		let col = getRandomColor() + "";
		colors.push(col);
		div.id = 'color' + i;
		div.type = "text";
		if(i == 0){
			color = col;
			div.style.borderColor = "black";
			div.style.borderWidth = "medium";
		}
		div.style.color = col;
		div.value = col;
		div.style.position = 'fixed';
		div.style.left = (c.width - 100) + 'px';
		div.style.top =  (yColors + height) + 'px';
		div.style.width = widthInput + 'px';
		div.style.height = heightInput + 'px';
		div.style.backgroundColor = col;
		div.onclick = function() { pickColor(col, this.id, numberColor) };
		document.body.appendChild(div);
		height += 25;
	}

	var guma = document.createElement('input');

	guma.id = 'color' + i;
	guma.type = 'image';
	guma.src = 'images/rubber.png';
	guma.value = "#FFFFFF"
	guma.style.position = 'fixed';
	guma.style.left = (c.width - 90) + 'px';
	guma.style.top =  (yColors + height) + 'px';
	guma.style.width = 35 + 'px';
	guma.style.height = 35 + 'px';
	guma.style.backgroundColor = "white";
	guma.onclick = function() { pickColor(guma.value, this.id, numberColor) };
	document.body.appendChild(guma);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function pickColor(col, id, number) {
	color = col;
	if(document.getElementById(id).style.borderColor != "black"){
		document.getElementById(id).style.borderColor = "black";
		document.getElementById(id).style.borderWidth = "medium";
	}
	changeBorder(id);
}

function changeBorder(id){
	$('*[id*=color]:visible').each(function() {
	    if($(this)[0].id != id){
				$(this)[0].style.borderColor = "white"
			}
	});
}

function removeAllColors(){
	$('*[id*=color]:visible').each(function() {
			this.remove();
	});
}

function addButton(){
	switch(shape) {
	    case 'circle':
	    	addButtCircle();
	        break;
	    case 'house':
	    	addButtHouse();
	        break;
	    case 'flag':
	    	addButtFlag();
	        break;
	    default:
	        break;
	}
}

function addButtCircle(){
	let last = shapes[shapes.length - 1];
	let first = shapes[0];

	var xPos = last.x  + (last.r*2) + 10; // nova xpozicia noveho utvaru
	var yPos = last.y + (last.r*2) + 10; // nova ypozicia noveho utvaru

	if(xPos + (last.r*2) + 10 < c.width - 100){ // ak je nova x-ova pozicia mensia ako sirka canvasu
		let circle = new Circle(xPos, last.y, id, last.r, "#e0e0d1");
			circle.createCircle();
			crossButt(circle.x, circle.y);
			addButt = circle;
		}else{
			let circle = new Circle(first.x, yPos, id, last.r, "#e0e0d1");
				circle.createCircle();
				crossButt(circle.x, circle.y);
				addButt = circle;
		}
}

function addButtFlag(){
	let last = shapes[shapes.length - 1];
	let first = shapes[0];
	let rectX = last[0].x + 20 + last[0].width
	let rectY = last[0].y + last[0].height

	if(rectX + 20 + last[1].width < c.width - 100){
			var rect = new Rectangle(rectX, last[0].y, last[0].width,last[0].height * 3, "#e0e0d1");
			rect.createRectangle();
			crossButt(rectX + last[0].width / 2 , rectY + last[0].height / 3);
			addButt = rect;
		}else if(last[2].y + last[0].height + 40 + last[0].height*3 < c.height){
			var rect = new Rectangle(first[0].x, rectY + first[2].height * 2 + 20, last[0].width,last[0].height * 3, "#e0e0d1");
			rect.createRectangle();
			crossButt(first[0].x + last[0].width / 2 , rectY + last[0].height * 3 + 30);
			addButt = rect;
		}
}

function addButtHouse(){
	let last = shapes[shapes.length - 1];
	let first = shapes[0];
	let rectX = last[1].x + 20 + last[1].width
	let rectY = last[1].y + last[1].height
	if(rectX + 20 + last[1].width < c.width - 100){
		var trian = new Triangle(last[0].x1 + last[1].width + 20, last[0].y1, last[0].x2 + last[1].width +20, last[0].y2, last[0].x3 + last[1].width + 20, last[0].y3,"#e0e0d1");
		trian.createTriangle();

		var rect = new Rectangle(last[1].x + 20 + last[1].width, last[1].y, last[1].width,last[1].height, "#e0e0d1");
		rect.createRectangle();
		crossButt(rectX + last[1].width / 2 , rectY - last[1].height/2);
		addButt = [rect, trian];
	}
	else{
		if(rectY + 20 + last[1].height + last[1].height < c.height){
			var trian = new Triangle(first[0].x1, last[0].y1 + last[1].height*2, first[0].x2, last[0].y2 + last[1].height*2, first[0].x3, last[0].y3 + last[1].height*2,"#e0e0d1");
			trian.createTriangle();

			var rect = new Rectangle(first[1].x, rectY + first[1].height, first[1].width,first[1].height, "#e0e0d1");
			rect.createRectangle();
			crossButt(first[1].x + last[1].width / 2 , rectY + last[1].height + 35);
			addButt = [rect, trian];
		}
	}
}

function crossButt(x, y) {
    ctx.beginPath();

    ctx.moveTo(x - 20, y - 20);
    ctx.lineTo(x + 20, y + 20);
    ctx.stroke();

    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x - 20, y + 20);
    ctx.stroke();

		ctx.closePath();
}

function addNext(){
	switch(shape) {
	    case 'circle':
	    	addNextCircle();
	        break;
	    case 'house':
	    	addNextHouse();
	        break;
	    case 'flag':
	    	addNextFlag();
	        break;
	    default:
	        break;
	}
}

function addNextCircle(){
	let last = shapes[shapes.length - 1];
	let first = shapes[0];
	var xPos = last.x  + (last.r*2) + 10; // nova xpozicia noveho utvaru
	var yPos = last.y + (last.r*2) + 10; // nova ypozicia noveho utvaru

	if(xPos + (last.r*2) + 10 < c.width - 100){ // ak je nova x-ova pozicia mensia ako sirka canvasu
		let circle = new Circle(xPos, last.y, id, last.r, "#FFFFFF");
		id++;
	    shapes.push(circle)
		circle.createCircle();
		addButton();
	}
	else{
		if(yPos + (last.r*2) < c.height){
			let circle = new Circle(first.x, yPos, id, last.r, "#FFFFFF");
		 	 shapes.push(circle)
			circle.createCircle();
			addButton();
		}
	}
}

function addNextHouse(){
	let last = shapes[shapes.length - 1];
	let first = shapes[0];
	let rectX = last[1].x + 20 + last[1].width
	let rectY = last[1].y + last[1].height

	if(rectX + 20 + last[1].width < c.width - 100){
		var trian = new Triangle(last[0].x1 + last[1].width + 20, last[0].y1, last[0].x2 + last[1].width +20, last[0].y2, last[0].x3 + last[1].width + 20, last[0].y3,"#FFFFFF");
		trian.createTriangle();

		var rect = new Rectangle(last[1].x + 20 + last[1].width, last[1].y, last[1].width,last[1].height, "#FFFFFF");
		rect.createRectangle();
		shapes[shapes.length] = [trian, rect];
		addButton();
	}
	else{
		if(rectY + 20 + last[1].height + last[1].height < c.height){
			var trian = new Triangle(first[0].x1, last[0].y1 + last[1].height*2, first[0].x2, last[0].y2 + last[1].height*2, first[0].x3, last[0].y3 + last[1].height*2,"#FFFFFF");
			trian.createTriangle();

			var rect = new Rectangle(first[1].x, rectY + first[1].height, first[1].width,first[1].height, "#FFFFFF");
			rect.createRectangle();
			shapes[shapes.length] = [trian, rect];
			addButton();
		}
	}
}

function addNextFlag(){
	let last = shapes[shapes.length - 1];
	let first = shapes[0];
	let rectX = last[0].x + 20 + last[0].width
	let rectY = last[0].y + last[0].height

	if(rectX + 20 + last[1].width < c.width - 100){
		var rect1 = new Rectangle(last[0].x + last[0].width + 20, last[0].y, last[0].width,last[0].height, "#FFFFFF");
		rect1.createRectangle();
		var rect2 = new Rectangle(last[1].x + last[1].width + 20, last[1].y, last[1].width,last[1].height, "#FFFFFF");
		rect2.createRectangle();
		var rect3 = new Rectangle(last[2].x + last[2].width + 20, last[2].y, last[2].width,last[2].height, "#FFFFFF");
		rect3.createRectangle();
		shapes[shapes.length] = [rect1, rect2, rect3];
		addButton();
	}else{
		if(last[2].y + last[0].height + 40 + last[0].height*3 < c.height){
			var rect1 = new Rectangle(first[0].x, rectY + first[2].height * 2 + 20, first[0].width, first[0].height, "#FFFFFF");
			rect1.createRectangle();
			var rect2 = new Rectangle(rect1.x, rect1.y + rect1.height, rect1.width, rect1.height, "#FFFFFF");
			rect2.createRectangle();
			var rect3 = new Rectangle(rect2.x, rect2.y + rect2.height, rect2.width, rect2.height, "#FFFFFF");
			rect3.createRectangle();
			shapes[shapes.length] = [rect1, rect2, rect3];
			addButton();
		}
	}
}

document.body.addEventListener('mousedown', function (e){ // remove function
	var mouseX = e.clientX;
	var mouseY = e.clientY;

	if(e.button === 2){
		if(shapes.length > 1){
			switch(shape) {
			    case 'circle':
			    	removeCircle(mouseX, mouseY);
			        break;
			    case 'house':
			    	removeHouse(mouseX, mouseY);
			        break;
			    case 'flag':
			    	removeFlag(mouseX, mouseY);
			        break;
			    default:
			        break;
			}
			displayNumber();
		}
  }
	else if(e.button == 0){
		switch(shape) {
				case 'circle':
					var odX = addButt.x - addButt.r;
					var doX = addButt.x + addButt.r;
					var odY = addButt.y - addButt.r;
					var doY = addButt.y + addButt.r;
						break;
				case 'house':
						var odX = addButt[0].x;
						var doX = addButt[0].x + addButt[0].width;
						var odY = addButt[0].y;
						var doY = addButt[0].y + addButt[0].height;
						var planeAB = (addButt[1].x1-mouseX)*(addButt[1].y2-mouseY)-(addButt[1].x2-mouseX)*(addButt[1].y1-mouseY);
						var planeBC = (addButt[1].x2-mouseX)*(addButt[1].y3-mouseY)-(addButt[1].x3 - mouseX)*(addButt[1].y2-mouseY);
						var planeCA = (addButt[1].x3-mouseX)*(addButt[1].y1-mouseY)-(addButt[1].x1 - mouseX)*(addButt[1].y3-mouseY);
						var inside = (Math.sign(planeAB)==Math.sign(planeBC) && Math.sign(planeBC)==Math.sign(planeCA)) ; // ci som klikol do troj.
						break;
				case 'flag':
					var odX = addButt.x;
					var doX = addButt.x + addButt.width;
					var odY = addButt.y;
					var doY = addButt.y + (addButt.height*3);
						break;
				default:
						break;
		}
		if(mouseX >= odX && mouseX <= doX && mouseX >= odX && mouseY <= doY && mouseY >= odY && mouseY <= doY || inside){
			addNext();
		}else{ // vyfarbovanie
			switch(shape) {
					case 'circle':
						colorCircle(mouseX, mouseY);
							break;
					case 'house':
						colorHouse(mouseX, mouseY);
							break;
					case 'flag':
						colorFlag(mouseX, mouseY);
							break;
					default:
							break;
			}
		}
	}
}, false);

function colorCircle(mouseX, mouseY){
	for(var i = 0; i < shapes.length; i++){
		var odX = shapes[i].x - shapes[i].r;
		var doX = shapes[i].x + shapes[i].r;
		var odY = shapes[i].y - shapes[i].r;
		var doY = shapes[i].y + shapes[i].r;
		if(mouseX >= odX && mouseX <= doX && mouseX >= odX && mouseY <= doY && mouseY >= odY && mouseY <= doY){
			shapes[i].color = color;
			break;
		}
	}
	ctx.font = '12pt Calibri';
	ctx.fillStyle = '#333';
	colShapes = 0;
	for(var i = 0; i < shapes.length; i++){
		shapes[i].createCircle();
		if(shapes[i].color != "#FFFFFF"){
			colShapes++;
		}
	}
	document.getElementById("number").value = colShapes; //zmen pocet vyfarbenych v inpute
}

function colorFlag(mouseX, mouseY) {
	for(var i = 0; i < shapes.length; i++){
		for(var j = 0; j < shapes[i].length; j++){
			var odX = shapes[i][j].x;
			var doX = shapes[i][j].x + shapes[i][j].width;
			var odY = shapes[i][j].y;
			var doY = shapes[i][j].y + shapes[i][0].height;
			if(mouseX >= odX && mouseX <= doX && mouseX >= odX && mouseY <= doY && mouseY >= odY && mouseY <= doY){
				shapes[i][j].color = color;
				break;
			}
		}
	}
	ctx.font = '12pt Calibri';
	ctx.fillStyle = '#333';
	colShapes = 0;
	var pocZafarbenych = 0;
	for(var i = 0; i < shapes.length; i++){
		for(var j = 0; j < shapes[i].length; j++){
			shapes[i][j].createRectangle();
			if(shapes[i][j].color != "#FFFFFF"){
				pocZafarbenych++;
			}
		}
		if(pocZafarbenych == 3){
			colShapes++;
		}
		pocZafarbenych = 0;
	}
	document.getElementById("number").value = colShapes; //zmen pocet vyfarbenych v inpute
}

function colorHouse(mouseX, mouseY){
	for(var i = 0; i < shapes.length; i++){
		var odX = shapes[i][1].x;
		var doX = shapes[i][1].x + shapes[i][1].width;
		var odY = shapes[i][1].y;
		var doY = shapes[i][1].y + shapes[i][1].height;
		var planeAB = (shapes[i][0].x1-mouseX)*(shapes[i][0].y2-mouseY)-(shapes[i][0].x2-mouseX)*(shapes[i][0].y1-mouseY);
		var planeBC = (shapes[i][0].x2-mouseX)*(shapes[i][0].y3-mouseY)-(shapes[i][0].x3 - mouseX)*(shapes[i][0].y2-mouseY);
		var planeCA = (shapes[i][0].x3-mouseX)*(shapes[i][0].y1-mouseY)-(shapes[i][0].x1 - mouseX)*(shapes[i][0].y3-mouseY);
		var inside = (Math.sign(planeAB)==Math.sign(planeBC) && Math.sign(planeBC)==Math.sign(planeCA)) ; // ci som klikol do troj.

		if(mouseX >= odX && mouseX <= doX && mouseX >= odX && mouseY <= doY && mouseY >= odY && mouseY <= doY){
			shapes[i][1].color = color;
			break;
		}
		if(inside){
			shapes[i][0].color = color;
			break;
		}
	}

	ctx.font = '12pt Calibri';
	ctx.fillStyle = '#333';
	colShapes = 0;
	var pocZafarbenych = 0;
	for(var i = 0; i < shapes.length; i++){
		if(shapes[i][0].color != "#FFFFFF" && shapes[i][1].color != "#FFFFFF"){
			colShapes++;
		}
		shapes[i][1].createRectangle();
		shapes[i][0].createTriangle();
	}
	document.getElementById("number").value = colShapes; //zmen pocet vyfarbenych v inpute
}

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

function removeCircle(mouseX, mouseY){
	for(var i = 0; i < shapes.length; i++){
		var odX = shapes[i].x - shapes[i].r;
		var doX = shapes[i].x + shapes[i].r;
		var odY = shapes[i].y - shapes[i].r;
		var doY = shapes[i].y + shapes[i].r;
		if(mouseX >= odX && mouseX <= doX && mouseX >= odX && mouseY <= doY && mouseY >= odY && mouseY <= doY){
			s = shapes[i];
			replaceCircle(i,s);
			shapes.splice(i,1);
			break;
		}
	}

	ctx.clearRect(0, 0, c.width, c.height);
	addText(ctx, text, xText, yText, maxWidth, lineHeight);
	colShapes = 0;
	for(var i = 0; i < shapes.length; i++){
		shapes[i].createCircle();
		if(shapes[i].color != "#FFFFFF"){
			colShapes++;
		}
	}
	document.getElementById("number").value = colShapes; //zmen pocet vyfarbenych v inpute
	addButton();
}

function replaceCircle(ind, s) {
	for(var i = ind; i < shapes.length; i++){
		if(i+1 < shapes.length){
			var novy = new Circle(shapes[i+1].x, shapes[i+1].y , shapes[i+1].id, shapes[i+1].r);
			shapes[i+1].x = s.x;
			shapes[i+1].y = s.y;
			s = novy;
		}
	}
}

function removeFlag(mouseX, mouseY){
	for(var i = 0; i < shapes.length; i++){
		var odX = shapes[i][0].x;
		var doX = shapes[i][0].x + shapes[i][0].width;
		var odY = shapes[i][0].y;
		var doY = shapes[i][0].y + (shapes[i][0].height*3);
		if(mouseX >= odX && mouseX <= doX && mouseX >= odX && mouseY <= doY && mouseY >= odY && mouseY <= doY){
			replaceFlag(i,shapes[i]);
			shapes.splice(i,1);
			break;
		}
	}

	ctx.clearRect(0, 0, c.width, c.height);
	addText(ctx, text, xText, yText, maxWidth, lineHeight);
	ctx.beginPath();
	colShapes = 0;
	var pocZafarbenych = 0;
	for(var i = 0; i < shapes.length; i++){
		for(var j = 0; j < shapes[i].length; j++){
			shapes[i][j].createRectangle();
			if(shapes[i][j].color != "#FFFFFF"){
				pocZafarbenych++;
			}
		}
		if(pocZafarbenych == 3){
			colShapes++;
		}
		pocZafarbenych = 0;
	}
	document.getElementById("number").value = colShapes; //zmen pocet vyfarbenych v inpute
	addButton();
}

function replaceFlag(ind, s) {
	for(var i = ind; i < shapes.length; i++){
		if(i+1 < shapes.length){
			var rect1 = new Rectangle(shapes[i+1][0].x, shapes[i+1][0].y, shapes[i+1][0].width, shapes[i+1][0].height, shapes[i+1][0].color);
			var rect2 = new Rectangle(shapes[i+1][1].x, shapes[i+1][1].y, shapes[i+1][1].width, shapes[i+1][1].height, shapes[i+1][1].color);
			var rect3 = new Rectangle(shapes[i+1][2].x, shapes[i+1][2].y, shapes[i+1][2].width, shapes[i+1][2].height, shapes[i+1][2].color);
			shapes[i+1][0] = s[0];
			shapes[i+1][1] = s[1];
			shapes[i+1][2] = s[2];
			shapes[i+1][0].color = rect1.color;
			shapes[i+1][1].color = rect2.color;
			shapes[i+1][2].color = rect3.color;
			s = [rect1, rect2, rect3];
		}
	}
}

function removeHouse(mouseX, mouseY){
	for(var i = 0; i < shapes.length; i++){
		var odX = shapes[i][1].x;
		var doX = shapes[i][1].x + shapes[i][1].width;
		var odY = shapes[i][1].y;
		var doY = shapes[i][1].y + shapes[i][1].height;
		var planeAB = (shapes[i][0].x1-mouseX)*(shapes[i][0].y2-mouseY)-(shapes[i][0].x2-mouseX)*(shapes[i][0].y1-mouseY);
		var planeBC = (shapes[i][0].x2-mouseX)*(shapes[i][0].y3-mouseY)-(shapes[i][0].x3 - mouseX)*(shapes[i][0].y2-mouseY);
		var planeCA = (shapes[i][0].x3-mouseX)*(shapes[i][0].y1-mouseY)-(shapes[i][0].x1 - mouseX)*(shapes[i][0].y3-mouseY);
		var inside = (Math.sign(planeAB)==Math.sign(planeBC) && Math.sign(planeBC)==Math.sign(planeCA)) ; // ci som klikol do troj.

		if(mouseX >= odX && mouseX <= doX && mouseX >= odX && mouseY <= doY && mouseY >= odY && mouseY <= doY || inside){
			replaceHouse(i,shapes[i]);
			shapes.splice(i,1);
			break;
		}
	}
	ctx.font = '12pt Calibri';
	ctx.fillStyle = '#333';
	ctx.clearRect(0, 0, c.width, c.height);
	addText(ctx, text, xText, yText, maxWidth, lineHeight);
	ctx.beginPath();
	for(var i = 0; i < shapes.length; i++){
		shapes[i][1].createRectangle();
		shapes[i][0].createTriangle();
	}

	addButtHouse();
}

function replaceHouse(ind, s) {
	for(var i = ind; i < shapes.length; i++){
		if(i+1 < shapes.length){
			var trian = new Triangle(shapes[i+1][0].x1, shapes[i+1][0].y1, shapes[i+1][0].x2, shapes[i+1][0].y2, shapes[i+1][0].x3, shapes[i+1][0].y3,shapes[i+1][0].color);
			var rect = new Rectangle(shapes[i+1][1].x, shapes[i+1][1].y, shapes[i+1][1].width, shapes[i+1][1].height, shapes[i+1][1].color);
			shapes[i+1][1] = s[1];
			shapes[i+1][0] = s[0];
			shapes[i+1][1].color = rect.color;
			shapes[i+1][0].color = trian.color;
			s = [trian, rect];
		}
	}
}


function addText(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';
	var rowNumber = 1;
	ctx.font = '12pt Calibri';
	ctx.fillStyle = '#333';
	for(var n = 0; n < words.length; n++) {
	  var testLine = line + words[n] + ' ';
	  var metrics = context.measureText(testLine);
	  var testWidth = metrics.width;
	  if (testWidth > maxWidth && n > 0 || words[n] == "\n") {
	    context.fillText(line, x, y);
	    line = words[n] + ' ';
	    y += lineHeight;
	    rowNumber++;
	  }
	  else {
	    line = testLine.trim() + ' ';
	  }
	}

	context.fillText(line, x, y);
	addInput(5, rowNumber*lineHeight); // prida input
	createButton(ctx,widthInput + 15, rowNumber*lineHeight,"OK?", check, "check");
}

function generateText(shape){
	switch(shape) {
	    case 'circle':
	   		 text = "Koľko najviac rôznych lôpt vieš vytvoriť tak, aby ani jedna nebola vyfarbená rovnako ako ostatné? \n Použi všetky farby na palete vpravo.";
	        break;
	    case 'house':
	   		 text = "Koľko najviac rôznych domčekov vieš vytvoriť tak, aby ani jeden nebol vyfarbený rovnako ako ostatné? \n Použi všetky farby na palete vpravo.";
	        break;
	    case 'flag':
	   		 text = "Koľko najviac rôznych vlajok vieš vytvoriť tak, aby ani jedna nebola vyfarbená rovnako ako ostatné? \n Použi všetky farby na palete vpravo.";
	        break;
	    default:
	        break;
	}
}

function check(){
	if(checkResult()){		
		displayNumber();
		progress++;
		if(progress < levels.length){
			if(isfirstTime == true){
				numFirstTime++;
			}
			colShapes = 0;
			removeAllColors();
			ctx.font = '12pt Calibri';
			ctx.fillStyle = '#333';
			shapes = [];
			$("#add").remove(); // remove button
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.beginPath();
			live = false;
			result = -1;
			detectChangeInput();
			colors = [];
			isfirstTime = false;
			start();
		}
	}else{
		isfirstTime = -1;
	}
}

function detectChangeInput() {
	$(function() {
	    $('#number').keyup(function() { 
	        let vys = parseInt($(this).val());
	        if(!isNaN(vys)){   
	            result = vys;
	        } 
	    });
	});
}

function isWhiteCircle(farby) { // ak je farba biela 
	for(var i = 0; i < shapes.length; i++){
		if(shapes[i].color == "#FFFFFF"){
			return false;
		}
		farby.push(shapes[i].color);
	}
	return true;
}

function isWhiteHouse(farby) { // ak je farba biela 
	for(var i = 0; i < shapes.length; i++){
		if(shapes[i][0].color == "#FFFFFF" || shapes[i][1].color == "#FFFFFF"){
			return false;
		}
		farby.push([shapes[i][0].color, shapes[i][1].color]);
	}
	return true;
}

function isWhiteFlag(farby) { // ak je farba biela 
	for(var i = 0; i < shapes.length; i++){
		farby[i] = [];
		for(var j = 0; j < shapes[i].length; j++){
			if(shapes[i][j].color == "#FFFFFF"){
				return false;
			}
			farby[i].push(shapes[i][j].color);
		}
	}
	return true;
}

function allCombinations2Arrays() { // vsetky kombinacie farieb pre domy
	var combos = [];

	for(var i = 0; i < colors.length; i++)
	{
	     for(var j = 0; j < colors.length; j++)
	     {
	        combos.push([colors[i],colors[j]]);
	     }
	}
	return combos;
}

function allCombinations3Arrays() { // vsetky kombinacie farieb pre vlajky
	var combos = [];
	for(var i = 0; i < colors.length; i++)
	{
	     for(var j = 0; j < colors.length; j++)
	     {
	     	for(var k = 0; k < colors.length; k++)
		     {
		        combos.push([colors[i],colors[j], colors[k]]);
		     }	        
	     }
	}
	return combos;
}

function doSortBy2Cols(ascending) { // sort by 2 columns
    ascending = typeof ascending == 'undefined' || ascending == true;
    return function(a, b) {
       var ret = a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]);
       return ascending ? ret : -ret;
    };
}

function doSortBy3Cols(ascending) { // sort by 2 columns
    ascending = typeof ascending == 'undefined' || ascending == true;
    return function(a, b) {
       var ret = a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]) || a[2].localeCompare(b[2]);
       return ascending ? ret : -ret;
    };
}


function checkResult() {
	var vysledok = 0;
	var isAllColor = false;
	var farby = [];

	if(!isfirstTime){
		isfirstTime = true;	
	}
	switch(shape) {
	    case 'circle':
	   		vysledok = numberColor;
	   		if(result == -1){
	   			isAllColor = isWhiteCircle(farby);
			}
	        break;
	    case 'house':
	    	vysledok = Math.pow(numberColor,2) ;
	    	if(result == -1){
	   			isAllColor = isWhiteHouse(farby);
			}
	        break;
	    case 'flag':
			vysledok = Math.pow(numberColor,3) ;
			if(result == -1){
	   			isAllColor = isWhiteFlag(farby);
			}
	        break;
	    default:
	        break;
	}
	if(result == -1){
		if(shape == "circle"){
			if(isAllColor){
				farby.sort();
				colors.sort();
				var is_same = (farby.length == colors.length) && farby.every(function(element, index) {
				    return element === colors[index]; 
				});
				return is_same;
			}
		}else if(shape == "house"){
			if(isAllColor){
				let combos = allCombinations2Arrays();
				combos.sort(doSortBy2Cols());
				farby.sort(doSortBy2Cols());
				if(combos.length == farby.length){
					for(var i = 0; i < farby.length; i++){
						var is_same = (farby[i].length == combos[i].length) && farby[i].every(function(element, index) {
					   		 return element === combos[i][index]; 
						});
					if(!is_same){
						return false;
					}
				}
					return true;
				}else{
					return false;
				}
			}
		}
		else{
			if(isAllColor){
				let combos = allCombinations3Arrays();
				combos.sort(doSortBy3Cols());
				farby.sort(doSortBy3Cols());
				if(combos.length == farby.length){
					for(var i = 0; i < farby.length; i++){
						var is_same = (farby[i].length == combos[i].length) && farby[i].every(function(element, index) {
					   		 return element === combos[i][index]; 
						});
					if(!is_same){
						return false;
					}
				}
					return true;
				}else{
					return false;
				}
			}
		}
		return false;
	}else{
		if(vysledok == result){
			return true;
		}
		return false;
	}
}

function displayNumber() { // zobrazi pocet spravnych odpovedi
  ctx.font = "30px Georgia";
  ctx.fillStyle = '#333';
  ctx.fillText(numFirstTime, c.width-90, c.height-50);//Be smarter here to control where text displays
}

function start(){
	createPallete();
	generateText(levels[progress][0]);
	addText(ctx, text, xText, yText, maxWidth, lineHeight);
	let textHeight = $("#number").position().top;
	displayNumber();
	switch(levels[progress][0]) {
	    case 'circle':
	    	shape = levels[progress][0];
	        var circle = new Circle(45, textHeight+75 , id, 40, "#FFFFFF");
	        shapes.push(circle)
			circle.createCircle();
			addButton();
	        break;
	    case 'house':
  			shape = levels[progress][0];
	  		var trian = new Triangle(60, textHeight+25, 12, 123, 110, 123,"#FFFFFF");
	  		trian.createTriangle();

	  		var rect = new Rectangle(15, textHeight+65, 90,70, "#FFFFFF");
	  		rect.createRectangle();
	  		shapes[shapes.length] = [trian, rect];
			addButtHouse();
	        break;
	    case 'flag':
	    	shape = levels[progress][0];
			var rect1 = new Rectangle(5, textHeight+35, 90,20, "#FFFFFF");
	  		rect1.createRectangle();
	  		var rect2 = new Rectangle(5, textHeight+55, 90,20, "#FFFFFF");
	  		rect2.createRectangle();
	  		var rect3 = new Rectangle(5, textHeight+75, 90,20, "#FFFFFF");
	  		rect3.createRectangle();
	  		shapes[shapes.length] = [rect1, rect2, rect3];
			addButtFlag();
	        break;
	    default:
	        break;
	}
	detectChangeInput();
	result = -1;
	live = true;
}

start();
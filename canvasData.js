listToDraw = [];

// standard pointer
listToDraw.push(new Pointer(0, 0, 140, 0, "red", 1));
listToDraw.push(new Text(0, 10, "Hello World", 20, "blue", "Arial"));
draw();

function Pointer(x, y, length, angle, color, lineWidth) {
  this.x = x;
  this.y = y;
  this.length = length;
  this.angle = angle;
  this.color = color;
  this.lineWidth = lineWidth;
  // generate unique id
  this.id = Math.round(Math.random() * 100000);
  // check if the the id is already used
  // if it is, generate a new one
  while (listToDraw.find((item) => item.id == this.id)) {
    this.id = Math.round(Math.random() * 100000);
  }
}

function Text(x, y, text, size, color, font) {
  this.x = x;
  this.y = y;
  this.text = text;
  this.size = size;
  this.color = color;
  this.font = font;
  // generate unique id
  this.id = Math.round(Math.random() * 100000);
  // check if the the id is already used
  // if it is, generate a new one
  while (listToDraw.find((item) => item.id == this.id)) {
    this.id = Math.round(Math.random() * 100000);
  }
}
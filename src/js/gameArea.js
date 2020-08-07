class GameArea {
  constructor(elementId, width, height, frameRate) {
    this.canvas = document.getElementById(elementId);
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d');
    this.interval = setInterval(this.update.bind(this), frameRate);
    this.components = [];
    this.self;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update() {
    this.clear();
    this.components.forEach((comp) => comp.update());
  }
}

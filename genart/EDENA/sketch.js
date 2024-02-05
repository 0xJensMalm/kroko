let colors = ["#292f36", "#4ecdc4", "#f7fff7", "#ff6b6b", "#ffe66d"];

// Canvas and Graphics Settings
let canvasSize;
let gfxBufferWidth = 2000;
let gfxBufferHeight = 2000;
let pixelDensityValue = 2;

// Art Generation Settings
let shapeCount = 40;
let numRange = { min: 120, max: 150 };
let lengthRange = { min: 100, max: 500 };

// Shape Transformation Settings
let noiseScaleRange = { min: 0.001, max: 0.005 };
let transExtent = 4;
let resetChance = 0.0002;
let resetOffsetRange = { min: -100, max: 100 };

let gfx; // Graphics buffer for high-res rendering

function setup() {
  canvasSize = min(windowWidth, windowHeight);
  createCanvas(canvasSize, canvasSize);
  gfx = createGraphics(gfxBufferWidth, gfxBufferHeight);
  gfx.pixelDensity(pixelDensityValue);
  noLoop();
  setupControls();
  generateArt();
}

function generateArt() {
  gfx.background(random(colors)); // Clear the buffer with a new background color

  for (let i = 0; i < shapeCount; i++) {
    let x = gfx.width / 2;
    let y = gfx.height / 2;
    let n = int(random(numRange.min, numRange.max));
    let l = int(random(lengthRange.min, lengthRange.max));
    hrr(gfx, x, y, n, l); // Draw new shapes on the gfx buffer
  }

  redraw(); // Force the draw loop to execute once
}

function hrr(g, x, y, num, l) {
  let nScl = random(noiseScaleRange.min, noiseScaleRange.max); // Vary the noise scale
  g.noStroke();

  for (let j = 0; j < num; j++) {
    let col = color(random(colors));
    col.setAlpha(random(100, 255));
    g.fill(col);

    g.beginShape();
    let x0 = x;
    let y0 = y;

    for (let i = 0; i < l; i++) {
      g.vertex(x0, y0);

      let a = noise(x0 * nScl, y0 * nScl) * TWO_PI * 2;
      x0 += cos(a) * transExtent;
      y0 += sin(a) * transExtent;

      if (random(1) < resetChance) {
        x0 = x + random(resetOffsetRange.min, resetOffsetRange.max);
        y0 = y + random(resetOffsetRange.min, resetOffsetRange.max);
      }
    }

    g.endShape(CLOSE);
  }
}

function draw() {
  background(255); // Clear the canvas
  image(gfx, 0, 0, width, height); // Draw the gfx buffer scaled to fit the canvas
}

function setupControls() {
  let generateBtn = createButton("Generate");
  generateBtn.position(10, 10);
  generateBtn.mousePressed(() => {
    generateArt(); // Call generateArt when the button is pressed
  });

  let saveBtn = createButton("Save");
  saveBtn.position(10, 40);
  saveBtn.mousePressed(() => {
    save(gfx, "myCanvas.png"); // Save the gfx buffer content
  });
}

function windowResized() {
  canvasSize = min(windowWidth, windowHeight);
  resizeCanvas(canvasSize, canvasSize);
}

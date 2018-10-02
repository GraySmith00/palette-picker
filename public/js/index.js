let currentPalette = [
  { hexValue: '#a469de', locked: false },
  { hexValue: '#714e4f', locked: false },
  { hexValue: '#62c9e0', locked: false },
  { hexValue: '#551613', locked: false },
  { hexValue: '#2ecce5', locked: false }
];

$('.generate-palette').on('click', () => {
  const newPalette = generateNewPalette(currentPalette);
  displayPalette(newPalette);
});

displayPalette = palette => {
  palette.map((color, i) => {
    $(`.color-${i}`).style.backgroundColor = color.hexValue;
  });
};

displayPalette(currentPalette);

class Color {
  constructor() {
    this.hexValue = `#${Math.random()
      .toString(16)
      .slice(2, 8)}`;
    this.locked = false;
  }
}

const generateNewPalette = currentPalette => {
  const newPalette = currentPalette.map(color => {
    if (color.locked) {
      return color;
    } else {
      return new Color();
    }
  });
  return newPalette;
};

const createProject = async name => {
  const newProject = {
    name
  };
  const response = fetch('http://localhost:3000/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(newProject),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response;
};

const addPaletteToProject = (projectId, palette) => {};

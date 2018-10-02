// window.onload = function() {
//   if (window.jQuery) {
//     // jQuery is loaded
//     alert('Yeah!');
//   } else {
//     // jQuery is not loaded
//     alert("Doesn't Work");
//   }
// };

class Color {
  constructor() {
    this.hexValue = `#${Math.random()
      .toString(16)
      .slice(2, 8)}`;
    this.locked = false;
  }
}

const colors = [
  { hexValue: '#a469de', locked: false },
  { hexValue: '#714e4f', locked: false },
  { hexValue: '#62c9e0', locked: false },
  { hexValue: '#551613', locked: false },
  { hexValue: '#2ecce5', locked: false }
];

const generateNewPalette = colors => {
  const newPalette = colors.map(color => {
    if (color.locked) {
      return color;
    } else {
      return new Color();
    }
  });
  return newPalette;
};

const createProject = name => {
  fetch('http://localhost:3000/api/v1/projects', {
    method: 'POST',
    body: name,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

console.log(generateNewPalette(colors));

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
    $(`.color-${i}`).innerHTML = `
      <i class="fas fa-lock${color.locked ? '' : '-open'}" data-index=${i}></i>
      <p>${color.hexValue}</p>
    `;
  });
};
displayPalette(currentPalette);

$$('.main-palette-color').on('click', e => {
  toggleLock(e);
});

toggleLock = e => {
  if (e.target.classList.contains('fa-lock-open')) {
    e.target.classList.remove('fa-lock-open');
    e.target.classList.add('fa-lock');
    const index = e.target.dataset.index;
    currentPalette[index].locked = true;
  } else if (e.target.classList.contains('fa-lock')) {
    e.target.classList.remove('fa-lock');
    e.target.classList.add('fa-lock-open');
    const index = e.target.dataset.index;
    currentPalette[index].locked = false;
  }
};

class Color {
  constructor() {
    this.hexValue = `#${Math.random()
      .toString(16)
      .slice(2, 8)}`;
    this.locked = false;
  }
}

const generateNewPalette = palette => {
  const newPalette = palette.map(color => {
    if (color.locked) {
      return color;
    } else {
      return new Color();
    }
  });
  currentPalette = newPalette;
  return newPalette;
};

$('.add-project-form').on('submit', async function(e) {
  e.preventDefault();
  const name = $('.project-name-input').value;
  const project = await createProject(name);
  displayProject(project);
  this.reset();
});

const createProject = async name => {
  const newProject = {
    name
  };
  const response = await fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(newProject),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const id = await response.json();
  const project = { ...id, name };
  return project;
};

const displayProject = project => {
  const projectDiv = document.createElement('div');
  projectDiv.setAttribute('class', 'project-item');
  projectDiv.setAttribute('data-index', project.id);
  projectDiv.innerHTML = `
    <i class="fas fa-plus"></i>
    <p>${project.name}</p>
  `;
  $('.file-tree').prepend(projectDiv);
};

const getAllProjects = async () => {
  const url = '/api/v1/projects';
  const response = await fetch(url);
  return await response.json();
};

const populateProjects = async () => {
  const projects = await getAllProjects();
  projects.map(project => {
    displayProject(project);
    populateProjectSelect(project);
  });
};
populateProjects();

const populateProjectSelect = project => {
  const option = document.createElement('option');
  option.setAttribute('value', project.name.toLowerCase());
  option.innerHTML = project.name;
  $('.select-project').appendChild(option);
};

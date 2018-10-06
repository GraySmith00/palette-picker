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
  const newProject = { name };
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

const displayProject = (project, projectPalettes) => {
  const projectDiv = document.createElement('div');
  projectDiv.setAttribute('class', 'project-item');
  projectDiv.setAttribute('data-project_id', project.id);
  projectDiv.innerHTML = `
    <div class="project-title">
      <i class="fas fa-plus"></i>
      <p>${project.name}</p>
    </div>
    <div class="palettes">
      ${projectPalettes}
    </div>
  `;
  $('.file-tree').prepend(projectDiv);
};

const getAllProjects = async () => {
  const url = '/api/v1/projects';
  const response = await fetch(url);
  return await response.json();
};

const getAllProjectPalettes = async project_id => {
  const url = `/api/v1/projects/${project_id}/palettes`;
  const response = await fetch(url);
  const palettes = await response.json();
  return palettes.length > 0 ? palettes : [];
};

const displayProjectPalettes = palettes => {
  return palettes
    .map(
      palette =>
        `<div class="palette" data-palette_id=${
          palette.id
        }>${renderProjectPalette(palette)}</div>`
    )
    .join('');
};

const renderProjectPalette = palette => {
  return `
    <p class="palette-name">${palette.name}</p>
    <i class="far fa-trash-alt"></i>
    <div class="colors">
      <div style="background-color:${palette.color0}"></div>
      <div style="background-color:${palette.color1}"></div>
      <div style="background-color:${palette.color2}"></div>
      <div style="background-color:${palette.color3}"></div>
      <div style="background-color:${palette.color4}"></div>
    </div>
`;
};

const populateProjects = async () => {
  const projects = await getAllProjects();
  projects.map(async project => {
    const palettes = await getAllProjectPalettes(project.id);
    const projectPalettes = await displayProjectPalettes(palettes);
    displayProject(project, projectPalettes);
    populateProjectSelect(project);
  });
};
populateProjects();

const populateProjectSelect = project => {
  const option = document.createElement('option');
  option.setAttribute('value', project.id);
  option.innerHTML = project.name;
  $('.select-project').appendChild(option);
};

$('.add-palette-form').on('submit', async function(e) {
  e.preventDefault();
  const projectId = $('.select-project').value;
  const paletteName = $('.palette-name-input').value;
  const colors = currentPalette.reduce((colors, color, i) => {
    colors[`color${i}`] = color.hexValue;
    return colors;
  }, {});
  const newPalette = await saveNewPalette(projectId, paletteName, colors);
  displayNewPalette(newPalette, projectId);
});

const saveNewPalette = async (projectId, name, colors) => {
  const url = `/api/v1/projects/${projectId}/palettes/${name}`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(colors),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const id = await response.json();
  const newPalette = { ...id, projectId, name, ...colors };
  return newPalette;
};

const displayNewPalette = (newPalette, projectId) => {
  const html = renderProjectPalette(newPalette);
  const newPaletteDiv = document.createElement('div');
  newPaletteDiv.innerHTML = html;
  $(`[data-project_id="${projectId}"]`).appendChild(newPaletteDiv);
};

$('.file-tree').on('click', function(e) {
  if (e.target.classList.contains('fa-trash-alt')) {
    deletePalette(e);
  }
  displayAsMainPalette();
});

const deletePalette = async e => {
  e.target.parentNode.remove();
  const palette_id = e.target.parentNode.dataset.palette_id;
  const url = `/api/v1/projects/palettes/${palette_id}
  `;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const displayAsMainPalette = () => {};

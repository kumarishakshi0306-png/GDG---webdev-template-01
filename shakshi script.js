// Selectors
const newTaskInput = document.getElementById('new-task');
const prioritySelect = document.getElementById('task-priority');
const addTaskButton = document.getElementById('add-task-btn');
const taskListDiv = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const searchInput = document.getElementById('search-task');
const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');

// State
let tasks = [];  // array of objects: { id, text, completed, priority }

// On page load, load saved tasks
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
  const dark = localStorage.getItem('darkMode');
  if (dark === 'enabled') {
    document.body.classList.add('dark-mode');
  }
  renderTasks();
});

// Helpers

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(text, priority) {
  if (text.trim() === '') return;
  const task = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    priority: priority
  };
  tasks.push(task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTaskCompleted(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      return { ...t, completed: !t.completed };
    }
    return t;
  });
  saveTasks();
  renderTasks();
}

function editTask(id, newText) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      return { ...t, text: newText.trim() };
    }
    return t;
  });
  saveTasks();
  renderTasks();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  // filter: 'all' | 'active' | 'completed'
  let filtered = tasks;
  if (filter === 'active') {
    filtered = tasks.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filtered = tasks.filter(t => t.completed);
  }
  return filtered;
}

function searchTasks(text) {
  const lower = text.toLowerCase();
  return tasks.filter(t => t.text.toLowerCase().includes(lower));
}

function renderTasks() {
  // Determine which filter is active
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  const searchText = searchInput.value;

  let toShow = filterTasks(activeFilter);
  if (searchText) {
    toShow = toShow.filter(t => t.text.toLowerCase().includes(searchText.toLowerCase()));
  }

  taskListDiv.innerHTML = '';  // clear

  toShow.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task-item');
    if (task.completed) {
      taskEl.classList.add('completed');
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompleted(task.id));

    // Text + edit
    const textSpan = document.createElement('span');
    textSpan.classList.add('task-text');
    textSpan.textContent = task.text;
    textSpan.addEventListener('dblclick', () => {
      const newText = prompt('Edit task:', task.text);
      if (newText !== null) {
        editTask(task.id, newText);
      }
    });

    // Priority label
    const prioritySpan = document.createElement('span');
    prioritySpan.classList.add('task-priority', task.priority);
    prioritySpan.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    // Build element
    taskEl.appendChild(checkbox);
    taskEl.appendChild(textSpan);
    taskEl.appendChild(prioritySpan);
    taskEl.appendChild(delBtn);

    taskListDiv.appendChild(taskEl);
  });
}

// Event Listeners

addTaskButton.addEventListener('click', () => {
  addTask(newTaskInput.value, prioritySelect.value);
  newTaskInput.value = '';
});

newTaskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask(newTaskInput.value, prioritySelect.value);
    newTaskInput.value = '';
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTasks();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  clearCompleted();
});

searchInput.addEventListener('input', () => {
  renderTasks();
});

toggleDarkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Load tasks from localStorage on startup
document.addEventListener("DOMContentLoaded", loadTasks);

// Allow drop event
function allowDrop(event) {
  event.preventDefault();
}

// Handle drag start
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

// Handle drop
function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const task = document.getElementById(data);
  const dropTarget = event.target.closest(".task-list");

  if (dropTarget && task) {
    dropTarget.appendChild(task);
    saveTasks();
  }
}

// Add new task
function addTask(columnId) {
  const taskText = prompt("Enter task name:");
  if (!taskText || taskText.trim() === "") return;

  const task = createTask(taskText);
  document.querySelector(`#${columnId} .task-list`).appendChild(task);
  saveTasks();
}

// Create a task element
function createTask(text) {
  const task = document.createElement("div");
  task.className = "task";
  task.textContent = text;
  task.id = "task-" + Date.now();
  task.draggable = true;
  task.ondragstart = drag;

  // Add delete button
  const delBtn = document.createElement("button");
  delBtn.className = "delete-btn";
  delBtn.innerHTML = "&times;";
  delBtn.onclick = () => {
    task.remove();
    saveTasks();
  };

  task.appendChild(delBtn);
  return task;
}

// Save board state to localStorage
function saveTasks() {
  const data = {};
  document.querySelectorAll(".column").forEach(column => {
    const columnId = column.id;
    const tasks = Array.from(column.querySelectorAll(".task")).map(t => t.firstChild.textContent.trim());
    data[columnId] = tasks;
  });
  localStorage.setItem("kanbanBoard", JSON.stringify(data));
}

// Load tasks from localStorage
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("kanbanBoard")) || {};
  for (const [columnId, tasks] of Object.entries(data)) {
    const list = document.querySelector(`#${columnId} .task-list`);
    tasks.forEach(taskText => {
      list.appendChild(createTask(taskText));
    });
  }
}

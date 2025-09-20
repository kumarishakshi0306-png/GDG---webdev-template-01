let tasks = [];

function addTask() {
  const taskInput = document.getElementById("taskInput"); 
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const task = {
    text: taskText,
    done: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
}

function renderTasks() {
  const taskList = document.getElementById("tasks");
  taskList.innerHTML = "";

  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = t.text;

    if (t.done) {
      li.classList.add("complete"); 
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = t.done ? "Undo" : "Done";
    toggleBtn.onclick = () => toggleTask(i);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(i);

    li.appendChild(toggleBtn);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", tasks);
}

function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data); 
  }
  renderTasks();
}

window.onload = loadTasks;

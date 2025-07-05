const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Load tasks on page load
window.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(({ text, done, dueDate, priority }) => {
    createTaskElement(text, done, dueDate, priority);
  });
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    const text = li.querySelector('strong').textContent;
    const done = li.querySelector('span').classList.contains('task-done');
    const extraInfo = li.querySelector('small').textContent;
    const [, duePart, priorityPart] = extraInfo.match(/Due: (.*?) \| Priority: (.*)/);
    tasks.push({ text, done, dueDate: duePart, priority: priorityPart });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(taskText, isDone = false, dueDate = '', priority = 'Low') {
  const li = document.createElement('li');

  const taskSpan = document.createElement('span');
  taskSpan.innerHTML = `<strong>${taskText}</strong>`;
  if (isDone) taskSpan.classList.add('task-done');

  taskSpan.addEventListener('click', function () {
    taskSpan.classList.toggle('task-done');
    saveTasks();
  });

  const extraInfo = document.createElement('small');
  extraInfo.textContent = `Due: ${dueDate || 'None'} | Priority: ${priority}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.style.background = 'transparent';
  deleteBtn.style.border = 'none';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.fontSize = '16px';

  deleteBtn.addEventListener('click', function () {
    taskList.removeChild(li);
    saveTasks();
  });

  const textWrapper = document.createElement('div');
  textWrapper.style.flex = '1';
  textWrapper.appendChild(taskSpan);
  textWrapper.appendChild(extraInfo);

  li.appendChild(textWrapper);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

addTaskBtn.addEventListener('click', function () {
  const taskText = taskInput.value.trim();
  const dueDate = document.getElementById('dueDate').value;
  const priority = document.getElementById('priority').value;

  if (taskText !== '') {
    createTaskElement(taskText, false, dueDate, priority);
    taskInput.value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('priority').value = 'Low';
    saveTasks();
  } else {
    alert('Please enter a task!');
  }
});

const clearAllBtn = document.getElementById('clearAllBtn');
clearAllBtn.addEventListener('click', function () {
  if (confirm("Are you sure you want to clear all tasks?")) {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
  }
});

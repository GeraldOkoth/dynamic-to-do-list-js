document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addButton = document.getElementById("add-task-btn");
  const taskList = document.querySelector(".task-list");
  const storageKey = "tasks";
  let taskArray = [];

  // checks whether the task list is empty and add image based on empty state
  function updateEmptyState() {
    const emptyState = document.createElement("div");
    const para = document.createElement("p");
    emptyState.className = "all-caught-up";

    emptyState.textContent = '<i class="fa-regular fa-circle-check"></i>';
    para.textContent = "All Caught Up!";
    emptyState.appendChild(para);
    taskList.appendChild(emptyState);
    emptyState.style.display = taskArray.length > 0 ? "block" : "none";
  }

  function createTask(text) {
    return {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
      text,
      completed: false,
    };
  }

  function saveTasks() {
    localStorage.setItem(storageKey, JSON.stringify(taskArray));
  }

  function renderTask(task) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";
    listItem.dataset.taskId = task.id;

    const taskItemLeft = document.createElement("span");
    taskItemLeft.className = "task-item-left";
    const toggleCheck = document.createElement("span");
    toggleCheck.className = "toggleCheck";
    toggleCheck.setAttribute("role", "button");
    toggleCheck.setAttribute("aria-label", "Toggle task completion");
    toggleCheck.classList.toggle("checked", task.completed);

    const taskText = document.createElement("span");
    taskText.className = "taskItemText";
    taskText.textContent = task.text;
    taskText.classList.toggle("strikethrough", task.completed);

    const taskItemRight = document.createElement("span");
    taskItemRight.className = "task-item-right";
    const updateButton = document.createElement("span");
    updateButton.className = "updateBtn";
    updateButton.setAttribute("role", "button");
    updateButton.setAttribute("aria-label", "Edit task");
    updateButton.innerHTML = '<i class="fa-solid fa-pen"></i>';

    const deleteButton = document.createElement("span");
    deleteButton.className = "deleteBtn";
    deleteButton.setAttribute("role", "button");
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    taskItemLeft.append(toggleCheck, taskText);
    taskItemRight.append(updateButton, deleteButton);
    listItem.append(taskItemLeft, taskItemRight);
    taskList.appendChild(listItem);
  }

  function renderTasks() {
    taskList.replaceChildren();
    taskArray.forEach(renderTask);
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      alert("Please enter a task!");
      return;
    }

    const formattedText = text.charAt(0).toUpperCase() + text.slice(1);
    taskArray.push(createTask(formattedText));
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
    updateEmptyState();
  }

  function loadTasks() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(storedTasks)) return;

      taskArray = storedTasks
        .map((task) =>
          typeof task === "string"
            ? createTask(task)
            : {
                id: task.id || createTask(task.text).id,
                text: task.text,
                completed: Boolean(task.completed),
              },
        )
        .filter((task) => typeof task.text === "string" && task.text.trim());
    } catch {
      taskArray = [];
    }
  }

  taskList.addEventListener("click", (event) => {
    const taskItem = event.target.closest(".task-item");
    if (!taskItem) return;

    const taskIndex = taskArray.findIndex(
      (task) => task.id === taskItem.dataset.taskId,
    );
    if (taskIndex === -1) return;

    if (event.target.closest(".toggleCheck, .taskItemText")) {
      taskArray[taskIndex].completed = !taskArray[taskIndex].completed;
    } else if (event.target.closest(".deleteBtn")) {
      taskArray.splice(taskIndex, 1);
    } else if (event.target.closest(".updateBtn")) {
      const updatedText = prompt("Update task:", taskArray[taskIndex].text);
      if (updatedText === null) return;

      const trimmedText = updatedText.trim();
      if (!trimmedText) return;
      taskArray[taskIndex].text =
        trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
    } else {
      return;
    }

    saveTasks();
    renderTasks();
  });

  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });

  loadTasks();
  renderTasks();
});

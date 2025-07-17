document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("add-task-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  let taskArray = [];

//   load tasks from storage
  function loadTasks() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      taskArray = JSON.parse(storedTasks);
      taskArray.forEach((taskText) => {
        addTask(taskText, false);
      });
    }  
  }

  function addTask(taskText = "", save = true) {
    if (!taskText) {
      taskText = taskInput.value.trim();
      if (taskText === "") {
        alert("Please enter a task!");
        return;
      }
    }

    const listItem = document.createElement("li");
    listItem.textContent = taskText;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      taskList.removeChild(listItem);
      taskArray = taskArray.filter((task) => task !== taskText);
      localStorage.setItem("tasks", JSON.stringify(taskArray));
    });

    listItem.appendChild(removeBtn);
    taskList.appendChild(listItem);

    if (save) {
      taskArray.push(taskText);
      localStorage.setItem("tasks", JSON.stringify(taskArray));
    }

    taskInput.value = "";
  }

  addButton.addEventListener("click", () => addTask());
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });

  loadTasks();
});

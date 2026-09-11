document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("add-task-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.querySelector(".task-list");

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
      taskText = taskText.charAt(0).toUpperCase() + taskText.slice(1); // Capitalize the first letter
      if (taskText === "") {
        alert("Please enter a task!");
        return;
      }
    }

    const listItem = document.createElement("li");
    const span = document.createElement('span');
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');

    listItem.classList.add("task-item");
    span.classList.add('flex-1');
    span1.classList.add('checked');
    span2.classList.add('task-text');
    span2.textContent = taskText;
    span.appendChild(span1);
    span.appendChild(span2);
    listItem.appendChild(span);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      taskList.removeChild(listItem);
      const taskIndex = taskArray.indexOf(taskText);
      if (taskIndex !== -1) {
        taskArray.splice(taskIndex, 1);
      }
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

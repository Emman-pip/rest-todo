const domain = "http://localhost:8000/";

const taskElement = (taskName, description, lastUpdate, taskId) => {
  const container = document.createElement("div");
  container.classList.add("border");
  container.classList.add("rounded-lg");
  container.classList.add("flex");
  container.classList.add("justify-between");
  container.classList.add("items-center");
  container.classList.add("pl-2");

  const nameElement = document.createElement("h3");
  nameElement.classList.add("w-full");
  nameElement.classList.add("font-bold");
  nameElement.textContent = taskName;
  container.appendChild(nameElement);

  const info = document.createElement("div");
  info.classList.add("w-full");

  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = description;
  info.appendChild(descriptionElement);

  const lastUpdateElement = document.createElement("i");
  lastUpdateElement.classList.add("text-sm");
  const lastUpdateText = new Date(lastUpdate["$date"]);

  lastUpdateElement.textContent =
    lastUpdateText.getDate() +
    " " +
    (lastUpdateText.getMonth() + 1) +
    " " +
    lastUpdateText.getFullYear();
  info.appendChild(lastUpdateElement);
  container.appendChild(info);

  const buttons = document.createElement("div");
  buttons.classList.add("flex");
  buttons.classList.add("flex-col");

  const updateBtn = document.createElement("a");
  updateBtn.classList.add("bg-blue-300");
  updateBtn.classList.add("flex");
  updateBtn.classList.add("justify-center");
  updateBtn.classList.add("p-1");
  updateBtn.classList.add("hover:bg-blue-400");
  updateBtn.classList.add("transition-all");
  updateBtn.classList.add("duration-300");
  updateBtn.classList.add("cursor-pointer");
  updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    updateWindow(taskName, description, taskId);
  });
  updateBtn.textContent = "Update";
  updateBtn.id = "update-btn";

  buttons.appendChild(updateBtn);

  const delBtn = document.createElement("a");
  delBtn.classList.add("bg-green-300");
  delBtn.classList.add("flex");
  delBtn.classList.add("justify-center");
  delBtn.classList.add("p-1");
  delBtn.classList.add("hover:bg-green-400");
  delBtn.classList.add("transition-all");
  delBtn.classList.add("duration-300");
  delBtn.classList.add("cursor-pointer");

  delBtn.textContent = "Done";
  delBtn.addEventListener("click", (e) => {
    e.preventDefault();
    deleteTask(taskId);
  });
  buttons.appendChild(delBtn);

  container.appendChild(buttons);

  return container;
};

const loadTasks = () => {
  const container = document.getElementById("contents");
  container.innerHTML = "";
  const data = fetch(domain + "tasks", {
    mode: "cors",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        console.log(res);
      } else {
        return res.json();
      }
    })
    .then((res) => {
      res.map((item) => {
        const task = taskElement(
          item["task-name"],
          item["description"],
          item["last-updated"],
          item["_id"]["$oid"],
        );
        container.appendChild(task);
      });
    });
};

const addTask = () => {
  const btn = document.getElementById("add-item");
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const taskName = document.getElementById("task-name");
    const description = document.getElementById("description");
    const url = domain + "new-task";
    const data = new URLSearchParams();
    data.append("taskName", taskName.value);
    data.append("description", description.value);

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
    loadTasks();
    taskName.value = "";
    description.value = "";
  });
};

const deleteTask = (taskId) => {
  fetch(`${domain}task-delete/${taskId}`, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => loadTasks())
    .catch((e) => console.log(e));

  n;
};

const updateTask = (taskId, taskNameStr, description) => {
  const data = new FormData();
  data.append("task-name", taskNameStr);
  data.append("description", description);
  fetch(`${domain}task-update/${taskId}`, {
    method: "PUT",
    mode: "cors",
    body: data,
  })
    .then((res) => {
      if (!res.ok) {
        console.log(res);
      } else {
        loadTasks();
      }
    })
    .catch((e) => console.log(e));
};

const updateWindow = (taskName, description, taskId) => {
  toggleVisibility("#update-records");
  const updatedName = document.getElementById("updated-task-name");
  const updatedDesc = document.getElementById("updated-desc");
  updatedName.value = taskName;
  updatedDesc.value = description;

  document.getElementById("update-task").addEventListener("click", (e) => {
    e.preventDefault();
    toggleVisibility("#update-records");
    //console.log(updatedName.value);
    updateTask(taskId, updatedName.value, updatedDesc.value);
  });
};

const toggleVisibility = (elementId) => {
  document.querySelector(elementId).classList.toggle("hidden");
};

const toggleVisibilityElements = (elementId, ...args) => {
  args.forEach((element) => {
    const DOMElement = document.querySelector(element);
    DOMElement.addEventListener("click", (e) => {
      e.preventDefault();
      toggleVisibility(elementId);
    });
  });
};

(() => {
  loadTasks();
  addTask();
  toggleVisibilityElements("#new-records", "#add-new-btn", "#cancel-add-item");
})();

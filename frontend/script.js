const domain = "http://localhost:8000/"

const taskElement = (taskName, description, lastUpdate, taskId) => {
    const container = document.createElement("div");
    const nameElement = document.createElement("h3");
    nameElement.textContent = taskName;
    container.appendChild(nameElement);

    const info = document.createElement("div");

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = description;
    info.appendChild(descriptionElement);

    const lastUpdateElement = document.createElement("i");
    const lastUpdateText = new Date(lastUpdate["$date"]);
    
    lastUpdateElement.textContent = lastUpdateText.getDate() + " " + lastUpdateText.getMonth() + " " + lastUpdateText.getFullYear(); 
    info.appendChild(lastUpdateElement);
    container.appendChild(info);

    const buttons = document.createElement("div");

    const updateBtn = document.createElement("a");
    updateBtn.href = "#";
    updateBtn.textContent = "Update";

    buttons.appendChild(updateBtn);

    const delBtn = document.createElement("a");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", e=>{
	e.preventDefault();
	deleteTask(taskId);
    })
    buttons.appendChild(delBtn);
    
    container.appendChild(buttons);
    

    return container;
}

const loadTasks = () => {
    const container = document.getElementById("contents");
    container.innerHTML ="";
    const data = fetch(domain +"tasks",
		       {
			   mode: "cors",
			   method: "GET",
			   headers: {
			       'Content-Type': "application/json",
			   }
		       }
		      )
	  .then((res) => {
	      if (!res.ok) {
		  console.log(res);
	      } else {
		  return res.json();
	      }
	  })
    	  .then((res) => {
	      console.log(res)
	      res.map((item) => {
		  const task = taskElement(item["task-name"], item["description"], item["last-updated"]);
		  container.appendChild(task);
		  console.log(container);
	      })
	  })


    //     const xhttp = new XMLHttpRequest();
    //     xhttp.onload = function() {
    // 	document.getElementById("container").innerHTML = this.responseText;
    //     }
    //     xhttp.open("GET", "http://localhost:8000/tasks", true, );
    //     xhttp.send();
}


((() => {
    loadTasks();
})())

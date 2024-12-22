const taskElement = (taskName, description, lastUpdate) => {
    const container = document.createElement("div");
    const nameElement = document.createElement("h3");
    nameElement.textContent = taskName;
    container.appendChild(nameElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = description;
    container.appendChild(descriptionElement);

    const lastUpdateElement = document.createElement("i");
    const lastUpdateText = new Date(lastUpdate["$date"]);
    console.log(lastUpdateText);
    lastUpdateElement.textContent = lastUpdateText.getDate() + " " + lastUpdateText.getMonth() + " " + lastUpdateText.getFullYear(); 
    container.appendChild(lastUpdateElement);

    return container;
}

const loadTasks = () => {
    const container = document.getElementById("contents");
    const data = fetch("http://localhost:8000/tasks",
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

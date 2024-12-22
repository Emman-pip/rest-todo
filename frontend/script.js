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
    updateBtn.addEventListener("click", (e)=>
	{
	    e.preventDefault();
	    updateWindow(taskName, description, taskId);
	})
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
	      	      res.map((item) => {
		  const task = taskElement(item["task-name"], item["description"], item["last-updated"], item["_id"]["$oid"]);
		  container.appendChild(task);
		  	      })
	  })
}

const addTask = () => {
    const btn = document.getElementById("add-item");
    btn.addEventListener("click", (e)=>{
	e.preventDefault()
	
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
		'Content-Type': "application/json",
	    }

	}).catch((err) => console.log(err));
	loadTasks();
	taskName.value = ""
	description.value = ""
    })
}

const deleteTask = (taskId) => {
    fetch(`${domain}task-delete/${taskId}`, {
	method: 'DELETE',
	mode: "cors",
	headers:{
	    'Content-Type': 'application/json'
	}
    })
	.then(()=>loadTasks())
	.catch(e=>console.log(e));
   
    
n}

const updateTask = (taskId, taskNameStr, description) => {
    const data = new FormData();
    data.append("task-name", taskNameStr);
    data.append("description", description);
    fetch(`${domain}task-update/${taskId}`, {
	method: 'PUT',
	mode: "cors",
	body: data,
    })
	.then((res)=>{
	    if (!res.ok){
		console.log(res);
	    }else {
		loadTasks()		
	    }

	})
	.catch(e=>console.log(e));
    
}


const updateWindow = (taskName, description, taskId) => {
    const updatedName = document.getElementById("updated-task-name");
    const updatedDesc = document.getElementById("updated-desc");
    updatedName.value = taskName;
    updatedDesc.value = description;

    document.getElementById("update-task").addEventListener("click", (e) =>{
	e.preventDefault();
	console.log(updatedName.value)
	updateTask(taskId, updatedName.value, updatedDesc.value);
	loadTasks();
    })
}

((() => {
    loadTasks();
    addTask();
})())

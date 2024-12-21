from bson import ObjectId
from flask import Flask, request

from database import Database, TaskModel

app = Flask(__name__)

@app.route("/tasks", methods=["GET"])
def tasks():
    # print(Database().getAllTasks().to_list())
    return Database().getAllTasks()

@app.post("/new-task")
def newTask():
    taskname = request.form["taskName"]
    description = request.form["description"]
    task = TaskModel(taskname, description).getTask()
    Database().insertToDb(task)
    return {}

@app.put("/task-update/<taskId>")
def taskUpdate(taskId):
    updateData = TaskModel(request.form["taskName"], request.form["description"]).getTask()
    try:
        Database().updateTask(ObjectId(taskId), updateData)
    except:
        return {}
    return {}

@app.delete("/task-delete/<taskId>")
def taskDelete(taskId):
    try:
        Database().deleteTask(taskId)
    except:
        return {}

    return {}


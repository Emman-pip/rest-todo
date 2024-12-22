from bson import ObjectId
from flask import Flask, Response, jsonify, make_response, request
from flask_cors import CORS

from database import Database, TaskModel

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/tasks": {"origins": "http://localhost:5500"}}, 
#      methods=["GET", "POST"], 
#      allow_headers=["Content-Type", "Authorization"], 
#      supports_credentials=True)

@app.route("/tasks", methods=["GET"])
def tasks():
    # print(Database().getAllTasks().to_list())
    resp = jsonify(Database().getAllTasks())
    # resp.headers.add("Access-Control-Allow-Origin", "*")
    # resp.headers.add("Vary", "Origin")
    return resp

@app.post("/new-task")
def newTask():
    taskname = request.form["taskName"]
    description = request.form["description"]
    task = TaskModel(taskname, description).getTask()
    Database().insertToDb(task)
    return jsonify({"status": "SUCCESS"})

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
        return jsonify({})

    return jsonify({})


from bson import ObjectId, json_util
from flask import json
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

class Database():
    username = os.getenv("username")
    password = os.getenv("password")
    database = os.getenv("database")
    port = os.getenv("port")
    host = os.getenv("host")
    
    collectionName = os.getenv("collectionName")
    __client = MongoClient(host=host, port=int(port),  username=username, password=password)
    __database = __client.get_database(database)[collectionName]
    
    def __init__(self):
        pass
    
    def getDatabase(self):
        return self.__database

    def getAllTasks(self):
        return json.loads(json_util.dumps(self.__database.find()))
        # return self.__database.find()

    def insertToDb(self, entry: dict):
        self.__database.insert_one(entry)

    def updateTask(self, taskId: ObjectId, updateData:dict):
        """
        The update argument consists of the timestamp, task name, task description
        """
        # self.__database.update_one()
        filter = {"_id": taskId}
        print(self.__database.find_one(filter))
        self.__database.find_one_and_update(filter, {"$set": updateData})

    def deleteTask(self, taskId: ObjectId):
        self.__database.delete_one({"_id": ObjectId(taskId)})


class TaskModel():
    task = {}

    def __init__(self, task_name, description):
        self.task = {
            "task-name": task_name,
            "description": description,
            "last-updated": datetime.now()
        }

    def getTask(self):
        return self.task

    
if __name__ == '__main__':
    """
    The structure of the task bson file will be
    {
      ObjectId: ...,
      task-name: ...,
      description: ...,
      last-updated: ...,
    }
    """
    Database().insertToDb(TaskModel("new 2", "somethingggggg").getTask())

import os
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)


MONGO_URI = os.environ.get("MONGO")
client = MongoClient(MONGO_URI)
db = client.get_database("Cluster0")
@app.route('/')
def index():
    return "Server is Up and Running on Azure!"

if __name__ == "__main__":
    app.run()
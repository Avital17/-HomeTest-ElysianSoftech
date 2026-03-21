import os
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MONGO = os.environ.get("Mongo")
client = MongoClient(MONGO)
#db = client.get_database("Cluster0")

db = client.get_database("users") 
collection = db.get_collection("users")
@app.route('/')

#check
def index():
    return "Server is Up"

@app.route('/login', methods=['POST'])
def login_check():
    data = request.json
    email = data.get("email")
    password = data.get("password")

   
    user = collection.find_one({
        "email": email,
        "password": password
    })

    if user:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})

if __name__ == "__main__":
    app.run()
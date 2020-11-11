from flask import Flask, request
from flask_cors import CORS, cross_origin 


app = Flask(__name__)

cors = CORS(app, resorces={r'/*': {"origins": '*'}})
app.config['CORS_HEADER'] = 'Content-Type'


transportOptions = ['train', 'car', 'ship', 'aeroplane']
customers = []
history = [{"id":1, "type":"transport", "time": 2, "item": "train", "cost":10}, {"id":2, "cost":10, "type": "transport", "time": 2, "item": "car"}]

@app.route('/')
def hello_world():
    return 'Hello, World!'

# ---------------- Customer / Settings / Login ------------------#


@app.route('/getCustomer')
def getCustomer():
    return {"username": "Kostas", "email": "TouKostaToemail@test.com", "bugdet": 20}, 200

@app.route('/insertCustomer')
def insertCustomer():
    return "OK", 200

@app.route('/updateCustomer')
def updateCustomer():
    return "OK", 200

@app.route('/deleteCustomer')
def deleteCustomer():
    return "OK", 200

@app.route('/login')
def login():
    return "OK", 200

@app.route('/updateUserSettings')
def updateUserSettings():
    return "OK", 200

# ---------------- GRUD Orders ----------------------------------- #
@app.route('/insertOrder', methods=['POST'])
def insertOrder():
    data = request.get_json()  
    data['id'] = len(history) +1
    print("Insert orders:", data)
    history.append(data)

    return "OK", 200

@app.route('/updateOrder')
def updateOrder():
    print("Update orders:", request)
    return "OK", 200

@app.route('/deleteOrder', methods=['POST'])
def deleteOrder():
    data = request.get_json()  
    print("Delete orders:", data)
    return "OK", 200

@app.route('/getOrder')
def getOrder():
    return {"orders":history}, 200

# ---------------- Transports ----------------------------------- #


@app.route('/getFilterOptions')
def getFilterOptions():
    return { 
        "transportObjects" : [
            { "item": "train", "id":1, "description":"Train"}, 
            {"item":"battleship", "id":2, "description":"Battleship"},
            {"item":"Car", "id":3, "description":"Car"},
            {"item":"Spaceship", "id":4, "description":"Spaceship"}],
        "dateRangeMin":"2020-04-01",
        "dateRangeMax":"2020-07-01",
        "HoursMin":0, 
        "HoursMax":100,
        "CostMin":0, 
        "CostMax":50
          }, 200



@app.route('/getTransportObjects')
def getTransportObjects():
    return { "transportObjects" : [
        { "item": "train", "id":1, "description":"Train"}, {"item":"battleship", "id":2, "description":"Battleship"},
        {"item":"Car", "id":3, "description":"Car"}, {"item":"Spaceship", "id":4, "description":"Spaceship"}],
        "foodObjects":[ { "item": "meat", "id":1, "description":"Meat"}, {"item":"fish", "id":2, "description":"fish"},
        {"item":"groceries", "id":3, "description":"groceries"}, {"item":"water", "id":4, "description":"water"}
        ]}, 200


if __name__ == '__main__':
    app.run()
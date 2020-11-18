from flask import Flask, request
from flask_cors import CORS, cross_origin 
import pymysql.cursors


app = Flask(__name__)

cors = CORS(app, resorces={r'/*': {"origins": '*'}})
app.config['CORS_HEADER'] = 'Content-Type'
app.config['MYSQL_HOST'] = db['DB_HOST']
app.config['MYSQL_USER'] = db['DB_USER']
app.config['MYSQL_PASSWORD'] = db['DB_PASSWORD']
app.config['MYSQL_DB'] = db['DB']


def getConnection():
    try:
        connection = pymysql.connect(host=app.config['MYSQL_HOST'],
                            user=app.config['MYSQL_USER'],
                            password=app.config['MYSQL_PASSWORD'],
                            db=app.config['MYSQL_DB'],
                            port = 3306,
                            charset='utf8mb4',
                            cursorclass = pymysql.cursors.DictCursor)
    except Exception as e:
        print(e)
        app.logger.critical('Connection refused')
        return False

    return connection


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/login')
def login():
    return 

@app.route('/signin')
def login():
    return 

@app.route('/updateUser', methods=['POST'])
def updateCustomer():
    response, status = updateUser.updateUser(connection = getConnection(), data = request.get_json())
    return jsonify(data=response), status

@app.route('/deleteUser', methods=['POST'])
def deleteCustomer():
    response, status = deleteUser.deleteUser(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getUserDetails'), methods=['POST']
def getUserDetails():
    response, status = getUserDetails.getUserDetails(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getTransportObjects', methods=['POST'])
def getTransportObjects():
    response, status = getTransportObjects.getTransportObjects(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getFoodObjects', methods=['POST'])
def getTransportObjects():
    response, status = getFoodObjects.getFoodObjects(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/deleteEnergy', methods=['POST'])
def deleteEnergy():
    response, status = deleteEnergy.deleteEnergy(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/insertEnergy', methods=['POST'])
def insertEnergy():
    response, status = insertEnergy.insertEnergy(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/updateEnergy', methods=['POST'])
def updateEnergy():
    response, status = updateEnergy.updateEnergy(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getEnergyHistory', methods=['POST'])
def getEnergyHistory():
    response, status = getEnergyHistory.getEnergyHistory(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getFilterOptions', methods=['POST'])
def getFilterOptions():
    response, status = getEnergyHistory.getEnergyHistory(connection = getConnection(), data = request.get_json())
    return response, status    

if __name__ == '__main__':
    app.run()
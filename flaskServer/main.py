from flask import Flask, request
from flask_cors import CORS, cross_origin 
import pymysql.cursors
import yaml
import jwt
from flask_bcrypt import Bcrypt 

from src.transports import getTransportObjects
from src.foods import getFoodObjects
from src.user import getUserDetails
from src.user import deleteUser
from src.user import updateUser

from src.energy import insertEnergy
from src.energy import deleteEnergy
from src.energy import updateEnergy
from src.energy import getEnergyHistory
from src.energy import getUserEnergy

from src import getFilterOptions

from src.user import login 

db = yaml.safe_load(open('configs/local.yml'))

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = db['SECRET_KEY']

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
def _hello_world():
    return 'Hello, World!'


@app.route('/signin')
def _signin():
    return 

@app.route('/login' , methods=['POST'])
def _login():
    response, status = login.login(connection = getConnection(), data = request.get_json(), key = app.config['SECRET_KEY'], bcrypt = bcrypt)
    return response, status

@app.route('/updateUser', methods=['POST'])
def _updateCustomer():
    response, status = updateUser.updateUser(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/deleteUser', methods=['POST'])
def _deleteCustomer():
    response, status = deleteUser.deleteUser(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getUserDetails', methods=['POST'])
def _getUserDetails():
    response, status = getUserDetails.getUserDetails(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getTransportObjects', methods=['POST'])
def _getTransportObjects():
    response, status = getTransportObjects.getTransportObjects(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getFoodObjects', methods=['POST'])
def _getFoodObjects():
    response, status = getFoodObjects.getFoodObjects(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/deleteEnergy', methods=['POST'])
def _deleteEnergy():
    response, status = deleteEnergy.deleteEnergy(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/insertEnergy', methods=['POST'])
def _insertEnergy():
    response, status = insertEnergy.insertEnergy(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/updateEnergy', methods=['POST'])
def _updateEnergy():
    response, status = updateEnergy.updateEnergy(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getUserEnergy', methods=['POST'])
def _getUserEnergy():
    response, status = getUserEnergy.getUserEnergy(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getEnergyHistory', methods=['POST'])
def _getEnergyHistory():
    response, status = getEnergyHistory.getEnergyHistory(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getFilterOptions', methods=['POST'])
def _getFilterOptions():
    response, status = getFilterOptions.getFilterOptions(connection = getConnection(), data = request.get_json())
    return response, status    

if __name__ == '__main__':
    app.run()
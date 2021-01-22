from flask import Flask, request
from flask_cors import CORS, cross_origin 
from flask_bcrypt import Bcrypt 
from flask_mail import Mail, Message 
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql.cursors
import yaml
import jwt

from src.transports import getTransportObjects
from src.foods import getFoodObjects
from src.user import getUserDetails
from src.user import deleteUser
from src.user import updateUser


from src.rateMe import getUserRate
from src.rateMe import saveUserRate


from src.energy import insertEnergy
from src.energy import deleteEnergy
from src.energy import updateEnergy
from src.energy import getEnergyHistory
from src.energy import getUserEnergy
from src.energy import getEnergyObjects

from src import getFilterOptions

from src.user import login 
from src.user import signin 
from src.user import forgotPassword


configs = yaml.safe_load(open('configs/local.yml'))

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = configs['SECRET_KEY']

cors = CORS(app, resorces={r'/*': {"origins": '*'}})
app.config['CORS_HEADER'] = 'Content-Type'

#database configs
app.config['MYSQL_HOST'] = configs['DB_HOST']
app.config['MYSQL_USER'] = configs['DB_USER']
app.config['MYSQL_PASSWORD'] = configs['DB_PASSWORD']
app.config['MYSQL_DB'] = configs['DB']

#mail configs
app.config['MAIL_SERVER']="smtp.gmail.com"
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = configs['MAIL_USER']
app.config['MAIL_PASSWORD'] = configs['MAIL_PASS']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True


mail = Mail(app)
auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username, password):
    print(username, password)
    if username == 'iPolluteUserName':
        check_password_hash(password,  configs['BASIC_AUTH'])
        return username
    return None



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


@app.errorhandler(500)
def server_error(e):
	return {'error': 'An internal error occurred'}, 500

@app.errorhandler(503)
def service_unavailable(e):
	return {'error': 'Service Unavailable'}, 503

@app.errorhandler(404)
def service_unavailable(e):
	return {'error': 'Not Found'}, 404

@app.errorhandler(400)
def service_unavailable(e):
	return {'error': 'Could not process the form!'}, 400

@app.errorhandler(401)
def service_unavailable(e):
	return {'error': 'Error in authentication method'}, 401

@app.route('/')
def _hello_world():
    return 'Hello, World!'

@app.route('/signup', methods=['POST'])
@auth.login_required
def _signin():
    response, status = signin.signin(connection = getConnection(), data = request.get_json(), key = app.config['SECRET_KEY'], bcrypt = bcrypt)
    return response, status

@app.route('/login' , methods=['POST'])
@auth.login_required
def _login():
    response, status = login.login(connection = getConnection(), data = request.get_json(), key = app.config['SECRET_KEY'], bcrypt = bcrypt)
    return response, status

@app.route('/forgotPassword' , methods=['POST'])
@auth.login_required
def _forgotPassword():
    response, status = forgotPassword.forgotPassword(connection = getConnection(), data = request.get_json(), mail =  mail)
    return response, status

@app.route('/updateUser', methods=['POST'])
@auth.login_required
def _updateCustomer():
    response, status = updateUser.updateUser(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/deleteUser', methods=['POST'])
@auth.login_required
def _deleteCustomer():
    response, status = deleteUser.deleteUser(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getUserDetails', methods=['POST'])
@auth.login_required
def _getUserDetails():
    response, status = getUserDetails.getUserDetails(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getEnergyObjects', methods=['POST'])
@auth.login_required
def _getEnergyObjects():
    response, status = getEnergyObjects.getEnergyObjects(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getTransportObjects', methods=['POST'])
@auth.login_required
def _getTransportObjects():
    response, status = getTransportObjects.getTransportObjects(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getFoodObjects', methods=['POST'])
@auth.login_required
def _getFoodObjects():
    response, status = getFoodObjects.getFoodObjects(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/deleteEnergy', methods=['POST'])
@auth.login_required
def _deleteEnergy():
    response, status = deleteEnergy.deleteEnergy(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/insertEnergy', methods=['POST'])
@auth.login_required
def _insertEnergy():
    response, status = insertEnergy.insertEnergy(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/updateEnergy', methods=['POST'])
@auth.login_required
def _updateEnergy():
    response, status = updateEnergy.updateEnergy(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getUserEnergy', methods=['POST'])
def _getUserEnergy():
    response, status = getUserEnergy.getUserEnergy(connection = getConnection(), data = request.get_json())
    return response, status

@app.route('/getEnergyHistory', methods=['POST'])
@auth.login_required
def _getEnergyHistory():
    response, status = getEnergyHistory.getEnergyHistory(connection = getConnection(), data = request.get_json())
    return response, status


@app.route('/getFilterOptions', methods=['POST'])
@auth.login_required
def _getFilterOptions():
    response, status = getFilterOptions.getFilterOptions(connection = getConnection(), data = request.get_json())
    return response, status    

@app.route('/getUserRate', methods=['POST'])
@auth.login_required
def _getUserRate():
    response, status = getUserRate.getUserRate(connection = getConnection(), data = request.get_json())
    return response, status    

@app.route('/saveUserRate', methods=['POST'])
@auth.login_required
def _saveUserRate():
    response, status = saveUserRate.saveUserRate(connection = getConnection(), data = request.get_json())
    return response, status    

if __name__ == '__main__':
    app.run()
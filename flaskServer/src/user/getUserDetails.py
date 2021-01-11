import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getUserDetails(connection, data):
    '''
    Get User Details
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getUserDetails({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            userDetails = cursor.fetchall()
        if len(userDetails)>0:
            return {"userDetails":userDetails[0], "success":True}, 200
        else:
            return {"userDetails":{}, "success":False}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"userDetails":{'energyTotal':0}, "success":False}, 500

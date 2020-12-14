import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getTransportObjects(connection = '', data = {}):
    '''
    Get Transport Objects
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getTransportObjects({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transports = cursor.fetchall()
        if len(transports)>0:
            for i in range(len(transports)):
                transports[i]['typeDescription'] = 'transport'
                transports[i]['energyType'] = 1
            return {"transportObjects" : transports }, 200
        else:
            return {"transportObjects" : [] }, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"transportObjects" : [] }, 500

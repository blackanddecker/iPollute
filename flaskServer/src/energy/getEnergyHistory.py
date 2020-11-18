import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getEnergyHistory(connection, data):
    '''
    Get User Energy History
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            history = connection.commit()
        
        if len(history)>0:
            return {"history":history, "success":True}, 200
        else:
            return {"history":{}, "success":False}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"history":{}, "success":False}, 500
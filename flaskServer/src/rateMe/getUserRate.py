import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getUserRate(connection, data):
    '''
    Get Filter Options
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getUserRate({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            rate = cursor.fetchall()
        

                
        if len(rate)>0:
            return {"ratings":rate[-1], "success":True}, 200
        else:
            return {"ratings":{"star": 3}, "success":False}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"ratings":{"star": 3}, "success":False}, 500
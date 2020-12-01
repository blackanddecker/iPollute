import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getFilterOptions(connection, data):
    '''
    Get Filter Options
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getFilterOptions({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            filters = cursor.fetchall()
        
        if len(filters)>0:
            return {"filters":filters[0], "success":True}, 200
        else:
            return {"filters":{}, "success":False}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"filters":{}, "success":False}, 500
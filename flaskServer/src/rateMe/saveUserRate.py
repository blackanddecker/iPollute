import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def saveUserRate(connection, data):
    '''
    Get Filter Options
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    if 'comment' not in data:
        return {'message':'comment missing!', 'success': False}, 400
    if 'star' not in data:
        return {'message':'star missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL saveUserRate({}, {}, '{}');".format(data['userId'], data['star'], data['comment'])
            print(sql)
            cursor.execute(sql)
            connection.commit()
        
            return {"success":True, "message": "Save user ratings"}, 200


    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"filters":{}, "success":False}, 500
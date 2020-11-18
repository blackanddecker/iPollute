import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getFoodObjects(connection, data):
    '''
    Get Food Objects
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getFoodObjects({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            foods = connection.commit()
        if len(foods)>0:
            return {"foodObjects" : foods }, 200
        else:
            return {"foodObjects" : [] }, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"foodObjects" : [] }, 500

import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getUserEnergy(connection, data):
    '''
    Get User Energy 
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getUserEnergy({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            energy = cursor.fetchall()[0]
            print(energy)

            
            
            
            
            return {"userEnergy":energy, "success":True}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"userEnergy":{"totalTransportCost": 0, "totalFoodCost":0}, "success":False}, 500
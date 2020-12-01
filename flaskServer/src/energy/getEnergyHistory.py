import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
from src.utils.costCalculations import costTransportCalculations, costFoodCalculations

def getEnergyHistory(connection, data):
    '''
    Get User Energy History
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getFoodEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            foodHistory = cursor.fetchall()


        with connection.cursor() as cursor:
            sql = "CALL getTransportEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()

            return {"foodHistory":foodHistory, "transportHistory":transportHistory, "success":True}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"history":[], "success":False}, 500
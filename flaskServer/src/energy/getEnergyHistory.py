import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
from src.utils.costCalculations import costCalculations

def getEnergyHistory(connection, data):
    '''
    Get User Energy History
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        history = []
        totalCo2 = 0 
        totalRecycledCo2 = 0
        totalCo2Reduced = 0 
        with connection.cursor() as cursor:
            sql = "CALL getFoodEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            history +=transportHistory
            
            sql = "CALL getTransportEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            history +=transportHistory

            sql = "CALL getElectricityEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            history +=transportHistory

            sql = "CALL getRecycledEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            history +=transportHistory

            for item in history: 
                print(item)
                totalCo2 += item['totalCost'] 
                totalRecycledCo2 += item['totalCost']  
                totalCo2Reduced += item['totalCost'] 

            print(history)
            return {"history":history, "success":True,    "totalStats": {"totalCo2": totalCo2, "totalRecycledCo2":totalRecycledCo2,  "totalCo2Reduced":totalCo2Reduced} }, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"history":[], "success":False}, 500
import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getEnergyObjects(connection, data):
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
            foods = cursor.fetchall()
            if len(foods)>0:
                for i in range(len(foods)):
                    foods[i]['typeDescription'] = 'foods'
                    foods[i]['energyType'] = 0

        with connection.cursor() as cursor:
            sql = "CALL getTransportObjects({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transports = cursor.fetchall()
            if len(transports)>0:
                for i in range(len(transports)):
                    transports[i]['typeDescription'] = 'transport'
                    transports[i]['energyType'] = 1


        with connection.cursor() as cursor:
            sql = "CALL getRecycleObjects({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            recycles = cursor.fetchall()
            if len(recycles)>0:
                for i in range(len(recycles)):
                    recycles[i]['typeDescription'] = 'recycles'
                    recycles[i]['energyType'] = 2

        with connection.cursor() as cursor:
            sql = "CALL geElectricityObjects({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            electricity = cursor.fetchall()
            if len(electricity)>0:
                for i in range(len(electricity)):
                    electricity[i]['typeDescription'] = 'electricity'
                    electricity[i]['energyType'] = 3

            return {"foodObjects" : foods, "transportObjects" : transports, "recycledObjects":  recycles, "electricityObjects": electricity}, 200


    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"foodObjects" : [] }, 500

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
            sql = "CALL getFoodEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            foodHistory = cursor.fetchall()

            #calculate food cost
            if len(foodHistory) > 0 : 
                for i in range(0, len(foodHistory)):
                    foodHistory[i]['cost'] = costFoodCalculations(foodHistory[i]['foodCost'] , foodHistory[i]['energyCost'] )

        with connection.cursor() as cursor:
            sql = "CALL getFoodEnergyHistory({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
        
            #calculate tranport cost
            if len(transportHistory) > 0 : 
                for i in range(0, len(transportHistory)):
                    transportHistory[i]['cost'] = costFoodCalculations(transportHistory[i]['transportCost'] , transportHistory[i]['energyCost'] )

            return {"foodHistory":foodHistory, "transportHistory":transportHistory, "success":True}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"history":[], "success":False}, 500
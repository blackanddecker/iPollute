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

            if energy['totalFoodCost'] is None:
                energy['totalFoodCost'] = 0.0
            
            if energy['totalTransportCost'] is None:
                energy['totalTransportCost'] = 0.0
            
            if energy['totalElectricityCost'] is None:
                energy['totalElectricityCost'] = 0.0

            if energy['totalRecycleCost'] is None:
                energy['totalRecycleCost'] = 0.0
                       
            energy['totalTransportCost'] = round(energy['totalTransportCost'],1)
            energy['totalFoodCost'] = round(energy['totalFoodCost'],1)
            energy['totalElectricityCost'] = round(energy['totalElectricityCost'],1)
            energy['totalRecycleCost'] = round(energy['totalRecycleCost'],1)

            print(energy)
            
            return {"userEnergy":energy, "success":True}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"userEnergy":{"totalTransportCost": 0, "totalFoodCost":0, "totalRecycleCost": 0, "totalElectricityCost":0}, "success":False}, 500
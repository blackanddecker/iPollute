import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def updateEnergy(connection, data):
    '''
    Insert Energy
    '''
    if 'energyId' not in data:
        return {'message':'energyId missing!', 'success': False}, 400
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    if 'foodId' not in data:
        return {'message':'foodId missing!', 'success': False}, 400
    if 'transportId' not in data:
        return {'message':'transportId missing', 'success': False}, 400
    if 'cost' not in data:
        return {'message':'cost missing', 'success': False}, 400
    
    try:

        if foodId is not None:
            energyCost = calculateFoodCost(foodId, cost)
        elif transportId is not None:
            energyCost = calculateTransportCost(transportId, cost)
        else:
            return {'message': 'Wrong Inputs', 'success': False}, 200

        with connection.cursor() as cursor:
            sql = "CALL updateEnergy({}, {}, {}, {}, @s);".format(
                data['energyId'],
                data['userId'], 
                data['foodId'],
                data['transportId'],
                data['cost']
            )
            print(sql)
            cursor.execute(sql)
            result = connection.commit()
            cursor.execute('select @s;')
            check = cursor.fetchall()

        if check[0]['@s'] == 1:
            return {'message': 'Update Energy Succefully!', 'success': True}, 200
        else:
            return {'message':'Error Updating Energy', 'success': False}, 200
    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {'message':'Internal Server Error', 'success': False}, 500

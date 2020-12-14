import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

from src.utils.costCalculations import costCalculations

def insertEnergy(connection, data):
    '''
    Insert Energy
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    if 'foodId' not in data:
        return {'message':'foodId missing!', 'success': False}, 400
    if 'transportId' not in data:
        return {'message':'transportId missing', 'success': False}, 400
    if 'cost' not in data:
        return {'message':'cost missing', 'success': False}, 400
    try:

        if data['foodId'] is not None:
            #energyCost = costFoodCalculations(data['foodId'] , data['cost'] )
            data['transportId'] = "NULL"

        elif data['transportId'] is not None:
            #energyCost = costTransportCalculations(data['transportId'] , data['cost'] )
            data['foodId'] = "NULL"
        else:
            return {'message': 'Wrong Inputs', 'success': False}, 200

        with connection.cursor() as cursor:
            sql = "CALL insertEnergy({}, {}, {}, {});".format(
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
            return {'message': 'Add Energy Succefully!', 'success': True}, 200
        else:
            return {'message':'Error adding Energy', 'success': False}, 200
    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {'message':'Internal Server Error', 'success': False}, 500

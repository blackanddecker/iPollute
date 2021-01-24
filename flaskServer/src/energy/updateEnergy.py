import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

from src.utils.costCalculations import costCalculations

def updateEnergy(connection, data):
    '''
    Insert Energy
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    if 'energyId' not in data:
        return {'message':'energyId missing!', 'success': False}, 400
    if 'userCost' not in data:
        return {'message':'userCost missing', 'success': False}, 400
    if 'energyItemId' not in data:
        return {'message':'energyItemId missing', 'success': False}, 400
    if 'energyTypeId' not in data:
        return {'message':'energyTypeId missing', 'success': False}, 400
    try:
        print(data)
        energyCost = costCalculations(connection, data['userCost'], data['energyItemId'], data['energyTypeId'], data['userId'] )

        with connection.cursor() as cursor:
            sql = "CALL updateEnergy({}, {}, {}, {});".format(
                data['userId'], 
                data['energyId'],
                data['userCost'],
                energyCost
            )
            print(sql)
            cursor.execute(sql)
            connection.commit()

            return {'message': 'Add Energy Succefully!', 'success': True}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {'message':'Internal Server Error', 'success': False}, 500

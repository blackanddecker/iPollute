import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
from src.utils.costCalculations import costCalculations, updateUserEnergy, findMessage


def insertEnergy(connection, data):
    '''
    Insert Energy
    '''
    print(data)
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    if 'energyItemId' not in data:
        return {'message':'energyItemId missing', 'success': False}, 400
    if 'energyTypeId' not in data:
        return {'message':'energyTypeId missing', 'success': False}, 400
    if 'userCost' not in data:
        return {'message':'userCost missing', 'success': False}, 400
    if 'datetime' not in data:
        return {'message':'datetime missing', 'success': False}, 400
    try:

        energyCost = costCalculations(connection, data['userCost'], data['energyItemId'], data['energyTypeId'], data['userId'] )
            
        with connection.cursor() as cursor:
            # add energy
            print("------------> ADD ENERGY :",data['energyTypeId'], data['energyItemId'])
            sql = "CALL insertEnergy({}, {}, {}, {},'{}', {});".format(
                data['userId'], data['energyTypeId'], data['energyItemId'], data['userCost'], data['datetime'],energyCost)
            
            print(sql)
            cursor.execute(sql)
            result = connection.commit()

            # update user energy

            updateUserEnergy(connection, data['userId'], energyCost)

            # send message 

            messageText = findMessage(energyCost)

            return {'message': messageText, 'success': True}, 200
    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {'message':'Internal Server Error', 'success': False}, 500

import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def deleteEnergy(connection, data):
    '''
    Delete Energy
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    if 'energyId' not in data:
        return {'message':'energyId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL deleteEnergy({}, {},@s);".format(
                data['userId'], data['energyId'] )
            print(sql)
            cursor.execute(sql)
            result = connection.commit()
            cursor.execute('select @s;')
            check = cursor.fetchall()

        if check[0]['@s'] == 1:
            return {'message': 'Energy deleted!', 'success': True}, 200
        else:
            return {'message':'Error Deleting Energy', 'success': False}, 200
    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {'message':'Internal Server Error', 'success': False}, 500
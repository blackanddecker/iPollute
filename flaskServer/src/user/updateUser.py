import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def updateUser(connection, data):
    '''
    Update User
    '''
    print(data)
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    if 'email' not in data:
        return {'message':'Email missing!', 'success': False}, 400
    if 'username' not in data:
        return {'message':'Username missing!', 'success': False}, 400
    if 'password' not in data:
        return {'message':'Password missing', 'success': False}, 400
    if 'userEnergy' not in data:
        return {'message':'User Energy missing', 'success': False}, 400
    try:
        print("/getEnergyHistory data:", data)

        with connection.cursor() as cursor:
            sql = "CALL updateUser({}, '{}', '{}', '{}', {}, @s);".format(
                data['userId'], 
                data['username'],
                data['email'],
                data['password'],
                data['userEnergy']
            )
            print(sql)
            cursor.execute(sql)
            result = connection.commit()
            cursor.execute('select @s;')
            check = cursor.fetchall()

        if check[0]['@s'] == 1:
            return {'message': 'User updated!', 'success': True}, 200
        else:
            return {'message':'Error Updating User', 'success': False}, 200
    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {'message':'Internal Server Error', 'success': False}, 500

import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
import jwt
import datetime
import traceback


def signin(connection, data, key , bcrypt):
    '''
    Check for 400 error
    Check database for password and email 
    return token or error message
    '''
    data = request.get_json()
    #check for 400 error
    if request.method != 'POST':
        return 'Wrong method', 405
    if 'email' not in data:
        return jsonify({'success': False, 'message':'Incorrect email or password!'}), 400
    if 'password' not in data:
        return jsonify({'success': False, 'message':'Incorrect email or password!'}), 400 

    try:

        auth = request.authorization
        t2 = data['password'].encode('utf-8')
        print(t2, data['password'])

        with connection.cursor() as cursor:
            sql = "CALL signin('{}','{}','{}', @s)".format(data['email'] , data['password'], data['username'])
            print(sql)
            cursor.execute(sql)
            connection.commit()
            cursor.execute('select @s;')
            check = cursor.fetchall()

            if check[0]['@s'] > 0:
                #with connection.cursor() as cursor:
                sql = "CALL getUserInfo({})".format(check[0]['@s'])
                #print(sql)
                cursor.execute(sql)
                result = cursor.fetchall()

                token = jwt.encode({
                    'sub':check[0]['@s'], 'username':result[0]['username'], 'iat':datetime.datetime.utcnow()+datetime.timedelta(minutes =30)} ,
                        key , algorithm='HS256')

                return jsonify({'success': True, 'message': 'You have successfully signed in' ,'token':token.decode('UTF-8') , 'user':{'email': data['email'], 'id': check[0]['@s']}}) , 200

            else:            
                return jsonify({'success': False, 'message':'User Exists'}), 401 
 
    except Exception as e :
        print(e)
        traceback.print_exc()
        return jsonify('Could not process the form'), 400
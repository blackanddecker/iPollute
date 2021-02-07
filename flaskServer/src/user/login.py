import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
import jwt
import datetime
import traceback


def login(connection, data, key , bcrypt):
    '''
    Check for 400 error
    Check database for password and email 
    return token or error message
    '''
    data = request.get_json()
    print(data)
    #check for 400 error
    if request.method != 'POST':
        return 'Wrong method', 405
    if 'email' not in data:
        return jsonify({'success': False, 'message':'Incorrect email or password!'}), 400
    if 'password' not in data:
        return jsonify({'success': False, 'message':'Incorrect email or password!'}), 400 

    try:
        with connection.cursor() as cursor:
            #sql ="SELECT id, password FROM db2.user u WHERE u.email = '{}'".format(data['email'])
            sql = "CALL getEmailPassword('{}')".format(data['email'])
            cursor.execute(sql)
            result = cursor.fetchall()
        #create token
        if len(result) > 0 :
            auth = request.authorization
            t2 = result[0]['password'].encode('utf-8')
            #check = bcrypt.check_password_hash(result[0]['password'],data['password'] )
            #print(t2, data['password'])
            if result[0]['password'] == data['password']:
                with connection.cursor() as cursor:
                    sql = "CALL login('{}', '{}','{}', @s)".format(data['email'] , result[0]['password'], datetime.datetime.now())
                    #print(sql)
                    cursor.execute(sql)
                    connection.commit()
                    cursor.execute('select @s;')
                    check = cursor.fetchall()
                    #print(check)
                    if check[0]['@s'] == 1:
                        #with connection.cursor() as cursor:
                        sql = "CALL getUserDetails({})".format(result[0]['id'])
                        #print(sql)
                        cursor.execute(sql)
                        result = cursor.fetchall()
  
                        token = jwt.encode({
                            'sub':result[0]['id'], 'username':result[0]['username'], 'iat':datetime.datetime.utcnow()+datetime.timedelta(minutes =30)} ,
                             key , algorithm='HS256')
                        print("User Logged in", result[0]['email'])
                        return jsonify({'success': True, 'message': 'You have successfully logged in' ,'token':token, 'user':{'email': data['email'], 'id': result[0]['id']}}) , 200

                    else:            
                        return jsonify({'success': False, 'message':'Incorrect email or password!'}), 401 
            
            else:            
                return jsonify({'success': False, 'message':'Incorrect email or password!'}), 401 
        else:            
            return jsonify({'success': False, 'message':'Incorrect email or password!'}), 401  
    except Exception as e :
        print(e)
        traceback.print_exc()
        return jsonify('Could not process the form'), 400
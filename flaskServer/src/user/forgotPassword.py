from flask import Flask , request ,make_response ,jsonify , url_for
from flask import render_template
from flask_mail import Message
import pymysql.cursors
import jwt
import datetime
import random
import traceback

import string

def getNewPassword(length = 10):
    letters_and_digits = string.ascii_letters + string.digits
    result_str = ''.join((random.choice(letters_and_digits) for i in range(length)))
    return result_str


def forgotPassword(connection, data, mail):
    '''
    Check database for password and email . If the email found , create token and send email to reset password
    '''
    data = request.get_json()
    #check for 400 error
    if request.method != 'POST':
        return {'message':'Wrong Method', 'success':False}, 405
    if 'email' not in data:
        return {'message':'Could not process the form!', 'success':False}, 400  

    try:
        with connection.cursor() as cursor:
            sql = "CALL forgotPasswordCheckEmail ('{}', @sum , @p);".format(data['email'])
            print(sql)
            cursor.execute(sql)
            result = cursor.fetchall()
            cursor.execute('select @sum , @p;')
            check = cursor.fetchall()
            print("Check :", check)      

        if check[0]['@sum'] ==1:
            newPassword = getNewPassword()
            user_id = check[0]['@p']
            print(user_id)

            with connection.cursor() as cursor:
                sql = "CALL saveNewPassword('{}', {});".format(newPassword, user_id)
                print(sql)
                cursor.execute(sql)
                result = connection.commit()  

            msg = Message('IPollute: Reset Password', sender = 'baggelisfoufikos@gmail.com', recipients = ['baggelisfoufikos@gmail.com']) # recipients = data['email]

            msg.body = "Hello,\n"
            msg.body += "someone requested a new password for your account."
            msg.body += "Your new password is: " + newPassword 
            msg.body += "If you did not make this request, then you can safely ignore this email"
            msg.body += "We're always around and love hearing from you. Please get in touch if you want to ask something or even just to say hello :)"
            msg.body += "Vangelis"
            msg.html = render_template('ForgotPass.html', newPassword= newPassword ).encode('utf-8')
            
            mail.send(msg)
            return {'message': "Email send", 'success':True }, 200

        else:
            return {'message':'Invalid email', 'success':False}, 404
    
    except Exception as e :
        print(e)
        traceback.print_exc()
        return {'message':'Could not process the form!', 'success':False}, 400  
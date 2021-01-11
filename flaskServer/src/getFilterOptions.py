import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
import datetime 

def getFilterOptions(connection, data):
    '''
    Get Filter Options
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        with connection.cursor() as cursor:
            sql = "CALL getFilterOptions({});".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            filters = cursor.fetchall()

            if filters[0]['minKm'] is None:
                filters[0]['minKm'] = 0.0
            if filters[0]['maxKm'] is None:
                filters[0]['maxKm'] = 0.0
            if filters[0]['minKg'] is None:
                filters[0]['minKg'] = 0.0
            if filters[0]['maxKg'] is None:
                filters[0]['maxKg'] = 0.0
            if filters[0]['maxDate'] is None:
                filters[0]['maxDate'] = datetime.datetime.now() - datetime.timedelta(days=14)
            if filters[0]['minDate'] is None:
                filters[0]['minDate'] = datetime.datetime.now() - datetime.timedelta(days=14)

        if len(filters)>0:
            print("Filters are:",filters[0])
            return {"filters":filters[0], "success":True}, 200
        else:
            return {"filters":{
                'minDate' : datetime.datetime.now() - datetime.timedelta(days=14),
                'maxDate' : datetime.datetime.now() - datetime.timedelta(days=14),
                'maxKg' : 0.0,
                'minKg' : 0.0,
                'minKm' : 0.0,
                'maxKm' : 0.0
            }, "success":False}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"filters":{
            'minDate' : datetime.datetime.now() - datetime.timedelta(days=14),
            'maxDate' : datetime.datetime.now() - datetime.timedelta(days=14),
            'maxKg' : 0.0,
            'minKg' : 0.0,
            'minKm' : 0.0,
            'maxKm' : 0.0
        }, "success":False}, 500
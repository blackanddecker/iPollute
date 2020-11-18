import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

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
            filters = connection.commit()
        
        filters = { ,
        "dateRangeMin":"2020-04-01",
        "dateRangeMax":"2020-07-01",
        "HoursMin":0, 
        "HoursMax":100,
        "CostMin":0, 
        "CostMax":50
          }
        if len(filters)>0:
            return {"history":filters, "success":True}, 200
        else:
            return {"history":{}, "success":False}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"history":{}, "success":False}, 500
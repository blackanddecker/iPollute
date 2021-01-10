import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
from src.utils.costCalculations import costCalculations
from datetime import datetime
from datetime import timedelta

def getEnergyHistory(connection, data):
    '''
    Get User Energy History
    '''
    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400
    try:
        print("/getEnergyHistory data:", data)
        appliedFilters = {
            'isTransport': True, 
            'isFood':True, 
            'isElectricity': True,
            'isRecycle': True
        }

        if 'appliedFilters' in data:
            if str(data['appliedFilters']) != 'None':
                appliedFilters = data['appliedFilters']

        history = []
        totalCo2 = 0 
        totalRecycledCo2 = 0
        totalCo2Reduced = 0 
        with connection.cursor() as cursor:
            
            sql = "CALL getTransportEnergyHistory({});".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            if appliedFilters['isTransport'] == True:
                history +=transportHistory

                
            sql = "CALL getFoodEnergyHistory({});".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            if appliedFilters['isFood'] == True:
                history +=transportHistory
            

            sql = "CALL getElectricityEnergyHistory({});".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            if appliedFilters['isElectricity'] == True:
                history +=transportHistory

            for item in history: 
                totalCo2 += item['totalCost'] 
            
            sql = "CALL getRecycledEnergyHistory({});".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            recycledHistory = cursor.fetchall()
            if appliedFilters['isElectricity'] == True:
                history +=transportHistory

                for item in recycledHistory: 
                    totalRecycledCo2 += item['totalCost'] 





            curWeekCo2 = 0
            lastWeekCo2 = 0
            getCurDate = datetime.now() - timedelta(days=7)
            getLastWeekDate = datetime.now() - timedelta(days=14)
            # print("getCurDate", getCurDate)
            # print("getLastWeekDate", getLastWeekDate)
            
            for item in history: 
                if item['energyType'] == 2:
                    cost = (-1) * item['totalCost']
                else:
                    cost = item['totalCost']

                if getCurDate < item['energyDate'] :
                    curWeekCo2 += cost
                    # print("Cost is", cost, "1date is:", item['energyDate'],curWeekCo2 )
                elif getCurDate > item['energyDate'] and getLastWeekDate < item['energyDate']:
                    lastWeekCo2 += cost
                    # print("2Cost is", cost, "1date is:", item['energyDate'], lastWeekCo2 )
            if lastWeekCo2 == 0:
                lastWeekCo2 = 0.0001

            totalCo2Reduced = (lastWeekCo2- curWeekCo2) / lastWeekCo2 


            print(history)
            return {"history":history, "success":True,    "totalStats": {"totalCo2": totalCo2, "totalRecycledCo2":totalRecycledCo2,  "totalCo2Reduced":round(totalCo2Reduced,1)} }, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"history":[], "success":False}, 500
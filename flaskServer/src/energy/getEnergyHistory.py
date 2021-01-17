import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
from src.utils.costCalculations import costCalculations
import datetime

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
            'isRecycle': True,
        }

        if 'appliedFilters' in data:
            if str(data['appliedFilters']) == 'None':
                appliedFilters['lowKm'] = 0 
                appliedFilters['lowKg'] = 0 
                appliedFilters['minCurrentDate'] = "2019-01-01"
                appliedFilters['maxCurrentDate'] = "2031-01-01"
            
            elif str(data['appliedFilters']) != 'None':
                appliedFilters = data['appliedFilters']
                if appliedFilters['lowKm'] is None:
                    appliedFilters['lowKm'] = 0 
                if appliedFilters['lowKg'] is None:
                    appliedFilters['lowKg'] = 0 
                if appliedFilters['minCurrentDate'] is None:
                    appliedFilters['minCurrentDate'] = datetime.timedelta(years=10)
                if appliedFilters['maxCurrentDate'] is None:
                    appliedFilters['maxCurrentDate'] = datetime.datetime.now() 




        history = []
        recycledHistory = []
        totalCo2 = 0 
        totalRecycledCo2 = 0
        totalCo2Reduced = 0 
        with connection.cursor() as cursor:
            
            sql = "CALL getTransportEnergyHistory({});".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            
            appliedFilters['minCurrentDate'] = datetime.datetime.strptime(appliedFilters['minCurrentDate'], '%Y-%m-%d')
            appliedFilters['maxCurrentDate'] = datetime.datetime.strptime(appliedFilters['maxCurrentDate'], '%Y-%m-%d')

            if appliedFilters['isTransport'] == True:
                for i in range(len(transportHistory)): 
                    if float(transportHistory[i]['userCost']) >= float(appliedFilters['lowKm']) and transportHistory[i]['energyDate'] >= appliedFilters['minCurrentDate'] and transportHistory[i]['energyDate'] <= appliedFilters['maxCurrentDate']:
                        history.append(transportHistory[i])
                
            sql = "CALL getFoodEnergyHistory({});".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            if appliedFilters['isFood'] == True:
                for i in range(len(transportHistory)): 
                    if float(transportHistory[i]['userCost']) >= float(appliedFilters['lowKg']) and transportHistory[i]['energyDate'] >= appliedFilters['minCurrentDate'] and transportHistory[i]['energyDate'] <= appliedFilters['maxCurrentDate'] : 
                        history.append(transportHistory[i])
            

            sql = "CALL getElectricityEnergyHistory({});".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            if appliedFilters['isElectricity'] == True:
                for i in range(len(transportHistory)): 
                    if transportHistory[i]['energyDate'] >= appliedFilters['minCurrentDate'] and transportHistory[i]['energyDate'] <= appliedFilters['maxCurrentDate']:
                        history.append(transportHistory[i])



            # After applying filters
            for item in history: 
                totalCo2 += item['totalCost'] 
            
            sql = "CALL getRecycledEnergyHistory({});".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            recycled = cursor.fetchall()
            
            if appliedFilters['isRecycle'] == True:
                for i in range(len(recycled)): 
                    if recycled[i]['energyDate'] >= appliedFilters['minCurrentDate'] and recycled[i]['energyDate'] <= appliedFilters['maxCurrentDate']:
                        recycledHistory.append(recycled[i])
                        history.append(recycled[i])


            for item in recycledHistory: 
                totalRecycledCo2 += item['totalCost'] 


            curWeekCo2 = 0
            lastWeekCo2 = 0
            getCurDate = datetime.datetime.now() - datetime.timedelta(days=7)
            getLastWeekDate = datetime.datetime.now() - datetime.timedelta(days=14)
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


            for i in history:
                print(i)
            return {"history":history, "success":True, "totalStats": {"totalCo2": round(totalCo2,1), "totalRecycledCo2":round(totalRecycledCo2,1),  "totalCo2Reduced":round(totalCo2Reduced,1)} }, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"history":[], "totalStats": {"totalCo2": 0, "totalRecycledCo2":0,  "totalCo2Reduced":0}, "success":False}, 500
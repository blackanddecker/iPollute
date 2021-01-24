import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify
from src.utils.costCalculations import costCalculations
import datetime
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

        elif 'appliedFilters' not in str(data):
            appliedFilters['lowKm'] = 0 
            appliedFilters['lowKg'] = 0 
            appliedFilters['minCurrentDate'] = "2019-01-01"
            appliedFilters['maxCurrentDate'] = "2031-01-01"




        history = []
        recycledHistory = []
        totalCo2 = 0 
        totalRecycledCo2 = 0
        totalCo2Reduced = 0 
        totalRecycleCost = 0 
        totalTransportCost = 0 
        totalFoodCost = 0
        totalElectricityCost = 0

        with connection.cursor() as cursor:
            
            sql = "CALL getEnergyHistory({}, 1);".format(data['userId'])
            print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            appliedFilters['minCurrentDate'] = datetime.datetime.strptime(appliedFilters['minCurrentDate'], '%Y-%m-%d')
            appliedFilters['maxCurrentDate'] = datetime.datetime.strptime(appliedFilters['maxCurrentDate'], '%Y-%m-%d') + timedelta(days=1)
            print("> appliedFilters", appliedFilters)

            if appliedFilters['isTransport'] == True:
                for i in range(len(transportHistory)): 
                    if float(transportHistory[i]['userCost']) >= float(appliedFilters['lowKm']) and transportHistory[i]['energyDate'] >= appliedFilters['minCurrentDate'] and transportHistory[i]['energyDate'] <= appliedFilters['maxCurrentDate']:
                        history.append(transportHistory[i])
                        totalTransportCost += transportHistory[i]['totalCost']
                
            sql = "CALL getEnergyHistory({}, 0);".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            if appliedFilters['isFood'] == True:
                for i in range(len(transportHistory)): 
                    if float(transportHistory[i]['userCost']) >= float(appliedFilters['lowKg']) and transportHistory[i]['energyDate'] >= appliedFilters['minCurrentDate'] and transportHistory[i]['energyDate'] <= appliedFilters['maxCurrentDate'] : 
                        history.append(transportHistory[i])
                        totalFoodCost += transportHistory[i]['totalCost']

            

            sql = "CALL getEnergyHistory({}, 3);".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            transportHistory = cursor.fetchall()
            if appliedFilters['isElectricity'] == True:
                for i in range(len(transportHistory)): 
                    if transportHistory[i]['energyDate'] >= appliedFilters['minCurrentDate'] and transportHistory[i]['energyDate'] <= appliedFilters['maxCurrentDate']:
                        history.append(transportHistory[i])
                        totalElectricityCost += transportHistory[i]['totalCost']



            # After applying filters
            for item in history: 
                totalCo2 += item['totalCost'] 
            
            sql = "CALL getEnergyHistory({}, 2);".format(data['userId'])
            # print(sql)
            cursor.execute(sql)
            recycled = cursor.fetchall()
            
            if appliedFilters['isRecycle'] == True:
                for i in range(len(recycled)): 
                    if recycled[i]['energyDate'] >= appliedFilters['minCurrentDate'] and recycled[i]['energyDate'] <= appliedFilters['maxCurrentDate']:
                        recycledHistory.append(recycled[i])
                        history.append(recycled[i])
                        totalRecycleCost += recycledHistory[i]['totalCost']



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
                totalCo2Reduced = 0
            else:
                totalCo2Reduced = (lastWeekCo2- curWeekCo2) / lastWeekCo2 


            for i in history:
                print(i)

            energy = {}
            energy['totalTransportCost'] = totalTransportCost
            energy['totalFoodCost'] = totalFoodCost
            energy['totalElectricityCost'] = totalElectricityCost
            energy['totalRecycleCost'] = totalRecycleCost

            energy['totalUserEnergyCost'] = round(energy['totalTransportCost'],1) + round(energy['totalFoodCost'],1) + round(energy['totalElectricityCost'],1)  #Total Garbage
            energy['totalUserEnergyRecycle'] = round(energy['totalRecycleCost'],1) # Total Non Garbage
            if energy['totalUserEnergyCost'] != 0: 
                energy['totalUserSavings'] = round( 100 *(( energy['totalRecycleCost']) / energy['totalUserEnergyCost']),1) #Total Recycled /Total Garbage
                energy['totalTransportCost'] = round(100 * ( energy['totalTransportCost'] / energy['totalUserEnergyCost']) ,1)
                energy['totalFoodCost'] = round(100 *( energy['totalFoodCost']/ energy['totalUserEnergyCost']) ,1)
                energy['totalElectricityCost'] = round(100 *( energy['totalElectricityCost']/ energy['totalUserEnergyCost']) ,1)
            else:
                energy['totalUserSavings'] = 0
                energy['totalTransportCost'] = 0
                energy['totalFoodCost'] = 0
                energy['totalElectricityCost'] = 0

            return {
                "history":history,
                "success":True, 
                "userEnergy": energy,
                "totalStats": {"totalCo2": round(totalCo2,1), "totalRecycledCo2":round(totalRecycledCo2,1),  "totalCo2Reduced":round(totalCo2Reduced,1)} }, 200

    
    except Exception as e :
        print(e, sql )
        import traceback
        traceback.print_exc()
        return {
                "history":[],
                "totalStats": {
                    "totalCo2": 0,
                    "totalRecycledCo2":0,
                    "totalCo2Reduced":0
                    },
                "userEnergy":{
                    "totalTransportCost": 0,
                    "totalFoodCost":0,
                    "totalRecycleCost": 0,
                    "totalElectricityCost":0,
                    "totalUserEnergyCost": 0,
                    "totalUserSavings": 0, 
                    "totalUserEnergyRecycle":0
                    }, 
                "success":False
                }, 500
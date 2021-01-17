import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def getUserEnergy(connection, data):
    '''
    Get User Energy 
    '''
    appliedFilters = {
        'isTransport': True, 
        'isFood':True, 
        'isElectricity': True,
        'isRecycle': True
    }

    if 'userId' not in data:
        return {'message':'userId missing!', 'success': False}, 400

    print("/getEnergyHistory data:", data)
    try:
        if 'appliedFilters' in data:
            if str(data['appliedFilters']) != 'None':
                appliedFilters = data['appliedFilters']

        with connection.cursor() as cursor:
            sql = "CALL getUserEnergy({});".format(data['userId'])
            #print(sql)
            cursor.execute(sql)
            energy = cursor.fetchall()[0]


            if energy['totalTransportCost'] is None or appliedFilters['isTransport'] == False:
                energy['totalTransportCost'] = 0.0
            
            if energy['totalFoodCost'] is None or appliedFilters['isRecycle'] == False:
                energy['totalFoodCost'] = 0.0
            
            if energy['totalElectricityCost'] is None or appliedFilters['isElectricity'] == False:
                energy['totalElectricityCost'] = 0.0

            if energy['totalRecycleCost'] is None or appliedFilters['isFood'] == False:
                energy['totalRecycleCost'] = 0.0
                       
            
            energy['totalUserEnergyCost'] = round(energy['totalTransportCost'],1) + round(energy['totalFoodCost'],1) + round(energy['totalElectricityCost'],1)  #Total Garbage
            energy['totalUserEnergyRecycle'] = round(energy['totalRecycleCost'],1) # Total Non Garbage
            energy['totalUserSavings'] = round( 100 *(( energy['totalRecycleCost']) / energy['totalUserEnergyCost']),1) #Total Recycled /Total Garbage

            # Total others 
            energy['totalTransportCost'] = round(100 * ( energy['totalTransportCost'] / energy['totalUserEnergyCost']) ,1)
            energy['totalFoodCost'] = round(100 *( energy['totalFoodCost']/ energy['totalUserEnergyCost']) ,1)
            energy['totalElectricityCost'] = round(100 *( energy['totalElectricityCost']/ energy['totalUserEnergyCost']) ,1)
            energy['totalUserEnergyRecycle'] = 0

            print(energy)
            
            return {"userEnergy":energy, "success":True}, 200

    
    except Exception as e :
        print(e)
        import traceback
        traceback.print_exc()
        return {"userEnergy":{"totalTransportCost": 0, "totalFoodCost":0, "totalRecycleCost": 0, "totalElectricityCost":0, "totalUserEnergyCost": 0, "totalUserSavings": 0, "totalUserEnergyRecycle":0}, "success":False}, 500
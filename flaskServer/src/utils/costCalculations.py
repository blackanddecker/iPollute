import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify



def costCalculations(connection, userCost, userEnergyItemId, userEnergyType, userId):
    if userEnergyType == 0:
        sql = "CALL getFoodObjects({});".format(userId)
    elif userEnergyType == 1:
        sql = "CALL getTransportObjects({});".format(userId)
    elif userEnergyType == 2:
        sql = "CALL getRecycleObjects({});".format(userId)
    elif userEnergyType == 3:
        sql = "CALL getElectricityObjects({});".format(userId)
    
    with connection.cursor() as cursor:
        print(sql)
        cursor.execute(sql)
        items = cursor.fetchall()

    selectedItem = {"cost": 0 }
    for item in items:
        if item['id'] == userEnergyItemId: 
            selectedItem = item
            break

    return selectedItem['cost'] * userCost



def updateUserEnergy(connection, userId, energy):

    with connection.cursor() as cursor:
        sql = "call getUserDetails({});".format(userId)
        print(sql)
        cursor.execute(sql)
        user = cursor.fetchall()[0]

    energyFinal = user['energyCurrent'] + energy 

    with connection.cursor() as cursor:
        sql = "call updateUserEnergy({}, {});".format(userId, energyFinal)
        print(sql)
        cursor.execute(sql)
        connection.commit()

    return 


def findMessage(energy):
    
    if (energy % 5 == 0 ): 
        message = str(int(1.9 *energy) ) + " Kg of gasoline consumed"
    elif energy % 2 == 0 : 
        message = str(int(4 *energy) ) + " Km driven by an average passenger vehicle"
    else : 
        message = str(int(128 * energy) ) + " number of smartphones charged"

    return message
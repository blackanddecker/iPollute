import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def costTransportCalculations(transportCost, energyCost):
    return transportCost * energyCost

def costFoodCalculations(foodCost, energyCost):
    return foodCost * energyCost
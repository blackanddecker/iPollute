import pymysql.cursors
import flask
from flask import Flask , request ,make_response ,jsonify

def costTransportCalculations(connection, data):
    return 1


def costFoodCalculations(connection, data):
    return 2
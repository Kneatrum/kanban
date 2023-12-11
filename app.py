from flask import Flask, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import *

import sqlite3

# Configure application
app = Flask(__name__)

# Create a connection to the database
connection = sqlite3.connect('data.db')

# Create a cursor object to execute SQL commands
db = connection.cursor()

@app.route('/')
def index():
    return render_template('index.html')
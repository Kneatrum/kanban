from flask import Flask, redirect, render_template, request, session, url_for, jsonify
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


@app.route('/submited-form', methods=['POST'])
def submited():
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('Title')
        details = data.get('Details')
        button_info = data.get('buttonInfo')

        print("Title: ", title)
        print("Details: ", details)
        print("ButtonInfo: ", button_info)
        return jsonify({'message': 'Data was successfully received'}), 200
    else:
        return jsonify({'error': 'Invalid request'}), 400
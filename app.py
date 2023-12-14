from flask import Flask, redirect, render_template, request, session, url_for, jsonify
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import *

import sqlite3

# Configure application
app = Flask(__name__)



@app.route('/')
def index():
    to_do = retrieve_data('to_do')
    in_progress = retrieve_data('in_progress')
    done = retrieve_data('done')
    print ("To do", to_do)
    print ('In progress', in_progress)
    print ('Done tasks', done)

    return render_template('index.html')


@app.route('/submited-form', methods=['POST'])
def submited():
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('Title')
        body = data.get('Details')
        column = data.get('buttonInfo')
        result = createTableIfNotExists()
        print("Db created", result)

        print("Title: ", title)
        print("Details: ", body)
        print("ButtonInfo: ", column)

        create_task(title, body, column)
        
        return jsonify({'message': 'Data was successfully received'}), 200
    else:
        return jsonify({'error': 'Invalid request'}), 400
    

@app.route('/changes', methods=['POST'])
def changes():
    if request.method == 'POST':
        data = request.get_json()
        task_id = data.get('taskId')
        new_column = data.get('columnId')

        print('Task: ', task_id)
        print('Column: ', new_column)

        update_gui_changes(task_id, new_column)

        return jsonify({'message': 'Data was successfully received'}), 200
    else:
        return jsonify({'error': 'Message not received'}), 400
    

def createTableIfNotExists():

    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()

        cursor.execute(
            'CREATE TABLE IF NOT EXISTS tasks ( \
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
                column TEXT NOT NULL,\
                title TEXT NOT NULL,\
                body TEXT NOT NULL);'
                )
    
        connection.commit()
    
    

def create_task(title, body, column):

    if column not in ['to_do', 'in_progress', 'done']:
        print('Not found')
        return False

    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()

        try:
            cursor.execute('INSERT INTO tasks (title, body, column) VALUES (?, ?, ?);', (title, body, column))
            print('Success updating changes!')
            return True
        except sqlite3.Error as e:
            print("Error", e )
            return False



def update_gui_changes(task_id, new_column):

    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()

        try:
            cursor.execute('UPDATE tasks SET column = ? WHERE id = ?;', (new_column, task_id))
        except sqlite3.Error as e:
            print("Error", e)

def retrieve_data(column):
    def create_dict(data):
        if data is None:
            return None
        result = []
        columns = [column[0] for column in cursor.description]
        for row in data:
            row_dict = {columns[i]: row[i] for i in range(len(columns))}  
            result.append(row_dict)  

        return result

    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()

        try:
            cursor.execute('SELECT * FROM tasks WHERE column = ?;',(column,))
            rows = cursor.fetchall()
            column_data = create_dict(rows)
            return column_data
        except sqlite3.Error as e:
            print("Error", e)
            return False
        



        





      


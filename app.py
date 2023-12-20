from flask import Flask,  render_template, request, jsonify
import sqlite3
import re

# Configure application
app = Flask(__name__)


# The home page.
@app.route('/')
def index():
    to_do = retrieve_data('to_do')
    in_progress = retrieve_data('in_progress')
    done = retrieve_data('done')
    return render_template('index.html', to_do=to_do, in_progress=in_progress, done=done)


# Process request to create a new task.
@app.route('/submited-form', methods=['POST'])
def submited():
    if request.method == 'POST':
        data = request.get_json()
        title = data.get('Title')
        body = data.get('Details')
        column = data.get('buttonInfo')
        createTableIfNotExists()
        create_task(title, body, column)
        return jsonify({'message': 'Data was successfully received'}), 200
    else:
        return jsonify({'error': 'Invalid request'}), 400
    
# Processing the request to update the content of a task.
@app.route('/update_task', methods=['POST'])
def updated():
    if request.method == 'POST':
        data = request.get_json()
        task_id = data['task_id']
        task_title = data['task_title']
        task_description = data['task_description']
        task_status = data['task_status']
        update_task(task_id, task_title, task_description, task_status)
        return jsonify({'messaage': 'Data successfully received'})
    else:
        return jsonify({'messaage': 'Invalid request'})

    
# Recording the movement of tasks betweeen the 3 status' To do, In Progress, and Done.
@app.route('/changes', methods=['POST'])
def changes():
    if request.method == 'POST':
        data = request.get_json()
        task_id = data.get('taskId')
        new_column = data.get('columnId')
        update_gui_changes(task_id, new_column)
        return jsonify({'message': 'Data was successfully received'}), 200
    else:
        return jsonify({'error': 'Message not received'}), 400
    

# Process the request to delete a task.
@app.route('/delete', methods=['POST'])
def delete():
    if request.method == 'POST':
        data = request.get_json()
        task_id = data.get('task_id')
        delete_task(task_id)
        return jsonify({'message': 'Data was successfully deleted'}), 200
    else:
        return jsonify({'error': 'Message not received'}), 400


# Process the request to delete a task.
def delete_task(task_id):
    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()
        task_id = re.search(r'\d+', task_id).group() # Extracting the task id in form of a number.
        try:
            cursor.execute('DELETE FROM tasks WHERE id = ?;', (task_id,))
        except Exception as e:
            print('Error', e)
            return False

    

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
        return False

    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()
        try:
            cursor.execute('INSERT INTO tasks (title, body, column) VALUES (?, ?, ?);', (title, body, column))
            return True
        except sqlite3.Error as e:
            print("Error", e )
            return False


def update_task(task_id, title, description, status):

    if status not in ['to_do', 'in_progress', 'done']:
        return False
    
    task_id = re.search(r'\d+', task_id).group() # Extracting the task id in form of a number.
    
    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()

        try:
            cursor.execute('UPDATE tasks SET title =?, body = ?  WHERE id = ? AND column = ?;', (title, description, task_id, status))
            pass
        except sqlite3.Error as e:
            print("Error", e)
            return False    



def update_gui_changes(task_id, new_column):

    task_id = re.search(r'\d+', task_id).group() # Extracting the task id in form of a number.

    with sqlite3.connect('data.db') as connection:
        cursor = connection.cursor()
        try:
            cursor.execute('UPDATE tasks SET column = ? WHERE id = ?;', (new_column, task_id))
        except sqlite3.Error as e:
            print("Error", e)



def retrieve_data(column):
    # A function to format the data as a list of dictionaries.
    # This makes it easier to process in jinja.
    def create_list_of_dicts(data):
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
            column_data = create_list_of_dicts(rows)
            return column_data
        except sqlite3.Error as e:
            print("Error", e)
            return False
        



        





      


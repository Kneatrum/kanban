# Task Management Kanban Board.
#### Alternatively, you can watch the demo on [Youtube](https://youtu.be/S2bQ46OXk7A).
This is a task management platform that enables a user to record tasks and organize them into three categories. To do, In progress, and Done. 

# Basic Usage.
Below is a summary of the basic functionality of the task management kanban board.

#### Adding tasks.
- To add tasks, the user clicks on the Add task button.
A modal appears and allows the user to add the task title and description. Once done, the user should click on SAVE and the task is saved.

#### Editing tasks.
- To modify a task, the user needs to double-click on the specific task. Once the modal appears, the user can edit either the task title or description by clicking on the corresponding pencil icon. Once done, the user can click on SAVE and the task is saved.

#### Moving tasks.
- The interface enables users to move tasks between different categories by dragging and dropping them into the respective category.

#### Deleting tasks.
- To delete a task, the user should go to the top right of the task click on the three vertical dots, and select the Delete option.
- Before deleting a task, the user is prompted to confirm the action. The task is deleted upon the user's click on the "OK" button.

# Technical description.
This application's development is supported by Flask, a framework that facilitates the generation of dynamic content.

#### Front-end implementation.
The front end is implemented using HTML, CSS, and JavaScript with Bootstrap framework for structure and styling.
- The three layouts (To Do, In Progress, Done) are represented as cards inside divs via HTML and CSS.
- Jinja, a templating engine, dynamically generates the homepage. It processes the back-end data received from Python and embeds it into the HTML template using loops and conditional statements.
- Ajax is particularly used to send the user interface changes from the front end to the backend to update the database and also to update the user interface without having to refresh the whole homepage.
- JavaScript is used to implement drag and drop functionality and dialog box (Modal) functionality which allows the user to easily interact with the user interface.

#### Backend.
- Python operates as the backend engine, responsible for handling incoming user interface modifications through POST requests and effectively recording the changes in the database.
#### Database.
- The application relies on a lightweight SQLite3 database to store the user data.

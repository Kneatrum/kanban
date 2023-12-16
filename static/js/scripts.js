
document.addEventListener('DOMContentLoaded', () => {
    // Variables to hold the task that will be moved and the destination column.
    let taskId = null;
    let columnId = null;

    const columns = document.querySelectorAll('.column');
    let draggedItem = null;

    columns.forEach(column => {
        column.addEventListener('dragstart', event => {
            draggedItem = event.target.closest('.card');
            taskId = draggedItem.id;  // Obtaining the task id.
            if (!draggedItem) return;
            event.dataTransfer.setData('text/plain', null); // Required for Firefox
        });

        column.addEventListener('dragover', event => {
            event.preventDefault();
        });

        column.addEventListener('drop', event => {
            const dropTarget = event.target.closest('.column');
            columnId = dropTarget.id; // Obtaining the column id.
            if (!dropTarget) return;

            if (draggedItem) {
                const dropPosition = event.clientY;
                const tasks = Array.from(dropTarget.querySelectorAll('.card'));
                const closestTask = tasks.reduce((closest, task) => {
                    const rect = task.getBoundingClientRect();
                    const offset = dropPosition - rect.top - rect.height / 2;
                    if (offset < 0 && (!closest || offset > closest.offset)) {
                        return { task, offset };
                    }
                    return closest;
                }, null);

                if (closestTask) {
                    dropTarget.insertBefore(draggedItem, closestTask.task);
                } else {
                    dropTarget.appendChild(draggedItem);
                }

                // Here we send the task id and colun id to the changes route via POST method.
                $.ajax({ 
                    type: 'POST', 
                    url: '/changes', 
                    contentType: 'application/json', 
                    data: JSON.stringify({ 'taskId': taskId, 'columnId': columnId}), 
                    success: function(response) {  
                        console.log(response); 
                    }, 
                    error: function(error) { 
                        console.log(error); 
                    } 
                });
            }
        });
    });
});


$(document).ready(function(){

    $('#formModal').on('hidden.bs.modal', function (e) {
        // Clear input fields within the modal when it's hidden
        $(this).find('input[type=text], textarea').val('');
    });
    

    $('.add-task-button').click(function(){
        var buttonInfo = $(this).data('info');
        $('#formModal').modal('show');
        $('.modal-info').text(buttonInfo);
        $('#add-task-button').data('button-info', buttonInfo);
    });

    $('#formModal').on('submit', '#textInput', function(e){
        e.preventDefault(); // Prevent default form submission

        // Gather form data
        var formData = {
            Title: $('#Title').val(),
            Details: $('#Details').val(),
            buttonInfo: $('#add-task-button').data('button-info') // Adding button info directly to formData
        };

        // Send an AJAX POST request to app.py
        $.ajax({
            type: 'POST',
            url: '/submited-form',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            timeout: 3000, // In case the server takes too long to respond.
            success: function(response) {
                // Handle success response from the server
                console.log(formData);
                console.log('Data sent successfully!');
                console.log(response);
                location.reload();
                $('#formModal').modal('hide'); // Close the modal
                // Additional actions here
            },
            error: function(error) {
                // Handle error response from the server
                console.error('Error:', error);
                // Additional error handling here 
            }
        });
    });
});



// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
const tasks = document.querySelectorAll('.card');
tasks.forEach(task => {
    task.addEventListener('dblclick', event => {
        clickedItem = event.target.closest('.card');
        let taskId = clickedItem.id;  // Obtaining the task id.
        console.log("Clicked Task: ", taskId);
        modal.style.display = "block";
        if (!clickedItem) return;
        // event.dataTransfer.setData('text/plain', null); // Required for Firefox
    });
});


$(document).ready(function () {

    $('.edit-icon').on('click', function () {
        
    });

});




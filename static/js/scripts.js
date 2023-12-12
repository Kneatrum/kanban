
document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.column');
    let draggedItem = null;

    columns.forEach(column => {
        column.addEventListener('dragstart', event => {
            draggedItem = event.target.closest('.card');
            if (!draggedItem) return;
            event.dataTransfer.setData('text/plain', null); // Required for Firefox
        });

        column.addEventListener('dragover', event => {
            event.preventDefault();
        });

        column.addEventListener('drop', event => {
            const dropTarget = event.target.closest('.column');
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
        e.preventDefault(); // Prevents default form submission

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
            success: function(response) {
                // Handle success response from the server
                console.log(formData);
                console.log('Data sent successfully!');
                console.log(response);
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






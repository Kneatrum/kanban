
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


const titleEditableField = document.querySelector('.title-editable-field');
const normalTitleText = titleEditableField.querySelector('.title-normal-text');
const editTitleText = titleEditableField.querySelector('.title-edit-text');

const detailsEditableField = document.querySelector('.details-editable-field');
const normalDetailText = detailsEditableField.querySelector('.details-normal-text');
const editDetailsText = detailsEditableField.querySelector('.details-edit-text');


let TaskTitle =null;
let TaskDescription =null;

// Get the button that opens the modal
const tasks = document.querySelectorAll('.card');
tasks.forEach(task => {
    task.addEventListener('dblclick', event => {
        clickedItem = event.target.closest('.card');
        let taskId = clickedItem.id;  // Obtaining the task id.
        TaskTitle = clickedItem.querySelector('h3').textContent;
        TaskDescription = clickedItem.querySelector('p').textContent;
        console.log("Clicked Task: ", taskId);
        normalTitleText.textContent = TaskTitle;
        normalTitleText.style.display = "block";
        editTitleText.textContent = "none";

        normalDetailText.textContent = TaskDescription;
        normalDetailText.style.display = "block";
        editDetailsText.textContent = "none";

        $('#myModal').modal('show');
        if (!clickedItem) return;
        // event.dataTransfer.setData('text/plain', null); // Required for Firefox
    });
});


$(document).ready(function () {

    $('#myModal').on('hidden.bs.modal', function (e) {
        // Reset elements to their default state when modal is hidden
        $('.title-normal-text, .title-edit-text, .title-edit-icon, .save-btn, .cancel-btn').removeAttr('style');
        $('.details-normal-text, .details-edit-text, .details-edit-icon, .save-btn, .cancel-btn').removeAttr('style');
        // Clear input fields within the modal when it's hidden
        $(this).find('input[type=text], textarea').val('');
    });

    // Hide the edit text fields initially when the modal is opened
    $('#myModal').on('shown.bs.modal', function (e) {
        $('.title-edit-text, .details-edit-text').hide();
    });

    $('.title-edit-icon').on('click', function () {
        console.log("Edit icon clicked");
        // Toggle visibility of paragraph and input elements
        $('.title-normal-text').toggle();
        $('.title-edit-text').toggle();
        $('.title-edit-icon').toggle();

        // Toggle visibility of the save button only if it is not visible.
        if ($('.save-btn').css('display') === 'none') {
            $('.save-btn').toggle();
        }

        // Toggle visibility of the cancel button only if it is not visible.
        if ($('.cancel-btn').css('display') === 'none') {
            $('.cancel-btn').toggle();
        }


        // Transfer text from paragraph to input when switching to edit mode
        if ($('.title-normal-text').css('display') === 'none') {
            var titleText = $('.title-normal-text').text().trim();
            $('.title-edit-text').val(titleText);
        }
    });


    $('.details-edit-icon').on('click', function () {
        console.log("Edit icon clicked");
        // Toggle visibility of paragraph and input elements
        $('.details-normal-text').toggle();
        $('.details-edit-text').toggle();
        $('.details-edit-icon').toggle();

        // Toggle visibility of the save button only if it is not visible.
        if ($('.save-btn').css('display') === 'none') {
            $('.save-btn').toggle();
        }

        // Toggle visibility of the cancel button only if it is not visible.
        if ($('.cancel-btn').css('display') === 'none') {
            $('.cancel-btn').toggle();
        }
        
        // Transfer text from paragraph to input when switching to edit mode
        if ($('.details-normal-text').css('display') === 'none') {
            var descriptionText = $('.details-normal-text').text().trim();
            $('.details-edit-text').val(descriptionText);
        }
    });


    
    $('.save-btn').on('click', function () {
        // Actions when the user clicks the submit button.
    });

    $('.cancel-btn').on('click', function () {
        $('#myModal').modal('hide');
        console.log('Cancel button clicked');
    });


});




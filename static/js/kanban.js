var dragged; // Variable to store the dragged element

// Function to allow dropping
function allowDrop(ev) {
    ev.preventDefault();
}

// Function to handle drag start
function drag(ev) {
    dragged = ev.target; // Store the dragged element
}

// Function to handle drop
function drop(ev) {
    ev.preventDefault();

    // Check if the drop target is outside the columns or above an 'h2' element
    if (
        !ev.target.classList.contains('column') ||  // Prevent dropping outside columns
        ev.target.tagName.toLowerCase() === 'h2'   // Prevent dropping above 'h2' elements
    ) {
        return; // Exit the function, preventing the drop
    }

    var dropTarget = ev.target;
    var dropPosition = -1; // Initialize drop position as before the first child

    // Determine the drop position
    var rect = dropTarget.getBoundingClientRect();
    if (ev.clientY > rect.top + rect.height / 2) {
        dropPosition = 1; // Insert after the drop target if below the mid-point
    }

    // Insert the dragged element at the correct position within the column
    if (dropPosition === 1) {
        dropTarget.appendChild(dragged);
    } else {
        var tasks = dropTarget.getElementsByClassName('card');
        var taskDropped = false;

        for (var i = 0; i < tasks.length; i++) {
            var taskRect = tasks[i].getBoundingClientRect();
            if (ev.clientY < taskRect.top) {
                dropTarget.insertBefore(dragged, tasks[i]);
                taskDropped = true;
                break;
            }
        }

        if (!taskDropped) {
            dropTarget.appendChild(dragged);
        }
    }
}




// Event listener for drag start
document.addEventListener('dragstart', drag);

// Event listener for drag over
document.addEventListener('dragover', allowDrop);

// Event listener for drop
document.addEventListener('drop', drop);



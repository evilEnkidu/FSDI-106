var myTasks = [];

function saveTask() {
    console.log("Task Manager...");
    
    const title = $("#txtTitle").val();
    const description = $("#txtDescription").val();
    const color = $("#txtColor").val();
    const date = $("#txtDate").val();
    const status = $("#selStatus").val();
    const budget = $("#numBudget").val();
    console.log(title, description, color, date, status, budget);
    
    let taskSave = new Task(title, description, color, date, status, budget);
    console.log(taskSave);

    // Save to server
    $.ajax({
        type: "post",
        url: "http://fsdiapi.azurewebsites.net/api/tasks/",
        data: JSON.stringify(taskSave),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            myTasks.push(taskSave);
            localStorage.setItem("tasks", JSON.stringify(myTasks));
            displayTask(taskSave);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function displayTask(task) {
    let syntax = `
    <div class="task" id="${task.title}" style="border-left: 5px solid ${task.color}; padding-left: 10px; margin-top:20px;">
        <div class="info">
            <h5>${task.title}</h5>
            <p>${task.description}</p>
        </div>
        <label class="status">${task.status}</label>
        <div class="date-budget">
            <label>${task.date}</label>
            <label>$${task.budget}</label>
        </div>
        <div>
            <p class="delete-btn" data-title="${task.title}" style="cursor:pointer; color: grey;">Delete</p>
        </div>
    </div>
    `;
    $("#list").append(syntax);

    // Attach delete event
    $(`#${task.title} .delete-btn`).click(function() {
        deleteTask(task.title);
    });
}

function deleteTask(title) {
    // Remove task from array
    myTasks = myTasks.filter(task => task.title !== title);

    // Update local storage
    localStorage.setItem("tasks", JSON.stringify(myTasks));

    // Remove from DOM
    $(`#${title}`).remove();
}

function loadTasks() {
    let storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        myTasks = JSON.parse(storedTasks);
        myTasks.forEach(task => displayTask(task));
    }
}

function init() {
    $("#btnSave").click(saveTask);
    loadTasks();
}
window.onload = init;

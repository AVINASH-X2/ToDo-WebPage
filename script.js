// Load tasks from local storage when the page loads
window.addEventListener('load', function () {
    // this.localStorage.removeItem('Previously');
    var savedTasksToday = localStorage.getItem('tasksToday');
    if (savedTasksToday) {
        document.getElementById('sentenceListToday').innerHTML = savedTasksToday;
    }

    var savedTasksTomorrow = localStorage.getItem('tasksTomorrow');
    if (savedTasksTomorrow) {
        document.getElementById('sentenceListTomorrow').innerHTML = savedTasksTomorrow;
    }

    var savedTasksPreviously = localStorage.getItem('Previously');
    if (savedTasksPreviously) {
        document.getElementById('sentenceListPreviously').innerHTML = savedTasksPreviously;
    }

    // Remove existing clear buttons before adding new ones
    document.querySelectorAll('.sentence-container button').forEach(button => button.remove());

    // Add clear buttons to loaded tasks


    // Check if 24 hours have passed since the tasks were saved
    var lastSaveTime = localStorage.getItem('lastSaveTime');
    if (lastSaveTime && Date.now() - parseInt(lastSaveTime) >= 24 * 60 * 60 * 1000) {
        moveTasksToPreviously();
    } else {
        // Set a timer for the remaining time until 24 hours
        setTimeout(moveTasksToPreviously, 24 * 60 * 60 * 1000 - (Date.now() - parseInt(lastSaveTime)));
    }

    addClearButtons('sentenceListToday', 'today');
    addClearButtons('sentenceListTomorrow', 'tomorrow');
});

document.getElementById("todaylink").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior of link click
    document.getElementById("details").style.display = "none";
    document.getElementById("today").style.display = "block";
    document.getElementById("tomorrow").style.display = "none";
    document.getElementById("previously").style.display = "none";
    document.getElementById("clearAll").style.display = "inline-block"; // Show the Clear All button
});

document.getElementById("tomorrowlink").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior of link click
    document.getElementById("details").style.display = "none";
    document.getElementById("today").style.display = "none";
    document.getElementById("tomorrow").style.display = "block";
    document.getElementById("previously").style.display = "none";
    document.getElementById("clearAll").style.display = "inline-block"; // Show the Clear All button
});

document.getElementById("yesterday").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior of link click
    document.getElementById("details").style.display = "none";
    document.getElementById("today").style.display = "none";
    document.getElementById("tomorrow").style.display = "none";
    document.getElementById("previously").style.display = "block";
    document.getElementById("clearAll").style.display = "none"; // Hide the Clear All button
});


function moveTasksToPreviously() {
    var todayTasks = localStorage.getItem('tasksToday');
    if (todayTasks) {
        var currentDate = new Date().toLocaleDateString();
        var previouslyTasks = localStorage.getItem('Previously');
        if (previouslyTasks) {
            previouslyTasks += `<h3>${currentDate}</h3>` + todayTasks;
        } else {
            previouslyTasks = `<h3>${currentDate}</h3>` + todayTasks;
        }
        localStorage.setItem('Previously', previouslyTasks);
        localStorage.removeItem('tasksToday');
        localStorage.removeItem('lastSaveTime'); // Remove last save time
        document.getElementById('sentenceListToday').innerHTML = "";
        document.getElementById('sentenceListPreviously').innerHTML = previouslyTasks; // Show previously tasks on page
    }
}

// Function to clear all tasks and local storage
function clearAllTasks() {
    // Clear tasks from the webpage
    document.getElementById('sentenceListToday').innerHTML = "";
    document.getElementById('sentenceListTomorrow').innerHTML = "";

    // Move today's tasks to previously if any
    moveTasksToPreviously();

    // Clear tasks from local storage
    localStorage.removeItem('tasksTomorrow');
}

document.getElementById("addSentenceToday").addEventListener("click", function () {
    var sentence = document.getElementById("taskInputToday").value.trim();
    if (sentence !== "") {
        var sentenceNode = document.createElement("p"); // Create a paragraph element
        sentenceNode.textContent = sentence; // Set the text content of the paragraph
        var sentenceContainer = document.createElement("div"); // Create a div to contain the sentence and clear button
        sentenceContainer.classList.add("sentence-container"); // Add class for styling
        sentenceContainer.appendChild(sentenceNode); // Append the paragraph element to the container
        addClearButton(sentenceContainer, 'today'); // Add the clear button
        var sentenceListToday = document.getElementById("sentenceListToday");
        sentenceListToday.appendChild(sentenceContainer); // Append the container to the sentence list

        // Save tasks for today to local storage
        var tasksToday = localStorage.getItem('tasksToday');
        if (tasksToday) {
            tasksToday += sentenceContainer.outerHTML; // Save the entire HTML of the container
        } else {
            tasksToday = sentenceContainer.outerHTML;
        }
        localStorage.setItem('tasksToday', tasksToday);
    }
});


document.getElementById("addSentenceTomorrow").addEventListener("click", function () {
    var sentence = document.getElementById("taskInputTomorrow").value.trim();
    if (sentence !== "") {
        var sentenceNode = document.createElement("p"); // Create a paragraph element
        sentenceNode.textContent = sentence; // Set the text content of the paragraph
        var sentenceContainer = document.createElement("div"); // Create a div to contain the sentence and clear button
        sentenceContainer.classList.add("sentence-container"); // Add class for styling
        sentenceContainer.appendChild(sentenceNode); // Append the paragraph element to the container
        var sentenceListTomorrow = document.getElementById("sentenceListTomorrow");
        sentenceListTomorrow.appendChild(sentenceContainer); // Append the container to the sentence list

        // Save task for tomorrow to local storage
        var tasksTomorrow = localStorage.getItem('tasksTomorrow');
        if (tasksTomorrow) {
            tasksTomorrow += sentenceContainer.outerHTML;
        } else {
            tasksTomorrow = sentenceContainer.outerHTML;
        }
        localStorage.setItem('tasksTomorrow', tasksTomorrow);

        // Add clear button only when a new sentence is added
        addClearButton(sentenceContainer, 'tomorrow');
    }
});


// Function to add clear button to sentence container
function addClearButton(sentenceContainer, containerId) {
    var clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.addEventListener("click", function () {
        sentenceContainer.parentNode.removeChild(sentenceContainer); // Remove the sentence element
        // Save updated tasks to local storage
        if (containerId === "today") {
            localStorage.setItem('tasksToday', document.getElementById("sentenceListToday").innerHTML);
        } else {
            localStorage.setItem('tasksTomorrow', document.getElementById("sentenceListTomorrow").innerHTML);
        }
    });
    sentenceContainer.appendChild(clearButton); // Append the clear button
}

// Function to add clear buttons to loaded tasks
function addClearButtons(containerId, containerType) {
    var sentenceContainers = document.getElementById(containerId).getElementsByClassName("sentence-container");
    for (var i = 0; i < sentenceContainers.length; i++) {
        addClearButton(sentenceContainers[i], containerType);
    }
}

// Function to add clear buttons to loaded tasks
function addClearButtons(containerId, containerType) {
    var sentenceContainers = document.getElementById(containerId).getElementsByClassName("sentence-container");
    for (var i = 0; i < sentenceContainers.length; i++) {
        addClearButton(sentenceContainers[i], containerType);
    }
}

// Add event listener for the clear all button
document.getElementById("clearAll").addEventListener("click", clearAllTasks);
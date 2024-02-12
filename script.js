// Load tasks from local storage when the page loads
window.addEventListener('load', function () {
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

    document.querySelectorAll('.sentence-container button').forEach(button => button.remove());

    var lastSaveTime = localStorage.getItem('lastSaveTime');
    if (lastSaveTime && Date.now() - parseInt(lastSaveTime) >= 24 * 60 * 60 * 1000) {
        moveTasksToPreviously();
    } else {
        setTimeout(moveTasksToPreviously, 24 * 60 * 60 * 1000 - (Date.now() - parseInt(lastSaveTime)));
    }

    addClearButtons('sentenceListToday', 'today');
    addClearButtons('sentenceListTomorrow', 'tomorrow');
});

document.getElementById("todaylink").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("details").style.display = "none";
    document.getElementById("today").style.display = "block";
    document.getElementById("tomorrow").style.display = "none";
    document.getElementById("previously").style.display = "none";
    document.getElementById("clearAll").style.display = "inline-block"; 
});

document.getElementById("tomorrowlink").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("details").style.display = "none";
    document.getElementById("today").style.display = "none";
    document.getElementById("tomorrow").style.display = "block";
    document.getElementById("previously").style.display = "none";
    document.getElementById("clearAll").style.display = "inline-block";
});

document.getElementById("yesterday").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("details").style.display = "none";
    document.getElementById("today").style.display = "none";
    document.getElementById("tomorrow").style.display = "none";
    document.getElementById("previously").style.display = "block";
    document.getElementById("clearAll").style.display = "none";
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
        localStorage.removeItem('lastSaveTime');
        document.getElementById('sentenceListToday').innerHTML = "";
        document.getElementById('sentenceListPreviously').innerHTML = previouslyTasks;
    }
}

// Function to clear all tasks and local storage
function clearAllTasks() {
    document.getElementById('sentenceListToday').innerHTML = "";
    document.getElementById('sentenceListTomorrow').innerHTML = "";

    moveTasksToPreviously();
    localStorage.removeItem('tasksTomorrow');
}

document.getElementById("addSentenceToday").addEventListener("click", function () {
    var sentence = document.getElementById("taskInputToday").value.trim();
    if (sentence !== "") {
        var sentenceNode = document.createElement("p");
        sentenceNode.textContent = sentence;
        var sentenceContainer = document.createElement("div");
        sentenceContainer.classList.add("sentence-container");
        sentenceContainer.appendChild(sentenceNode);
        addClearButton(sentenceContainer, 'today');
        var sentenceListToday = document.getElementById("sentenceListToday");
        sentenceListToday.appendChild(sentenceContainer);

        var tasksToday = localStorage.getItem('tasksToday');
        if (tasksToday) {
            tasksToday += sentenceContainer.outerHTML;
        } else {
            tasksToday = sentenceContainer.outerHTML;
        }
        localStorage.setItem('tasksToday', tasksToday);
    }
});


document.getElementById("addSentenceTomorrow").addEventListener("click", function () {
    var sentence = document.getElementById("taskInputTomorrow").value.trim();
    if (sentence !== "") {
        var sentenceNode = document.createElement("p");
        sentenceNode.textContent = sentence;
        var sentenceContainer = document.createElement("div");
        sentenceContainer.classList.add("sentence-container"); 
        sentenceContainer.appendChild(sentenceNode);
        var sentenceListTomorrow = document.getElementById("sentenceListTomorrow");
        sentenceListTomorrow.appendChild(sentenceContainer);

        var tasksTomorrow = localStorage.getItem('tasksTomorrow');
        if (tasksTomorrow) {
            tasksTomorrow += sentenceContainer.outerHTML;
        } else {
            tasksTomorrow = sentenceContainer.outerHTML;
        }
        localStorage.setItem('tasksTomorrow', tasksTomorrow);

        addClearButton(sentenceContainer, 'tomorrow');
    }
});


// Function to add clear button to sentence container
function addClearButton(sentenceContainer, containerId) {
    var clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.addEventListener("click", function () {
        sentenceContainer.parentNode.removeChild(sentenceContainer);
        if (containerId === "today") {
            localStorage.setItem('tasksToday', document.getElementById("sentenceListToday").innerHTML);
        } else {
            localStorage.setItem('tasksTomorrow', document.getElementById("sentenceListTomorrow").innerHTML);
        }
    });
    sentenceContainer.appendChild(clearButton);
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

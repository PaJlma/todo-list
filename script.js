const taskCases = document.getElementsByClassName('task');
const saveChangesButton = document.querySelector('#save-changes');
const clearTasksButton = document.querySelector('#clear-all-tasks');
const addTaskButton = document.querySelector('#add-task');
const changeStatusButton = document.querySelector('#change-status');
const deleteTaskButtons = document.getElementsByClassName('task__delete');
let activeTask = null;

class Task {
    constructor (title) {
        if (title === undefined) {
            title = prompt('Введите имя задачи:')
        } 
        this.title = title;
        const id = title;
        const element = generateTaskDOM(title, id);
        element.addEventListener('click', eventClickOnTask);
        element.querySelector('.task__delete').addEventListener('click', eventDeleteTask);
        this.element = element.innerHTML;
    };

    static create() {
        const newObject = new this();
        const inner = newObject.element;
        const id = inner.slice(inner.indexOf('title">')+7, inner.indexOf('</h4>'))
        appendIntoLocalStorage(id, newObject);
        return newObject;
    }   

    static remove(id) {
        if (localStorage.getItem(id)) {
            const elementToRemove = document.getElementById(id);
            localStorage.removeItem(id);
            elementToRemove.remove();
        } else {
            console.log('No task to remove')
        }
    }

    status = false;
    text = '';
};

function readLocalStorage(id) {
    return JSON.parse(localStorage.getItem(id));
}

function appendIntoLocalStorage(id, object) {
    localStorage.setItem(id, JSON.stringify(object));
}

function getTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const timeArray = [day, month, year, hours, minutes];
    const newTimeArray = [];
    for (let time of timeArray) {
        if (time < 10) {
            newTimeArray.push(`0${time}`);
        } else {
            newTimeArray.push(time);
        };
    }
    return `${newTimeArray[0]}.${newTimeArray[1]}.${newTimeArray[2]} ${newTimeArray[3]}:${newTimeArray[4]}`;
}

function generateTaskDOM(title, id) {
    if (localStorage.getItem(id)) {
        alert(`Error! Task "${id}" is already exists!`);
        return 0;
    }

    if (title !== '' && title !== null && title.length <= 50) {
        const time = getTime()
        const sidebar = document.querySelector('.sidebar');
        const headerTaskName = document.querySelector('.header__task-title');
        const task = document.createElement('div');
        const textarea = document.querySelector('textarea');
        task.className = 'sidebar__task task';
        task.id = id;
        task.innerHTML = `
            <div class="task__main-info">
                <h4 class="task__title">${title}</h4>
                <p class="task__time">${time}</p>
            </div>
            <div class="task__info">
                <p class="task__text"></p>
                <div class="task__status"></div>
            </div>
            <button class="task__delete"></button>
        `;
        sidebar.append(task);
        activeTask = id;
        textarea.value = '';
        headerTaskName.innerText = id;
        return task;
    } else {
        alert('Task name is empty, or its bigger then 50 symbols');
    };
};
 
function eventClickOnTask(event) {
    const headerTaskName = document.querySelector('.header__task-title');
    const textArea = document.querySelector('textarea');
    const taskID = event.currentTarget.id;
    activeTask = taskID;
    const taskObject = readLocalStorage(taskID);
    textArea.value = taskObject.text//.replace('\n', ' ');
    headerTaskName.innerText = taskObject.title.slice(0, 20);
}

function eventClickOnSaveChanges() {
    if (activeTask === null) {
        alert("No task to change");
    } else {
        const textArea = document.querySelector('textarea');
        const taskDescription = document.getElementById(activeTask).querySelector('.task__text');

        const activeTaskObject = readLocalStorage(activeTask);
        let changes = textArea.value;
        if (activeTaskObject.text === textArea.value) {
            alert('Nothing to save')
        } else {
            activeTaskObject.text = changes;
            taskDescription.innerText = changes.slice(0, 150) + '...';
            appendIntoLocalStorage(activeTask, activeTaskObject);
            alert('Changes have been saved!')
        }
    }
}

function loadOldTasks() {
    const sidebar = document.querySelector('.sidebar');
    for (let task of Object.keys(localStorage)) {
        const oldTask = document.createElement('div');
        const taskObject = readLocalStorage(task);
        const inner = taskObject.element;
        oldTask.className = 'sidebar__task task';
        oldTask.id = inner.slice(inner.indexOf('title">')+7, inner.indexOf('</h4>'));
        oldTask.innerHTML = inner;
        if (taskObject.status === true) {
            oldTask.querySelector('.task__status').style.backgroundColor = 'green';
        } else {
            oldTask.querySelector('.task__status').style.backgroundColor = 'red';
        }

        oldTask.querySelector('.task__text').innerText = taskObject.text.slice(0, 150) + '...';
        sidebar.append(oldTask);
    }
}

function eventClearAllTasks() {
    if (confirm('Delete all the tasks?')) {
        const taskCases = document.querySelectorAll('.task');
        const textArea = document.querySelector('textarea');
        const headerTaskName = document.querySelector('.header__task-title');
        for (let taskCase of taskCases) {
            taskCase.remove()
        }
        activeTask = null;
        textArea.value = '';
        headerTaskName.innerText = '';
        localStorage.clear()
    } else {
        return 0
    }
}

function eventChangeTaskStatus() {
    const taskObject = readLocalStorage(activeTask);
    const taskStatusCircle = document.getElementById(activeTask).querySelector('.task__status');
    if (taskObject.status === false) {
        taskObject.status = true;
        taskStatusCircle.style.backgroundColor = 'green';
    } else {
        taskObject.status = false;
        taskStatusCircle.style.backgroundColor = 'red';
    }
    appendIntoLocalStorage(activeTask, taskObject);
};

function eventDeleteTask(event) {
    if (confirm('Delete this task?')) {
        const taskToDelete = event.currentTarget.parentNode;
        const taskID = taskToDelete.id;
        localStorage.removeItem(taskID);
        taskToDelete.remove();
        if (activeTask === taskID) {
            const textArea = document.querySelector('textarea');
            const headerTaskName = document.querySelector('.header__task-title');
            textArea.value = '';
            headerTaskName.innerText = '';
            activeTask = null;
        }
    } else {
        return 0
    }
}

loadOldTasks(); 
for (let taskCase of taskCases) {
    taskCase.addEventListener('click', eventClickOnTask);
};

for (let deleteTaskButton of deleteTaskButtons) {
    deleteTaskButton.addEventListener('click', eventDeleteTask);
}

changeStatusButton.addEventListener('click', eventChangeTaskStatus);
clearTasksButton.addEventListener('click', eventClearAllTasks);
saveChangesButton.addEventListener('click', eventClickOnSaveChanges);
addTaskButton.addEventListener('click', Task.create.bind(Task));

console.log(localStorage);
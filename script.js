const addTaskButton = document.querySelector('.header__add-task-button');
const taskCases = document.getElementsByClassName('task');
const saveChangesButton = document.querySelector('.textarea-place__textarea-save-changes');
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
        this.element = element.innerHTML;
    };

    static create() {
        const newObject = new this();
        const inner = newObject.element;
        const id = inner.slice(inner.indexOf('title">')+7, inner.indexOf('</h4>'))
        localStorage.setItem(id, JSON.stringify(newObject));
        return newObject;
    }   

    static remove(object) {
        if (object instanceof Task) {
            
        } else {
            throw new Error(`${object} is not instance of ${this}`)
        }
    }

    text = '';
};

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
    for (let key of Object.keys(localStorage)) {
        if (key === id) {
            alert(`Error! Task "${id}" is already exists!`);
            return 0;
        }
    }

    if (title !== '' && title !== null) {
        const time = getTime()
        const sidebar = document.querySelector('.sidebar');
        const task = document.createElement('div');
        task.className = 'sidebar__task task';
        task.id = id;
        task.innerHTML = `
            <div class="task__main-info">
                <h4 class="task__title">${title}</h4>
                <p class="task__time">${time}</p>
            </div>
            <p class="task__text"></p>
        `;
        sidebar.append(task);
        return task;
    } else {
        alert('Task name is empty');
    };
};

function eventClickOnTask(event) {
    const headerTaskName = document.querySelector('.header__task-title');
    const textArea = document.querySelector('textarea');
    const taskID = event.currentTarget.id;
    activeTask = taskID;
    const taskObject = JSON.parse(localStorage.getItem(taskID));
    textArea.innerText = taskObject.text.replaceAll('\n', ' ');
    headerTaskName.innerText = taskObject.title;
}

function eventClickOnSaveChanges() {
    if (activeTask === null) {
        alert("No task to change");
    } else {
        const textArea = document.querySelector('textarea');
        const activeTaskObject = JSON.parse(localStorage.getItem(activeTask));
        let changes = textArea.value;
        activeTaskObject.text = changes;
        localStorage.removeItem(activeTask);
        localStorage.setItem(activeTask, JSON.stringify(activeTaskObject));
    }
}

function loadOldTasks() {
    const sidebar = document.querySelector('.sidebar');
    for (let task of Object.keys(localStorage)) {
        const inner = JSON.parse(localStorage.getItem(task)).element;
        const oldTask = document.createElement('div');
        oldTask.className = 'sidebar__task task';
        oldTask.id = inner.slice(inner.indexOf('title">')+7, inner.indexOf('</h4>'));
        oldTask.innerHTML = inner;
        sidebar.append(oldTask);
    }
}

// localStorage.clear()

loadOldTasks(); 
for (let value of taskCases) {
    value.addEventListener('click', eventClickOnTask);
}

saveChangesButton.addEventListener('click', eventClickOnSaveChanges);
addTaskButton.addEventListener('click', Task.create.bind(Task))

console.log(localStorage)
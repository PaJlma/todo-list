const addTaskButton = document.querySelector('.header__add-task-button');
const taskCases = document.getElementsByClassName('task');
const textArea = document.querySelector('textarea');

class Task {
    constructor (title) {
        if (title === undefined) {
            title = prompt('Введите имя задачи:')
        } 
        this.title = title;
        const id = title;
        this.element = generateTaskDOM(title, id)
    };

    static create() {
        const newObject = new this();
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
        localStorage.setItem(id, task.innerHTML);
        return task;
    } else {
        alert('Task name is empty');
    };
};

function eventClickOnTask(event) {
    console.log(event.currentTarget.id)
}

function loadOldTasks() {
    const sidebar = document.querySelector('.sidebar');
    for (let index = 1; index <= localStorage.length; index++) {
        const inner = localStorage.getItem(index);
        const task = document.createElement('div');
        task.className = 'sidebar__task task';
        task.id = inner.slice(inner.indexOf('title">')+7, inner.indexOf('</h4>'));
        task.innerHTML = inner;
        sidebar.append(task);
    }
}

localStorage.clear()

loadOldTasks(); 
for (let value of taskCases) {
    value.addEventListener('click', eventClickOnTask);
}

addTaskButton.addEventListener('click', Task.create.bind(Task))

console.log(localStorage)

const task = new Task('Абубачир');
task.text = 'Абубачир';
textArea.innerText = task.text;
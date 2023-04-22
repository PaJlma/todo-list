const addTaskButton = document.querySelector('.header__add-task-button')

class Task {
    constructor () {
        generateTaskDOM()
    };
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

function generateTaskDOM(title = prompt('Введите имя задачи:')) {
    if (title !== '') {
        const time = getTime()
        const sidebar = document.querySelector('.sidebar');
        const task = document.createElement('div');
        task.className = 'sidebar__task task';
        // task.id = id;
        task.innerHTML = `
            <div class="task__main-info">
                <h4 class="task__title">${title}</h4>
                <p class="task__time">${time}</p>
            </div>
            <p class="task__text"></p>
        `;
        sidebar.append(task);
    } else {
        alert('Name is Null');
    };
};

new Task()
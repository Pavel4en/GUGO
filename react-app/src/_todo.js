window.addEventListener('load', () => {
    const form = document.querySelector('#new_task-form');
    const input = document.querySelector('#new_task-input_name');
    const list_el = document.querySelector('#tasks');
cd 
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;

        if (!task) {
            alert('wtf');
            return;
        }

        const task_el = document.createElement("div");
        task_el.classList.add('tasks');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');
        task_content_el.innerText = task;

        task_el.appendChild(task_content_el);

        list_el.appendChild(task_el);
    })
})

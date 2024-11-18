document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskModal = document.getElementById("task-modal");
    const cancelTaskBtn = document.getElementById("cancel-task-btn");
    const taskForm = document.getElementById("task-form");
    const searchInput = document.getElementById("search-input");
    const filterSelect = document.getElementById("filter-select");
    const kanbanColumns = document.querySelectorAll(".kanban-column .tasks");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let editingTaskId = null;

    function saveTasksToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener("click", () => {
        taskModal.classList.remove("hide");
        editingTaskId = null;
        taskForm.reset();
    });

    cancelTaskBtn.addEventListener("click", () => {
        taskModal.classList.add("hide");
        taskForm.reset();
    });

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const desc = document.getElementById("task-desc").value;
        const priority = document.getElementById("task-priority").value;
        const dueDate = document.getElementById("task-due-date").value;

        const currentDate = new Date().setHours(0, 0, 0, 0);
        const selectedDate = new Date(dueDate).setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            alert("A data de vencimento não pode ser anterior ao dia atual.");
            return;
        }

        if (editingTaskId) {
            const task = tasks.find((t) => t.id === editingTaskId);
            task.title = title;
            task.desc = desc;
            task.priority = priority;
            task.dueDate = dueDate;
        } else {
            const task = {
                id: Date.now(),
                title,
                desc,
                priority,
                dueDate,
                status: "Coluna1",
            };
            tasks.push(task);
        }

        saveTasksToLocalStorage();
        renderTasks();
        taskModal.classList.add("hide");
        taskForm.reset();
    });

    searchInput.addEventListener("input", () => {
        const searchText = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter((task) =>
            task.title.toLowerCase().includes(searchText)
        );
        renderTasks(filteredTasks);
    });

    filterSelect.addEventListener("change", () => {
        const selectedPriority = filterSelect.value;

        if (selectedPriority === "all") {
            renderTasks(tasks);
        } else {
            const filteredTasks = tasks.filter(
                (task) => task.priority === selectedPriority
            );
            renderTasks(filteredTasks);
        }
    });

    function renderTasks(filteredTasks = tasks) {
        kanbanColumns.forEach((column) => (column.innerHTML = ""));

        filteredTasks.forEach((task) => {
            const taskEl = document.createElement("div");
            taskEl.classList.add("task", task.priority);
            taskEl.setAttribute("draggable", "true");
            taskEl.setAttribute("data-id", task.id);
            taskEl.innerHTML = `
                <h4>${task.title}</h4>
                <p>${task.desc}</p>
                <p><strong>Vencimento:</strong> ${task.dueDate}</p>
                <div class="task-buttons">
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Excluir</button>
                </div>
            `;

            const column = document.querySelector(
                `.kanban-column[data-status="${task.status}"] .tasks`
            );
            column.appendChild(taskEl);

            const editBtn = taskEl.querySelector(".edit-btn");
            const deleteBtn = taskEl.querySelector(".delete-btn");

            editBtn.addEventListener("click", () => {
                editingTaskId = task.id;
                document.getElementById("task-title").value = task.title;
                document.getElementById("task-desc").value = task.desc;
                document.getElementById("task-priority").value = task.priority;
                document.getElementById("task-due-date").value = task.dueDate;
                taskModal.classList.remove("hide");
            });

            deleteBtn.addEventListener("click", () => {
                tasks = tasks.filter((t) => t.id !== task.id);
                saveTasksToLocalStorage();
                renderTasks();
            });

            taskEl.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", task.id);
            });
        });

        kanbanColumns.forEach((column) => {
            column.addEventListener("dragover", (e) => e.preventDefault());
            column.addEventListener("drop", (e) => {
                const taskId = e.dataTransfer.getData("text/plain");
                const task = tasks.find((t) => t.id == taskId);
                task.status = column.closest(".kanban-column").dataset.status;
                saveTasksToLocalStorage();
                renderTasks();
            });
        });
    }

    renderTasks();
});

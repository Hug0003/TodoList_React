import React, {useEffect, useRef, useState} from 'react';
import {Task} from '../types/Task';

function ToDoList() {
    // list
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);


    const idCounter = useRef(1);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription ] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>("");
    const [editingId, setEditId] = useState<number | null>(null)


    function addTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const newId = idCounter.current++;
        const now = String(Date.now());

        if (title.length < 3) {
            alert("Le titre doit contenir au moins 3 caractères.");
            return;
        }
        if (tasks.find(task => task.title === title)) {
            alert("Le titre doit être unique.");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);

        if (due.getTime() < today.getTime()) {
            alert("La date d'échéance doit être ultérieure à la date actuelle.");
            return;
        }


        const newTask: Task = {
            id: newId, title, description, dueDate, done: false, createdAt: now, updatedAt: "",
        }

        setTasks([...tasks, newTask]);
        setTitle("");
        setDescription("");
        setDueDate("");

    }

    function formatDate(date?: string) {

        if (!date) return "";

        if (isNaN(Number(date))) {
            // pour le calendar
            const d = new Date(date);
            if (isNaN(d.getTime())) return "";
            return new Intl.DateTimeFormat(navigator.language, {
                year: 'numeric', month: 'long', day: 'numeric',
            }).format(Number(d));
        } else {
            // pour le now
            return new Intl.DateTimeFormat(navigator.language, {
                year: 'numeric', month: 'long', day: 'numeric',
            }).format(Number(date));
        }
    }

    function delTask(e: React.MouseEvent<HTMLButtonElement>, id: number) {
        e.preventDefault();
        console.log(id)
        const confirmation = prompt("Êtes-vous sûr de vouloir supprimer cette tâche ? (oui/non)")
        if (confirmation?.toLowerCase() === "oui") {
            setTasks(tasks.filter((task) => task.id !== id));
            alert("tache n°" + id + " supprimée");
        } else {
            alert("suppression annulée");
        }
    }

    function getTasks() {
        return tasks.map((task) => {
        const isEditing = editingId === task.id;
        return (
            <tr key={task.id} className={task.done ? 'done' : ''}>
                <td>
                    <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => {
                            setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t));
                        }}
                    />
                </td>

                {isEditing ? (
                    <>
                        <td>
                        <input
                                type="text"
                                value={task.title}
                                className="input_update"

                                onChange={(e) =>
                                    setTasks(tasks.map(t =>
                                        t.id === task.id ? { ...t, title: e.target.value, updatedAt: String(Date.now()) } : t
                                    ))
                                }
                            />
                        </td>
                            <td>
                            <input
                                type="text"
                                value={task.description}
                                className="input_update"

                                onChange={(e) => {
                                    setTasks(tasks.map(t =>
                                        t.id === task.id ? { ...t, description: e.target.value, updatedAt: String(Date.now()) } : t
                                    ))
                                }
                            }
                            />
                            </td>
                        <td>
                            <input
                            type="date"
                            value={task.dueDate}
                            className="input_update"

                            onChange={(e) => {
                                setTasks(tasks.map(t =>
                                    t.id === task.id ? { ...t, description: e.target.value, updatedAt: String(Date.now()) } : t
                                ))
                            }}/>
                        </td>

                        <td>{formatDate(task.createdAt)}</td>
                        <td>{formatDate(task.updatedAt)}</td>
                        <td>
                            <button className="action-btn delete-btn" value={task.id} onClick={(e) => {
                                delTask(e, task.id)
                            }}>Delete
                            </button>
                        </td>
                        <td>
                            <button className="action-btn update-btn" value={task.id} onClick={(e) => {
                                if(task.title.length <= 3) return;
                                setEditId(null);

                            }}>Save
                            </button>
                        </td>
                    </>


                ): (
                    <>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{formatDate(task.dueDate)}</td>
                        <td>{formatDate(task.createdAt)}</td>
                        <td>{formatDate(task.updatedAt)}</td>
                        <td>
                            <button className="action-btn delete-btn" value={task.id} onClick={(e) => {
                                delTask(e, task.id)
                            }}>Delete
                            </button>
                        </td>
                        <td>
                            <button className="action-btn update-btn" value={task.id} onClick={(e) => {
                                setEditId(task.id)
                            }}>Update
                            </button>
                        </td>
                    </>
                )
                }




            </tr>

        )

    })
    }

    function nbTask() {
        let nbFait = 0
        let nbAFaire = 0


        tasks.map((task) => (task.done ? nbFait++ : nbAFaire++))

        return (<p>Vous avez {nbFait} tâche(s) de faite(s) et {nbAFaire} tâche(s) à faire</p>)


    }

    return (<div className="todo-container">
            <h2> TO DO LIST </h2>
            <div className="task-stats">
                {nbTask()}
            </div>
            <form className="todo-form" onSubmit={(e) => addTask(e)}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder="Description" value={description}
                       onChange={(e) => setDescription(e.target.value)}/>
                <input type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>

                <button type="submit" disabled={title.length == 0}>Add Task</button>
            </form>

            <table className="todo-table">
                <thead>
                <tr>
                    <th scope="col">Done</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Updated At</th>
                    <th scope="col">Delete</th>
                    <th scope="col">Update</th>

                </tr>
                </thead>
                <tbody>
                {getTasks()}
                </tbody>
            </table>


        </div>)
}

export default ToDoList;
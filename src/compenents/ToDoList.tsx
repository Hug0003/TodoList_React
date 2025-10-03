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
    const [updatedAt, setUpdatedAt] = useState<string>("");
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


        if (new Date(dueDate).getTime() < new Date().getTime()) {
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
        setTasks(tasks.filter((task) => task.id !== id));
    }

    function updateTask(e: React.MouseEvent<HTMLButtonElement>, id: number) {
        e.preventDefault();



    }


    function getTasks() {
        return tasks.map((task) => {
        const isEditing = editingId === task.id;
        return (
            <tr key={task.id}>
                <th>
                    <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => {
                            setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t));
                        }}
                    />
                </th>

                {isEditing ? (
                    <>
                        <th>
                            <input
                                type="text"
                                value={task.title}

                                onChange={(e) =>
                                    setTasks(tasks.map(t =>
                                        t.id === task.id ? { ...t, title: e.target.value, updatedAt: String(Date.now()) } : t
                                    ))
                                }
                            />
                            <input
                                type="text"
                                value={task.description}
                                onChange={(e) => {
                                    setTasks(tasks.map(t =>
                                        t.id === task.id ? { ...t, description: e.target.value, updatedAt: String(Date.now()) } : t
                                    ))
                                }
                            }
                            />
                            <input
                            type="date"
                            value={task.dueDate}
                            onChange={(e) => {
                                setTasks(tasks.map(t =>
                                    t.id === task.id ? { ...t, description: e.target.value, updatedAt: String(Date.now()) } : t
                                ))
                            }}/>
                        </th>
                        <th>{formatDate(task.createdAt)}</th>
                        <th>{formatDate(task.updatedAt)}</th>
                        <th>
                            <button value={task.id} onClick={(e) => {
                                delTask(e, task.id)
                            }}>Delete
                            </button>
                        </th>
                        <th>
                            <button value={task.id} onClick={(e) => {
                                setEditId(task.id)

                            }}>Update
                            </button>
                        </th>
                    </>


                ): (
                    <>
                        <th>{task.title}</th>
                        <th>{task.description}</th>
                        <th>{formatDate(task.dueDate)}</th>
                        <th>{formatDate(task.createdAt)}</th>
                        <th>{formatDate(task.updatedAt)}</th>
                        <th>
                            <button value={task.id} onClick={(e) => {
                                delTask(e, task.id)
                            }}>Delete
                            </button>
                        </th>
                        <th>
                            <button value={task.id} onClick={(e) => {
                                setEditId(task.id)
                            }}>Update
                            </button>
                        </th>
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

    return (<div>
            <h2> TO DO LIST </h2>
            {nbTask()}
            <form onSubmit={(e) => addTask(e)}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder="Description" value={description}
                       onChange={(e) => (e.target.value)}/>
                <input type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>

                <button type="submit" disabled={title.length == 0}>Add Task</button>
            </form>

            <ul>

            </ul>

            <table style={{border: "1px solid black", width: "100%"}}>
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
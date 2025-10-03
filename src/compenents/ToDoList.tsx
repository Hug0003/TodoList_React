import React, {useState} from 'react';
import {Task} from '../types/Task';

function ToDoList() {
    // list
    const [tasks, setTasks] = useState<Task[]>([]);

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>("");
    const [done, setDone] = useState<boolean>(false);
    const [updatedAt, setUpdatedAt] = useState<string>("");

    function addTask(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        let nbTasks = tasks.length;
        const newId = nbTasks + 1;
        const now = String(Date.now());

        if (title.length < 3) return;

        const newTask: Task = {
            id: newId,
            title,
            description,
            dueDate,
            done: false,
            createdAt: now,
            updatedAt: "",
        }

        setTasks([...tasks, newTask]);
        setTitle("");
        setDescription("");
        setDueDate("");

    }

        function formatDate(date?: string) {

            if (!date) return "";

            if (isNaN(Number(date))){
                // pour le calendar
                const d = new Date(date);
                if (isNaN(d.getTime())) return "";
                return new Intl.DateTimeFormat(navigator.language, {
                    year: 'numeric', month: 'long', day: 'numeric',
                }).format(Number(d));
            }else{
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


    function getTasks() {
        return tasks.map((task) => (
                <tr>
                    <th><input type={"checkbox"} onClick={e => {
                        setDone(!task.done);
                    }}></input></th>
                   <th key={task.id}>{task.title}</th>
                    <th>{task.description}</th>
                    <th>{formatDate(task.dueDate)}</th>
                    <th>{formatDate(task.createdAt)}</th>
                    <th>{formatDate(task.updatedAt)}</th>
                    <th><button value={task.id} onClick={(e) => {delTask(e, task.id)}}>Delete</button></th>

                </tr>

        ))


    }

    return (
        <div>
            <h2> TO DO LIST </h2>
            <form onSubmit={(e) => addTask(e)}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder="Description" value={description}
                       onChange={(e) => setDescription(e.target.value)}/>
                <input type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>

                <button type="submit">Add Task</button>
            </form>

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
                </tr>
                </thead>
                <tbody>
                    {getTasks()}
                </tbody>
            </table>


        </div>
    )
}

export default ToDoList;
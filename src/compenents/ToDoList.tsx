import React, {useState} from 'react';
import { Task } from '../types/Task';
function ToDoList(){
    // list
    const [tasks, setTasks] = useState<Tast[]>([]);

    const [id, setId] = useState<number>(0);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [done, setDone] = useState<boolean>(false);
    const [createdAt, setCreatedAt] = useState<string>('');
    const [updatedAt, setUpdatedAt] = useState<string>('');

    function addTask(){

    }

    return (
        <div>
            <h2> TO DO LIST </h2>
            <form onSubmit={addTask}>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <input type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>
                <button type="submit">Add Task</button>
            </form>
        </div>
    )
}
export default ToDoList;
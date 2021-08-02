import React, {FC} from 'react';
import {Container, Row, ListGroup, Button, Col} from 'react-bootstrap';
import axios from "axios";
import $ from 'jquery';
import SpinnerPage from "./SpinnerPage";
import ActiveCounter from "./ActiveCounter";
import NewTask from "./NewTask";
import CompleteListItem from "./CompleteListItem";
import DeletedListItem from "./DeletedListItem";
import ActiveListItem from "./ActiveListItem";

interface Task {
    text: string;
    status: string;
    id: number;
}

const TaskList: FC = () => {

    const defaultTasks: Task[] = [];

    const [input, setInput]: [string, (input: string) => void] = React.useState("")
    const [tasks, setTasks]: [Task[], (tasks: Task[]) => void] = React.useState(defaultTasks);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [completed, setCompleted]: [Task[], (tasks: Task[]) => void] = React.useState(defaultTasks);
    const [active, setActive]: [Task[], (tasks: Task[]) => void] = React.useState(defaultTasks);
    const [showAll, setShowAll]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [showDeleted, setShowDeleted]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [showCompleted, setShowCompleted]: [boolean, (loading: boolean) => void] = React.useState<boolean>(false);
    const [showActive, setShowActive]: [boolean, (loading: boolean) => void] = React.useState<boolean>(false);

    // RESTful functions

    //error printing function to reduce duplication
    function getOnrejected(functionName: string) {
        return function (restError: { response: { data: any; status: any; headers: any; }; request: any; message: any; }) {
            alert("There was an error. Please make sure the REST API is up and running and try again!")
            console.log("Error in: " + functionName)
            if (restError.response) {
                // Request made and server responded
                console.log(restError.response.data);
                console.log(restError.response.status);
                console.log(restError.response.headers);
            } else if (restError.request) {
                // The request was made but no response was received
                console.log(restError.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', restError.message);
            }
        };
    }

    //toggles status to active, or completed
    function changeStatus(e: EventTarget, status: string) {
        setLoading(true)

        const target = $(e).parent().parent().parent().attr('value')
        let id = target;
        const data = {
            status: status
        }
        axios.patch<Task[]>("http://localhost:8080/tasks/" + id, data)
            .then(response => {
                    setLoading(true)

                    getTasks()
                }
            )
            .catch(getOnrejected("changeStatus"));
    }

//deletes a task
    function deleteTask(e: EventTarget) {
        setLoading(true)

        const target = $(e).parent().attr('value')
        console.log(target)
        let id = target;
        const data = {
            status: "Delete"
        }
        axios.patch<Task[]>("http://localhost:8080/tasks/" + id, data)
            .then(response => {
                console.log("Updated?")
                setLoading(true)

                getTasks()
            })
            .catch(getOnrejected("deleteTask"));
    }

    //get all tasks
    async function getTasks() {
        await axios
            .get<Task[]>("http://localhost:8080/tasks")
            .then(response => {
                setTasks(response.data.data);
                console.log(response.data.data);
                setLoading(false);
            })
            .catch(getOnrejected("getTasks"));
        return false;
    }

    //create a new task
    async function newTask() {
        const data = {
            text: input,
            status: "Active"
        }
        await axios.post<Task[]>("http://localhost:8080/tasks", data)
            .then(response => {
                console.log({"articleId": response.data.data.id})
            })
            .catch(getOnrejected("newTask"));
        await getTasks();
        return;
    }

    //count how many active tasks there are
    const countActive = () => {
        let count = 0;
        for (let id in tasks) {
            if (tasks[id].status === "Active") {
                count++;
            }
        }
        return count;
    }

    //Rendering tasks

    //list all tasks dynamically
    const listTasks = () => {
        const listedTasks = tasks.map((task) => {
            if (task.status === "Active") {
                return <ActiveListItem task={task} onClick={(e) => changeStatus(e.target, "Complete")}
                                       onClickDelete={(e) => deleteTask(e.target)}/>
            } else if (task.status === "Complete") {
                return <CompleteListItem task={task} onClick={(e) => changeStatus(e.target, "Active")}
                                         onClickDelete={(e) => deleteTask(e.target)}/>
            } else {
                return <DeletedListItem task={task}/>
            }
        });
        return listedTasks
    }

    //list only the completed tasks
    const listCompletedTasks = () => {
        const listedTasks = tasks.map((task) => {
            if (task.status === "Complete") {
                return <CompleteListItem task={task} onClick={(e) => changeStatus(e.target, "Active")}
                                         onClickDelete={(e) => deleteTask(e.target)}/>
            }
        });
        return listedTasks
    }

    //list only the active tasks
    const listActiveTasks = () => {
        const listedTasks = tasks.map((task) => {
            if (task.status === "Active") {
                return <ActiveListItem task={task} onClick={(e) => changeStatus(e.target, "Complete")}
                                       onClickDelete={(e) => deleteTask(e.target)}/>
            }
        });
        return listedTasks
    }

    //hide deleted tasks
    function hideDeleted() {
        const listedTasks = tasks.map((task) => {
            if (task.status === "Active") {
                return <ActiveListItem task={task} onClick={(e) => changeStatus(e.target, "Complete")}
                                       onClickDelete={(e) => deleteTask(e.target)}/>
            } else if (task.status === "Complete") {
                return <CompleteListItem task={task} onClick={(e) => changeStatus(e.target, "Active")}
                                         onClickDelete={(e) => deleteTask(e.target)}/>
            }
        });
        return listedTasks
    }

    //button and state functions

    //get only the completed tasks
    function getCompleted() {
        let completedArray = [...completed]
        for (let id in tasks) {
            if (tasks[id].status === "Complete") {
                completedArray.push(tasks[id])
            }
        }
        setCompleted(completedArray)
        setShowActive(false)
        setShowCompleted(true)
        setShowAll(false)
        return;
    }

    //get only the active tasks
    function getActive() {
        let activeArray = [...active]
        for (let id in tasks) {
            if (tasks[id].status === "Active") {
                activeArray.push(tasks[id])
            }
        }
        setActive(activeArray)
        setShowActive(true)
        setShowCompleted(false)
        setShowAll(false)
        return;
    }

    //show all button and state
    function showAllButton() {
        setShowAll(true)
        setShowCompleted(false)
        setShowActive(false)
        setShowDeleted(true)
    }

    //hide deleted button and state
    function hideDeletedTasks() {
        setShowDeleted(!showDeleted)
        setShowAll(false)
        setShowCompleted(false)
        setShowActive(false)
    }

    //delete all completed tasks
    async function deleteAllCompleted() {
        const data = {
            status: "Deleted"
        }
        for (let id in tasks) {
            if (tasks[id].status === "Complete") {
                await axios.patch<Task[]>("http://localhost:8080/tasks/" + tasks[id].id, data)
                    .then(response => {
                            console.log(response)
                        }
                    )
            }
        }
        getTasks()
    }

    React.useEffect(() => {
        setLoading(true)
        setTimeout(function () {
            getTasks().then(r => setLoading(r))
        }, 2000)
    }, []);

    return (
        <>
            <h2>TASK LIST</h2>
            {loading &&
            <SpinnerPage/>
            }
            {!loading &&
            <Container>
                <Row>
                    <Col>
                        <NewTask onChange={e => setInput(e.target.value)} onClick={newTask}/>

                        <ActiveCounter number={countActive()}/>

                        <ListGroup as="ul">
                            {showAll && showDeleted && listTasks()}
                            {showCompleted && showDeleted && listCompletedTasks()}
                            {showActive && showDeleted && listActiveTasks()}
                            {!showDeleted && hideDeleted()}
                        </ListGroup>

                        {!showAll && <Button className="m-2" variant="primary" onClick={showAllButton}>Show All</Button>}
                        {!showCompleted && <Button className="m-2" variant="primary" onClick={getCompleted}>Show Completed Only</Button>}
                        {!showActive && <Button className="m-2" variant="primary" onClick={getActive}>Show Active Only</Button>}
                        {showDeleted && <Button className="m-2" variant="primary" onClick={hideDeletedTasks}>Hide Deleted</Button>}
                    </Col>
                </Row>
                <Button className="m-1" variant="danger" onClick={() => deleteAllCompleted()}>DELETE ALL COMPLETED</Button>
            </Container>}
        </>
    );
};

export default TaskList;

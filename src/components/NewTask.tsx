import React from "react";
import {Button, Form} from "react-bootstrap";

export default class NewTask extends React.Component<{ onChange: (e) => void, onClick: () => Promise<void> }> {
    render() {
        return <Form style={{}}>
            <Form.Group className="m-3" controlId="formBasicPassword">
                <Form.Control type="input" placeholder="Add Task"
                              onChange={this.props.onChange}/>

            </Form.Group>
            <Button className="m-1" variant="info" onClick={this.props.onClick}>
                Add Task
            </Button>
        </Form>;
    }
}
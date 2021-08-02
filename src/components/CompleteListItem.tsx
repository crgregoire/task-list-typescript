import React from "react";
import {Button, ListGroup, Row, Col} from "react-bootstrap";

interface Task {
    text: string;
    status: string;
    id: number;
}

export default class CompleteListItem extends React.Component<{ task: Task, onClick: (e) => void, onClickDelete: (e) => void }> {
    render() {
        return <ListGroup.Item as="li" variant="info"
                               style={{border: "1px solid black"}}
                               value={this.props.task.id}>
            <Row>
                <Col md={6} className="mt-3">
                    COMPLETED: {this.props.task.text}
                </Col>
                <Col md={3}>
                    <Button className="m-2" variant="primary" onClick={this.props.onClick}>Make Active?</Button>
                </Col>
                <Col md={3}>
                    <Button className="m-2" variant="danger" onClick={this.props.onClickDelete}>Delete?</Button>
                </Col>
            </Row>
        </ListGroup.Item>;
    }
}
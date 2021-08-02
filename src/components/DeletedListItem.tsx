import React from "react";
import {Col, ListGroup, Row} from "react-bootstrap";

interface Task {
    text: string;
    status: string;
    id: number;
}

export default class DeletedListItem extends React.Component<{ task: Task }> {
    render() {
        return <ListGroup.Item as="li"
                               style={{
                                   // backgroundColor: "red",
                                   // color: "black",
                                   border: "1px solid black"
                               }}
                               className="p-4"
                               variant="danger"
                               value={this.props.task.id}>
            <Row>
                <Col md={6}>DELETED: {this.props.task.text}</Col>
            </Row>
        </ListGroup.Item>;
    }
}
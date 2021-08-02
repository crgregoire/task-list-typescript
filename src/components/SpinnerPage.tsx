import React from "react";
import {Col, Container, Row, Spinner} from "react-bootstrap";

class SpinnerPage extends React.Component {
    render() {
        return <Container>
            <Row>
                <Col>
                    <Spinner
                        animation="border" role="status">
                    </Spinner>
                </Col>
            </Row>
        </Container>;
    }
} export default SpinnerPage;
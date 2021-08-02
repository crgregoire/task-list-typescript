import React from "react";

export default class ActiveCounter extends React.Component<{ number: number }> {
    render() {
        return <h5>HOW MANY ACTIVE TASKS? {this.props.number}</h5>;
    }
}
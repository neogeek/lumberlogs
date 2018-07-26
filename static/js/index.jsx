import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';

class LogEntry extends PureComponent {
    render() {
        return <div>{this.props.text}</div>;
    }
}

class Logs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logs: []
        };

        this.socket = new WebSocket('ws://localhost:8000');
        this.socket.addEventListener('message', event => {
            this.setState({
                logs: [...this.state.logs, event.data]
            });
        });
    }
    render() {
        return (
            <div>
                {this.state.logs.map((log, index) => (
                    <LogEntry key={index} text={log} />
                ))}
            </div>
        );
    }
}

ReactDOM.render(<Logs />, document.getElementById('root'));

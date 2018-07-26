import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';

class LogEntry extends PureComponent {
    render() {
        return <div className="log-entry">{this.props.text}</div>;
    }
}

class Logs extends Component {
    constructor(props) {
        super(props);

        let logs = [];

        if (localStorage.getItem('logs')) {
            logs = JSON.parse(localStorage.getItem('logs'));
        }

        this.state = {
            logs
        };

        this.socket = new WebSocket('ws://localhost:8000');
        this.socket.addEventListener('message', event => {
            this.setState(
                {
                    logs: [...this.state.logs, event.data]
                },
                () => {
                    localStorage.setItem(
                        'logs',
                        JSON.stringify(this.state.logs.slice(-100))
                    );
                }
            );
        });
    }
    render() {
        return (
            <div className="logs">
                {this.state.logs.map((log, index) => (
                    <LogEntry key={index} text={log} />
                ))}
            </div>
        );
    }
}

ReactDOM.render(<Logs />, document.getElementById('root'));

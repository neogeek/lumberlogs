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
                    document
                        .querySelector('.log-entry-footer')
                        .scrollIntoView({ behavior: 'smooth' });
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
            <div className="page-wrapper">
                <header className="page-header">
                    <h1>LumberLog Dashboard</h1>
                </header>
                <div className="logs">
                    {this.state.logs.map((log, index) => (
                        <LogEntry key={index} text={log} />
                    ))}
                    <div className="log-entry-footer" />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Logs />, document.getElementById('root'));

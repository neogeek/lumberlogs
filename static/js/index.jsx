import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';

const MAX_LOGS_IN_CACHE = 1000;

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
            filter: new RegExp('', 'i'),
            logs,
            url: ''
        };

        this.socket = new WebSocket(`ws://${document.location.host}`);
        this.socket.addEventListener('message', event => {
            this.setState(
                {
                    logs: [...this.state.logs, event.data]
                },
                () => {
                    this.storeCache();
                    this.scrollToBottom();
                }
            );
        });
        fetch('/ip')
            .then(response => response.json())
            .then(url => this.setState({ url }));

        document.addEventListener('keydown', e => {
            if (e.metaKey && e.code === 'KeyK') {
                this.clearCache();
            }
        });
    }
    filterLogs(e) {
        this.setState({
            filter: new RegExp(e.target.value, 'i')
        });
    }
    storeCache() {
        localStorage.setItem(
            'logs',
            JSON.stringify(this.state.logs.slice(-MAX_LOGS_IN_CACHE))
        );
    }
    clearCache() {
        this.setState({ logs: [] }, this.storeCache());
    }
    scrollToBottom(behavior = 'smooth') {
        document
            .querySelector('.log-entry-footer')
            .scrollIntoView({ behavior });
    }
    componentDidMount() {
        this.scrollToBottom('instant');
    }
    render() {
        return (
            <div className="page-wrapper">
                <header className="page-header">
                    <h1 class="page-header-title">LumberLogs</h1>
                    <div className="page-header-url">
                        <p>
                            <span className="url">{this.state.url}</span>
                        </p>
                    </div>
                    <div className="page-header-filter">
                        <input
                            type="search"
                            className="input"
                            size={40}
                            onChange={this.filterLogs.bind(this)}
                            placeholder="Filter logs"
                        />
                        <button
                            className="button"
                            onClick={this.clearCache.bind(this)}
                        >
                            Clear Logs
                        </button>
                    </div>
                </header>
                <div className="logs">
                    {this.state.logs
                        .filter(log => this.state.filter.test(log))
                        .map((log, index) => (
                            <LogEntry key={index} text={log} />
                        ))}
                    <div className="log-entry-footer" />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Logs />, document.getElementById('root'));

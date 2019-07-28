import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const MAX_LOGS_IN_CACHE = 1000;

const scrollToBottom = (behavior = 'smooth') => {
    document.querySelector('.log-entry-footer').scrollIntoView({ behavior });
};

const socket = new WebSocket(`ws://${document.location.host}`);

const Logs = () => {
    const [url, setUrl] = useState();
    const [filter, setFilter] = useState(new RegExp('', 'i'));
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        let logs = [];

        if (localStorage.getItem('logs')) {
            logs = JSON.parse(localStorage.getItem('logs'));
        }

        setLogs(logs);
    }, []);

    useEffect(() => {
        fetch('/ip')
            .then(response => response.json())
            .then(setUrl);
        scrollToBottom('instant');
    }, []);

    useEffect(() => {
        localStorage.setItem(
            'logs',
            JSON.stringify(logs.slice(-MAX_LOGS_IN_CACHE))
        );
        scrollToBottom();
    }, [logs]);

    const handleKeyDown = e => {
        if (e.metaKey && e.code === 'KeyK') {
            setLogs([]);
        }
    };

    const handleWebsocketMessage = event => setLogs([...logs, event.data]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        socket.addEventListener('message', handleWebsocketMessage);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            socket.removeEventListener('message', handleWebsocketMessage);
        };
    }, []);

    return (
        <div className="page-wrapper">
            <header className="page-header">
                <h1 className="page-header-title">LumberLogs</h1>
                <div className="page-header-url">
                    <p>
                        <span className="url">{url}</span>
                    </p>
                </div>
                <div className="page-header-filter">
                    <input
                        type="search"
                        className="input"
                        size={40}
                        onChange={e =>
                            setFilter(new RegExp(e.target.value, 'i'))
                        }
                        placeholder="Filter logs"
                    />
                    <button className="button" onClick={() => setLogs([])}>
                        Clear Logs
                    </button>
                </div>
            </header>
            <div className="logs">
                {logs
                    .filter(log => filter.test(log))
                    .map((log, index) => (
                        <div key={index} className="log-entry">
                            {log}
                        </div>
                    ))}
                <div className="log-entry-footer" />
            </div>
        </div>
    );
};

ReactDOM.render(<Logs />, document.getElementById('root'));

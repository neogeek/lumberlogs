const socket = new WebSocket(`ws://${document.location.host}`);

const url = document.querySelector('.url');
const logs = document.querySelector('.logs');
const filterInput = document.querySelector('#filter');
const clearButton = document.querySelector('#clear');

url.innerHTML = `http://${document.location.host}/log`;

const filterLogs = keywords => {
    const pattern = new RegExp(keywords, 'i');
    logs.querySelectorAll('.log-entry').forEach(log => {
        log.classList.toggle('hidden', !log.innerHTML.match(pattern));
    });
};

socket.addEventListener('message', ({ data }) => {
    logs.innerHTML += `<div class="log-entry">${data}</div>`;
    filterLogs(filterInput.value);
    logs.querySelector('div:last-of-type').scrollIntoView({ behavior: 'auto' });
});

filterInput.addEventListener('keyup', e => filterLogs(e.target.value));
filterInput.addEventListener('search', e => filterLogs(e.target.value));

clearButton.addEventListener('click', () => (logs.innerHTML = ''));

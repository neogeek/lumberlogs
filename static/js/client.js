const socket = new WebSocket(`ws://${document.location.host}`);

const urls = document.querySelectorAll('.url');
const logList = document.querySelector('.log-list');
const filterInput = document.querySelector('#filter');
const clearButton = document.querySelector('#clear');

urls.forEach(url => {
    url.innerHTML = `http://${document.location.host}/log`;
});

const filterLogs = keywords => {
    const pattern = new RegExp(keywords, 'i');
    logList.querySelectorAll('.log-list-item').forEach(log => {
        log.classList.toggle('hidden', !log.innerHTML.match(pattern));
    });
};

socket.addEventListener('message', ({ data }) => {
    logList.innerHTML += `<li class="log-list-item">${data}</li>`;
    filterLogs(filterInput.value);
    logList
        .querySelector('li:last-of-type')
        .scrollIntoView({ behavior: 'auto' });
});

filterInput.addEventListener('keyup', e => filterLogs(e.target.value));
filterInput.addEventListener('search', e => filterLogs(e.target.value));

clearButton.addEventListener('click', () => {
    logList.innerHTML = '';
});

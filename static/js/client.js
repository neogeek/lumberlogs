const socket = new WebSocket(`ws://${document.location.host}`);

const urls = document.querySelectorAll('.url');
const logs = document.querySelector('.logs');
const zeroContent = logs.querySelector('.zero-content');
const filterInput = document.querySelector('#filter');
const clearButton = document.querySelector('#clear');

urls.forEach(url => {
    url.innerHTML = `http://${document.location.host}/log`;
});

const filterLogs = keywords => {
    const pattern = new RegExp(keywords, 'i');
    logs.querySelectorAll('.log-entry').forEach(log => {
        log.classList.toggle('hidden', !log.innerHTML.match(pattern));
    });
};

socket.addEventListener('message', ({ data }) => {
    zeroContent.classList.toggle('hidden', true);
    logs.innerHTML += `<div class="log-entry">${data}</div>`;
    filterLogs(filterInput.value);
    logs.querySelector('div:last-of-type').scrollIntoView({ behavior: 'auto' });
});

filterInput.addEventListener('keyup', e => filterLogs(e.target.value));
filterInput.addEventListener('search', e => filterLogs(e.target.value));

clearButton.addEventListener('click', () => (logs.innerHTML = ''));

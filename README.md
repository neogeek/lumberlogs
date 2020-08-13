# LumberLogs

> A simple log aggregation tool.

[![](https://img.shields.io/badge/Trello-Board-blue.svg)](https://trello.com/b/BIqhJuLP/lumberlogs)

![](screenshot.jpg)

## Install

Download the latest from <https://github.com/neogeek/lumberlogs/releases>

## Usage

### Bash

```bash
$ curl -H "content-type:text/plain" -d "Hello, world." http://localhost:1234/log
```

```bash
$ curl -H "content-type:application/json" -d "{\"message\":\"Hello, world.\"}" http://localhost:1234/log
```

### JavaScript

```javascript
fetch('http://localhost:1234/log', {
    method: 'POST',
    body: 'Hello, world.'
});
```

```javascript
fetch('http://localhost:1234/log', {
    method: 'POST',
    body: JSON.stringify({ message: 'Hello, world.' }),
    headers: {
        'Content-Type': 'application/json'
    }
});
```

### Unity

Install package via UPM <https://gist.github.com/46e7896edaf8a59089b19fb07577555f.git>

## Build

Install required packages via node.

```bash
$ npm install
```

Test the application.

```bash
$ npm start
```

Build the application.

```bash
$ npm run build
```

# LumberLogs

> A self-hosted log aggregation tool.

[![](https://img.shields.io/badge/Trello-Board-blue.svg)](https://trello.com/b/BIqhJuLP/lumberlogs)

![](screenshot.jpg)

## Setup

Install required packages via node.

```bash
$ npm install
```

Run the server.

```bash
$ npm start
```

Running the server with a custom port.

```bash
$ PORT=5000 npm start
```

## Usage

### Bash

```bash
$ curl -H "content-type:text/plain" -d 'Hello, world.' http://localhost:1234/log
```

```bash
$ curl -H "content-type:application/json" -d '{"message":"Hello, world."}' http://localhost:1234/log
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

```csharp
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class Logger : MonoBehaviour
{

#pragma warning disable CS0649
    [SerializeField]
    private string url;
#pragma warning restore CS0649

    private int failedConnections;

    private const int maxFailedConnections = 10;

#if UNITY_EDITOR || DEVELOPMENT_BUILD

    private void OnEnable()
    {

        Application.logMessageReceived += HandleLog;

    }

    private void OnDisable()
    {

        Application.logMessageReceived -= HandleLog;

    }

#endif

    private void HandleLog(string logString, string stackTrace, LogType type)
    {

        if (url == null || failedConnections >= maxFailedConnections)
        {
            return;
        }

        var loggingForm = new WWWForm();

        loggingForm.AddField("Type", type.ToString());
        loggingForm.AddField("Message", logString);
        loggingForm.AddField("Stack_Trace", stackTrace);
        loggingForm.AddField("Device_Model", SystemInfo.deviceModel);

        StartCoroutine(SendDataToLumberLog(loggingForm));

    }

    private IEnumerator SendDataToLumberLog(WWWForm form)
    {
        using (var www = UnityWebRequest.Post(url, form))
        {

            yield return www.SendWebRequest();

            if (!www.isNetworkError && !www.isHttpError)
            {
                yield break;
            }

            Debug.LogError(www.error);

            failedConnections += 1;

        }

    }

}
```

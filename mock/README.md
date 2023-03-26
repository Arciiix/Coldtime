The app can be used for various types of devices - I wanted to make it universal
Even though, there's a simple mock of the fridge (SMART PRO) to emitate the data without having the actual appliance physically

# Architecture

The fridge uses the REST API at `/v1/school/status`

The data is returned in JSON.
Here's an example gotten from the device I tested it on:

```json
{
  "IS_RUNNING": true,
  "TEMPERATURE_MAIN": {
    "value": 3039,
    "error": false
  }
}
```

Note: the default port is 56000

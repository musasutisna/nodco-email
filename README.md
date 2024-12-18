<h1 align="center">Nodejs Config Email</h1>

Nodejs config api is package to make easier configuration nodejs configuration intergration with email.

## Getting started

Lets install nodco-email with npm

```bash
npm install --save @musasutisna/nodco-email
```

## How to initialize

```js
const nodcoEmailConfig = require('@musasutisna/nodco-email');

nodcoEmailConfig(
  {
    host, // string, email host
    port, // number, email port
    secure, // boolean, email secure mode
    pool, // boolean, email pool mode
    username, // string, email user username
    password, // string, email user password
    options  // object, option will be pass and combine into every payload on send email
  }
)
```

| Method | Type | Description |
|:--|:--|:--|
| connect | async | Open connection to email. |
| close | async | Close all connection have been made. |
| send | async | Sending email |

<br/>

```js
connect(
  key, // string, the unique key in config we have on initialize
  cb // string, function callback will be call after connected successful
)

close(
  // no arguments
)

send(
  key, // string, the unique key in config we have on initialize
  payload // object, the content will be send
)
```

# micro-airtable-api

[![Build Status](https://badgen.net/travis/rosszurowski/micro-airtable-api)](https://travis-ci.com/rosszurowski/micro-airtable-api)

Quickly make an API from an [Airtable](https://airtable.com/). Use it as a database or CMS without any hassle.

Airtable offers [a great API](https://airtable.com/api), but using it on the client-side exposes your API key, giving anyone read-write permissions to your data. `micro-airtable-api` proxies an Airtable API, hiding your API key and letting you control access (eg. marking an API as read-only).

Use Airtable as a cheap-and-easy CMS for simple blogs and sites :tada:

> :construction: This project has not been thoroughly tested. Use at your own risk!

## Setup

There are three ways to run this library and set up your own Airtable proxy:

### Now

To use [`now`](https://now.sh/) and deploy with a single command:

```bash
$ now rosszurowski/micro-airtable-api -e AIRTABLE_BASE_ID=asdf123 -e AIRTABLE_API_KEY=xyz123

> Deployment complete! https://micro-airtable-api-asfdasdf.now.sh
```

Once deployed, you can read or edit your data at:

```
https://micro-airtable-api-asdasd.now.sh/v0/Table
```

To update to a new version with potential bugfixes, all you have to do is run the `now` command again and change the URL you call in your app!

### CLI

Install the package globally and run it:

```bash
$ npm i -g micro-airtable-api
$ AIRTABLE_BASE_ID=asdf123 AIRTABLE_API_KEY=xyz123 micro-airtable-api

> Starts server on port 3000
```

### JS

Install the package locally and pass the handler into your webserver:

```bash
$ npm i micro-airtable-api
```

```js
const http = require('http');
const createAirtableProxy = require('micro-airtable-api');

const config = {
  airtableApiKey: 'YourApiKey',
  airtableBaseId: 'YourBaseId',
};

const server = http.createServer(createAirtableProxy(config));
```

### Setup Notes

You can find your _Base ID_ in the [Airtable API docs](https://airtable.com/api) and _API key_ in [your Airtable account settings](https://airtable.com/account).

Read below for [all configurable options](#configuration).

## Configuration

`micro-airtable-api` supports a few different options through environment variables for easy deployment.

- **`AIRTABLE_BASE_ID` (required)** The _Base ID_ of the Airtable you want to connect to. You can find this in your [Airtable API docs](https://airtable.com/api).
- **`AIRTABLE_API_KEY` (required)** Your personal account API key. You can find this in [your account settings](https://airtable.com/account).
- `READ_ONLY` A shortcut flag to restrict the API to only `GET` requests. Users of the API will be able to list all records and individual records, but not create, update, or delete.
- `ALLOWED_METHODS` A comma-separated list of allowed HTTP methods for this API. Use this to restrict how users can interact with your API. For example, allow creating new records but not deleting by passing in a string without the delete method: `ALLOWED_METHODS=GET,POST,PATCH`. The `READ_ONLY` flag is simply a shortcut to `ALLOWED_METHODS=GET`. Note, the `OPTIONS` method is always allowed for [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) purposes.
- `PORT` Sets the port for the local server. Defaults to `3000`.

## Contributing

Issues and PRs are welcome! If you'd like to contribute code, check out our [guide on how to contribute](https://github.com/rosszurowski/micro-airtable-api/blob/master/CONTRIBUTING.md).

## License

[MIT](https://github.com/rosszurowski/micro-airtable-api/blob/master/LICENSE.md)

# micro-airtable-api

[![Build Status](https://badgen.net/travis/rosszurowski/micro-airtable-api)](https://travis-ci.com/rosszurowski/micro-airtable-api)

Quickly make an API from an [Airtable](https://airtable.com/). Use it as a database or CMS without any hassle.

Airtable offers [a great API](https://airtable.com/api), but using it on the client-side exposes your API key, giving anyone read-write permissions to your data. `micro-airtable-api` proxies an Airtable API, hiding your API key and letting you control access (eg. marking an API as read-only).

Use Airtable as a cheap-and-easy CMS for simple blogs and sites :tada:

> :construction: This project has not been thoroughly tested. Use at your own risk!

## Usage

The simplest way to get started with your own Airtable proxy is via [`now`](https://now.sh/). Setup and deploy with a single command:

```bash
$ now rosszurowski/micro-airtable-api -e AIRTABLE_BASE_ID=asdf123 -e AIRTABLE_API_KEY=xyz123

> Deployment complete! https://micro-airtable-api-asfdasdf.now.sh
```

Once deployed, you can read or edit your data at:

```
https://micro-airtable-api-asdasd.now.sh/v0/TableName
```

To update to a new version with potential bugfixes, all you have to do is run the `now` command again and change the URL you call in your app!

### CLI

If you'd like to run a proxy on a different service, you can use the `micro-airtable-api` command-line. Install the package globally and run it:

```bash
$ npm i -g micro-airtable-api
$ AIRTABLE_BASE_ID=asdf123 AIRTABLE_API_KEY=xyz123 micro-airtable-api

> micro-airtable-api listening on http://localhost:3000
```

### JS API

For more advanced configuration or to integrate with an existing http or express server, you can also install the package locally and pass the handler into your webserver:

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

`micro-airtable-api` is configurable both through the JS API and the CLI.

```jsx
const http = require('http');
const createAirtableProxy = require('micro-airtable-api');

const config = {};

http.createServer(createAirtableProxy(config));
```

#### `config.airtableBaseId` **(required)**

The _Base ID_ of the Airtable you want to connect to. You can find this in your [Airtable API docs](https://airtable.com/api).

#### `config.airtableApiKey` **(required)**

Your personal account API key. You can find this in [your account settings](https://airtable.com/account).

#### `config.allowedMethods`

An array of HTTP methods supported by the API. Use this to restrict how users can interact with your API. Defaults to all methods.

This maps directly to operations on Airtable:

- `GET` allows reading lists of records or individual records
- `POST` allows creating new records
- `PATCH` allows updating existing records
- `DELETE` allows removing records.

To create a read-only API, to use as a CMS:

```jsx
createAirtableProxy({
  airtableBaseId: '...',
  airtableApiKeyId: '...',
  allowedMethods: ['GET'],
});
```

To create a write-only API, to use for collecting survey responses:

```jsx
// A write-only API (eg. surveys)
createAirtableProxy({
  airtableBaseId: '...',
  airtableApiKeyId: '...',
  allowedMethods: ['POST'],
});
```

You can set table-specific permissions by passing in an object with table names as the keys.

If you were setting up a blog through Airtable, you could do the following:

```jsx
createAirtableProxy({
  airtableBaseId: '...',
  airtableApiKeyId: '...',
  allowedMethods: {
    'Blog Posts': ['GET'],
    'Blog Comments': ['POST', 'PATCH', 'DELETE'],
  },
});
```

Note, the `OPTIONS` method is always allowed for [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) purposes.

### CLI Options

The CLI exposes the above configuration options through environment variables for easy deployment.

```bash
$ AIRTABLE_BASE_ID=asdf123 AIRTABLE_API_KEY=xyz123 micro-airtable-api
```

- **`AIRTABLE_BASE_ID` (required)** Same as `config.airtableBaseId` above
- **`AIRTABLE_API_KEY` (required)** Same as `config.airtableApiKey` above
- `ALLOWED_METHODS` Similar to `config.allowedMethods` above, except a comma-separated list instead of an array. For example, allow creating new records but not deleting by passing in a string without the delete method: `ALLOWED_METHODS=GET,POST,PATCH`. The CLI does not support table-specific permissions. Use the JS API if this is something you need.
- `READ_ONLY` A shortcut variable to restrict the API to only `GET` requests. Equivalent to `ALLOWED_METHODS=GET`. Users of the API will be able to list all records and individual records, but not create, update, or delete.
- `PORT` Sets the port for the local server. Defaults to `3000`.

## Contributing

Issues and PRs are welcome! If you'd like to contribute code, check out our [guide on how to contribute](https://github.com/rosszurowski/micro-airtable-api/blob/master/CONTRIBUTING.md).

## License

[MIT](https://github.com/rosszurowski/micro-airtable-api/blob/master/LICENSE.md)

# micro-airtable-api

Quickly make an API from an [Airtable](https://airtable.com/). Use it as a database or CMS without any hassle.

:construction: This project has not been thoroughly tested. Use at your own risk!

## Setup

To use [`now`](https://now.sh/) and deploy with a single command:

```bash
$ now rosszurowski/micro-airtable-api -e AIRTABLE_BASE_ID=asdf123 -e AIRTABLE_API_KEY=xyz123

> Deployment complete! https://micro-airtable-api-asfdasdf.now.sh
```

You can find your _Base ID_ in the [Airtable API docs](https://airtable.com/api) and _API key_ in [your Airtable account settings](https://airtable.com/account).

Once deployed, you can load your data:

```
https://micro-airtable-api-asdasd.now.sh/v0/Table
```

Read below for [all configurable options](#configuration).

## Details

Airtable offers [an API](https://airtable.com/api) for your tables, but using it on the client-side exposes your API key, giving anyone read-write permissions to your table.

`micro-airtable-api` proxies an Airtable API, letting you hide your key and optionally mark an API as read-only, making Airtable a cheap-and-easy CMS for blogs and sites.

## Configuration

`micro-airtable-api` supports a few different options through environment variables for easy deployment.

#### `AIRTABLE_BASE_ID` (required)

The _Base ID_ of the Airtable you want to connect to. You can find this in your [Airtable API docs](https://airtable.com/api).

#### `AIRTABLE_API_KEY` (required)

Your personal account API key. You can find this in [your account settings](https://airtable.com/account).

#### `READ_ONLY`

A shortcut flag to restrict the API to only `GET` requests. Users of the API will be able to list all records and individual records, but not create, update, or delete.

#### `ALLOWED_METHODS`

A comma-separated list of allowed HTTP methods for this API. Use this to restrict how users can interact with your API. For example, allow creating new records but not deleting by passing in a string without the delete method: `ALLOWED_METHODS=GET,POST,PATCH`.

The `OPTIONS` method is always allowed for [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) purposes.

The `READ_ONLY` flag is a shortcut to set `ALLOWED_METHODS=GET`.

Defaults to every method supported by Airtable: `GET,POST,PATCH,DELETE`.

#### `PORT`

Sets the port for the local server. Defaults to `3000`.

## Local Development

When working locally, you can start the app with [Nodemon](https://www.npmjs.com/package/nodemon) to automatically restart the process when changes are made: `npm run dev`.

Run the automated tests (written in [Jest](https://jestjs.io/en/)) with `npm test`.

## Todo

- [x] [Read-only API](https://github.com/rosszurowski/micro-airtable-api/issues/2)
- [ ] [Remapping column names](https://github.com/rosszurowski/micro-airtable-api/issues/3)
- [ ] [Add request caching to get around rate limits](https://github.com/rosszurowski/micro-airtable-api/issues/5)

## License

Copyright ©️ 2017 Ross Zurowski, licensed under the MIT License. See [`LICENSE.md`](https://github.com/rosszurowski/micro-airtable-api/blob/master/LICENSE.md) for more information.

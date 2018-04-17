# `micro-airtable-api`

Quickly make an API from an [Airtable](https://airtable.com/) sheet. Use Airtable as a CMS or database without any hassle.

:construction: This project has not been thoroughly tested. Use at your own risk!

## Setup

To use [`now`](https://now.sh/) and deploy with a single command:

```bash
$ now rosszurowski/micro-airtable-api -e AIRTABLE_BASE_ID=asdf123 -e AIRTABLE_API_KEY=xyz123

> Deployment complete! https://micro-airtable-api-asfdasdf.now.sh
```

You can get your _Base ID_ from the [Airtable API docs](https://airtable.com/api) and _API key_ from [your account settings](https://airtable.com/account).

Read below for [all configurable options](#configuration).

## Details

This microservice is a proxy for an Airtable API. It follows the same specs as Airtable's API documentation, except without the base ID in the URL. This means requests like:

```bash
curl https://api.airtable.com/v0/appAB2eD31svWoks9/Table
# is the same as
curl https://micro-airtable-api-asdasd.now.sh/v0/Table
```

### Configuration

`micro-airtable-api` supports a few different configurations, all through environment variables (for now) to make deployment easy.

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

## License

Copyright ©️ 2017 Ross Zurowski, licensed under the MIT License. See [`LICENSE.md`](https://github.com/rosszurowski/micro-airtable-proxy/blob/master/LICENSE.md) for more information.

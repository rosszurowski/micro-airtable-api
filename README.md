# `micro-airtable-api` 💨

Quickly make an API from an [Airtable](https://airtable.com/). Use it as a database or CMS without any hassle.

## Setup

To use [`now`](https://now.sh/) and deploy with a single command:

```bash
$ now rosszurowski/micro-airtable-api -e AIRTABLE_BASE_ID=asdf123 -e AIRTABLE_API_KEY=xyz123

> Deployment complete! https://micro-airtable-api-asfdasdf.now.sh
```

You can find your _Base ID_ in the [Airtable API docs](https://airtable.com/api) and _API key_ in [your Airtable account settings](https://airtable.com/account).

## Details

This micro-service is a proxy for an Airtable API. It follows the same specs as Airtable's api documentation, except without the base ID in the URL. This means requests like:

```bash
curl https://api.airtable.com/v0/appAB2eD31svWoks9/Table
# is the same as
curl https://micro-airtable-api-asdasd.now.sh/v0/Table
```

## License

Copyright ©️ 2017 Ross Zurowski, licensed under the MIT License. See [`LICENSE.md`](https://github.com/rosszurowski/micro-airtable-api/blob/master/LICENSE.md) for more information.

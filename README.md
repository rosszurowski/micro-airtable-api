# `micro-airtable-api` 💨

Quickly make an API from an [Airtable](https://airtable.com/). Use it as a database or CMS without any hassle.

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

## Details

Airtable already offers [an API](https://airtable.com/api), but using it on the client-side means you would need to expose your API key, which gives anyone read-write permissions to your table.

`micro-airtable-api` proxies an Airtable sheet, letting you hide your API key and (coming soon) mark an API as read-only, making Airtable a cheap-and-easy CMS for blogs and sites.

## Todo

- [ ] [Read-only API](https://github.com/rosszurowski/micro-airtable-api/issues/2)
- [ ] [Remapping column names](https://github.com/rosszurowski/micro-airtable-api/issues/3)

## License

Copyright ©️ 2017 Ross Zurowski, licensed under the MIT License. See [`LICENSE.md`](https://github.com/rosszurowski/micro-airtable-api/blob/master/LICENSE.md) for more information.

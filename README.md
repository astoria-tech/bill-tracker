# Bill Tracker

A yearly compendium of bills in the New York State Senate.

## Requirements

Docker & Docker Compose

You will also need an [API key](https://legislation.nysenate.gov/). At the root of this project, create a `.env` file and paste your key like so:

```
OPEN_LEGISLATION_KEY=asdlkfjaskldjflkasjdflkasjflkjadslfkj
```

## Development with Docker

- Run `make dev` at the root of this project.
- Visit the app at [http://localhost:3000](http://localhost:3000).
- Make your code changes! Only the frontend will be live-reloaded whenever you save.

## Development with Node locally

- make a duplicate `.env` file in `backend`
- make sure you have [redis](https://redis.io/) running: `redis-cli ping`
- in `backend`, run `npm i` and then `npm run dev`
- in `frontend`, run `npm i` and then `npm start` and hit Enter when prompted about ports
- visit the app at [http://localhost:3001](http://localhost:3001)

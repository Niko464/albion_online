I got banned
I thought I would make a readme in case one day I want to use this again

- Start docker

```
docker compose up -d
```

- Start back and front

```
cd apps/backend
pnpm install
pnpm dev
```

```
cd apps/frontend
pnpm install
pnpm dev
```



That will start front and back easy peasy

Now how to get prices from the market

```
cd apps/bot
python ocr_v2.py http://localhost:3000 <cityname>
```

Then go to a market (open the buy menu) and press numpad 5

This will use the outputs/watch_list.json to get all those items in the market use OCR to recognise prices
and send them to the back
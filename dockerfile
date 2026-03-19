FROM alpine:latest 

WORKDIR /app 

COPY . .

RUN apk add ffmpeg 

RUN apk add nodejs

RUN apk add npm

RUN npm install -g pnpm 

RUN pnpm install 

RUN pnpm build 

CMD [ "pnpm","start" ]














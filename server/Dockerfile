FROM node:25.6.1-alpine3.23 as dev

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY src src
COPY tsconfig.json tsconfig.json

CMD yarn dev


FROM node:25.6.1-alpine3.23 AS builder
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY tsconfig.json tsconfig.json
COPY src src
RUN npm run build

FROM node:25.6.1-alpine3.23
WORKDIR /app
COPY package.json package.json
RUN npm install --omit=dev
COPY --from=builder /app/dist dist
CMD npm start
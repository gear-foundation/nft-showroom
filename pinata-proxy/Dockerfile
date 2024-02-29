FROM node:18.17.0-alpine

ENV NODE_ENV=production
RUN npm install -g @nestjs/cli
RUN npm i -g typescript@4.3.5
RUN npm i -g nest

WORKDIR /app
RUN npm i @types/node
RUN npm i @types/multer
COPY ["package.json", "package-lock.json", "./"]
RUN npm install

COPY ["tsconfig.json",  "tsconfig.build.json", "./"]
COPY ./src ./src/
RUN npm run build

CMD [ "node", "dist/main.js" ]

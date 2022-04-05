FROM node

WORKDIR /app

ADD package.json ./

RUN npm install --global yarn --force

RUN yarn install

ADD . .

CMD ["yarn", "start"]

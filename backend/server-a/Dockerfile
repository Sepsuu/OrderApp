FROM node:10

RUN groupadd -r nodeapp && \
    useradd -r -m -d /app -g nodeapp nodeapp

COPY ./app /app

RUN chown -R nodeapp:nodeapp /app

USER nodeapp

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
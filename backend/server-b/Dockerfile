FROM node:10

RUN groupadd -r serverapp && \ 
    useradd -r -m -d /app -g serverapp serverapp

COPY ./app /app

RUN chown -R serverapp:serverapp /app

USER serverapp

WORKDIR /app

COPY ./app/package*.json ./

RUN npm install

EXPOSE 5672

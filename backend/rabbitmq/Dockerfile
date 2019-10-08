FROM rabbitmq:3-management

RUN echo '[{rabbit, [{loopback_users, []}]}].' > /etc/rabbitmq/rabbitmq.config

EXPOSE 4369 5671 5672 25672

CMD ["rabbitmq-server", "start"]
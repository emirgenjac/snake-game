FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY welcome.html /usr/share/nginx/html/
COPY game.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY game.js /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
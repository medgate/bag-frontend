ARG NODE_IMAGE=node
FROM ${NODE_IMAGE} as build
WORKDIR /web
COPY . .

RUN npm install
RUN npm install -g @angular/cli
RUN ng build --prod

FROM nginx
# Cleaning default nginx
RUN rm -rf /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

## Copy our default nginx config
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=build /web/dist/corona-app /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

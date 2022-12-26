FROM node:16.13.1 as build
WORKDIR /app
COPY . ./
# COPY package.json ./
# COPY yarn.lock ./
# RUN yarn install --frozen-lockfile
# RUN yarn build
RUN ls

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8081

CMD ["nginx", "-g", "daemon off;"]
# FROM node:16.10.0 as build
# WORKDIR /lit-clothing

# COPY package*.json ./
# RUN npm install
# COPY . .

# RUN npm run build
# FROM nginx:1.19
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# COPY --from=build /lit-clothing/build /usr/share/nginx/html

FROM node:14-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
# COPY yarn.lock .
RUN yarn install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "yarn", "start" ]
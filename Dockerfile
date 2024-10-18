FROM node:20.15.0-alpine AS base
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser -S user
RUN chown -R user /opt/app
COPY package*.json ./

# DEVELOPMENT APP PROFILE
FROM base AS development
RUN npm install && npm cache clean --force
COPY . ./
USER user
EXPOSE 9229
CMD ["sh"]

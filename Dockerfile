###############################################
# BASE IMAGE
###############################################
FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

###############################################
# DEVELOPMENT IMAGE
###############################################
FROM base AS development

# Install ALL dependencies (dev included)
RUN npm install

# Copy full project
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]


###############################################
# BUILD IMAGE
###############################################
FROM base AS build

# Install only production deps
RUN npm install --only=production

# Copy full project
COPY . .

# Build NestJS dist
RUN npm run build


###############################################
# PRODUCTION RUNTIME
###############################################
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Copy built app + production node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]
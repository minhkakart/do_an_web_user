# base image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy rest of the project
COPY . .

# Build app
RUN yarn build

# Expose default Next.js port
EXPOSE 5258

# Start app in production mode
CMD ["yarn", "start", "-p", "5258"]
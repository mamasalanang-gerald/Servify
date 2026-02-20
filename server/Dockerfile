FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install with increased timeout and retry logic
RUN npm config set fetch-timeout 120000 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 120000

RUN npm ci --omit=dev || npm install

COPY . .

# Set default environment variables for testing
ENV PORT=3000
ENV NODE_ENV=development

EXPOSE 3000

CMD ["node", "index.js"]

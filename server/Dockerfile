FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set default environment variables for testing
ENV PORT=3000
ENV NODE_ENV=development

EXPOSE 3000

CMD ["node", "index.js"]

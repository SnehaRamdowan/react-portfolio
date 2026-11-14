FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --verbose --no-audit --no-fund --fetch-retries=1 --fetch-timeout=30000

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

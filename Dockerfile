FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev jest ts-jest @types/jest

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start:prod"]

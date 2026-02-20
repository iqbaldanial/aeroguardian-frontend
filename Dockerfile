FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
# Nuxt 4 uses the output folder to run the server
CMD ["node", ".output/server/index.mjs"]
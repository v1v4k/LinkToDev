# Stage 1 — install dependencies
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2 — runner
FROM node:22-alpine AS runner
WORKDIR /app

# Copy dependencies from stage 1
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY src ./src
COPY package*.json ./

# Create logs directory and assign ownership to node user
RUN mkdir -p logs \
    && chown -R node:node /app

USER node

EXPOSE 4444

CMD ["node", "src/app.js"]
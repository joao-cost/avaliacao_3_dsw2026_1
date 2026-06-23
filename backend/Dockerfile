FROM oven/bun:alpine
WORKDIR /app
COPY backend/package.json backend/bun.lock ./backend/
RUN cd backend && bun install --frozen-lockfile
COPY backend/ ./backend/
COPY frontend/ ./frontend/
EXPOSE 3000
WORKDIR /app/backend
CMD ["bun", "src/server.js"]

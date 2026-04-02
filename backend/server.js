// backend/server.js
// Кастомный сервер на базе json-server + express middleware
// Добавляет: хэширование паролей, проверку авторизации

const jsonServer = require("json-server");
const crypto = require("crypto");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ─── Утилита: SHA-256 хэш пароля ─────────────────────────────────────────────
// В реальном проекте используй bcrypt. Здесь SHA-256 — достаточно для учёбы.
// npm install bcryptjs → bcrypt.hash(password, 10)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// ─── POST /register ───────────────────────────────────────────────────────────
server.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  const db = router.db; // lowdb инстанс
  const existing = db.get("users").find({ email }).value();

  if (existing) {
    return res.status(409).json({ error: "Email уже зарегистрирован" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Пароль минимум 6 символов" });
  }

  const newUser = {
    id: Date.now(),
    email,
    password: hashPassword(password), // сохраняем ХЭШ, не открытый пароль
    role: "user",
    createdAt: new Date().toISOString().slice(0, 10),
  };

  db.get("users").push(newUser).write();

  // Возвращаем пользователя БЕЗ пароля
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// ─── POST /login ──────────────────────────────────────────────────────────────
server.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  const db = router.db;
  const user = db.get("users").find({ email }).value();

  if (!user) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  // Сравниваем хэши
  if (user.password !== hashPassword(password)) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  // Возвращаем пользователя БЕЗ хэша пароля
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// ─── Middleware: скрыть поле password в ответах /users ───────────────────────
server.use((req, res, next) => {
  if (req.path.startsWith("/users")) {
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (Array.isArray(data)) {
        return originalJson(data.map(({ password, ...u }) => u));
      }
      if (data && data.password) {
        const { password, ...rest } = data;
        return originalJson(rest);
      }
      return originalJson(data);
    };
  }
  next();
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server запущен на http://localhost:${PORT}`);
  console.log("Эндпоинты:");
  console.log("  POST /register  — регистрация");
  console.log("  POST /login     — вход");
  console.log("  GET  /categories");
  console.log("  GET  /expenses?userId=1");
  console.log("  POST /expenses");
  console.log("  PUT  /expenses/:id");
  console.log("  DELETE /expenses/:id");
});

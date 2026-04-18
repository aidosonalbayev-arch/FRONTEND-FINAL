const jsonServer = require("json-server");
const crypto = require("crypto");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

server.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  const db = router.db;
  const existing = db.get("users").find({ email }).value();

  if (existing) {
    return res.status(400).json({ error: "Email уже зарегистрирован" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Пароль минимум 6 символов" });
  }

  const newUser = {
    id: Date.now(),
    email,
    password: hashPassword(password),
    role: "user",
    createdAt: new Date().toISOString().slice(0, 10),
  };

  db.get("users").push(newUser).write();

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

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

  if (user.password !== hashPassword(password)) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

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
  console.log("  POST /register  — регистрация");
  console.log("  POST /login     — вход");
  console.log("  GET  /categories");
  console.log("  GET  /expenses?userId=1");
  console.log("  POST /expenses");
  console.log("  PUT  /expenses/:id");
  console.log("  DELETE /expenses/:id");
});

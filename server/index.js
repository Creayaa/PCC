import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, "db.json");

const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { users: [], ads: [], matrimony: [], chats: [] });

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// ---- INIT ----
await db.read();
if (!db.data) db.data = { users: [], ads: [], matrimony: [], chats: [] };

// ---------- AUTH ----------
app.post("/auth/send-otp", (req, res) => res.json({ ok: true }));

app.post("/auth/verify-otp", (req, res) => {
  const { phone, code } = req.body;
  if (code !== "123456") return res.json({ ok: false });
  const user = db.data.users.find((u) => u.phone === phone);
  res.json({ ok: true, exists: !!user, user: user || null });
});

app.post("/auth/register", async (req, res) => {
  const user = { id: Date.now(), ...req.body };
  db.data.users.push(user);
  await db.write();
  res.json({ user });
});

// ---------- USERS ----------
app.get("/users", async (req, res) => {
  await db.read();
  res.json(db.data.users);
});

// ---------- ADS ----------
app.get("/ads", async (req, res) => {
  await db.read();
  res.json(db.data.ads);
});

app.post("/ads", async (req, res) => {
  const ad = { id: Date.now(), ...req.body };
  db.data.ads.push(ad);
  await db.write();
  io.emit("newAd", ad);
  res.json(ad);
});

// ---------- MATRIMONY ----------
app.get("/matrimony", async (req, res) => {
  await db.read();
  res.json(db.data.matrimony);
});

app.post("/matrimony", async (req, res) => {
  const profile = { id: Date.now(), ...req.body };
  db.data.matrimony.push(profile);
  await db.write();
  io.emit("newMatrimony", profile);
  res.json(profile);
});

// ---------- CHATS ----------
app.get("/chats", async (req, res) => {
  await db.read();
  db.data.chats.forEach((c) => {
    const u1 = db.data.users.find((u) => u.id == c.user1);
    const u2 = db.data.users.find((u) => u.id == c.user2);
    if (u1 && !c.user1Name) c.user1Name = `${u1.firstName} ${u1.lastName}`.trim();
    if (u2 && !c.user2Name) c.user2Name = `${u2.firstName} ${u2.lastName}`.trim();
  });
  await db.write();
  res.json(db.data.chats);
});

// Create or reuse chat between two users
app.post("/chats", async (req, res) => {
  const { user1, user2 } = req.body;
  await db.read();

  const u1 = db.data.users.find((u) => u.id == user1);
  const u2 =
    db.data.users.find((u) => u.id == user2) ||
    db.data.users.find(
      (u) =>
        `${u.firstName} ${u.lastName}`.trim().toLowerCase() ===
        String(user2).trim().toLowerCase()
    );

  if (!u1 || !u2) return res.status(400).json({ error: "User(s) not found" });

  let chat = db.data.chats.find(
    (c) =>
      (c.user1 === u1.id && c.user2 === u2.id) ||
      (c.user1 === u2.id && c.user2 === u1.id)
  );

  if (!chat) {
    chat = {
      id: Date.now(),
      user1: u1.id,
      user2: u2.id,
      user1Name: `${u1.firstName} ${u1.lastName}`.trim(),
      user2Name: `${u2.firstName} ${u2.lastName}`.trim(),
      messages: [],
    };
    db.data.chats.push(chat);
    await db.write();
  }

  io.emit("chatUpdated", { chatId: chat.id, chat });
  res.json(chat);
});

// ---------- SOCKET.IO ----------
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("join", (chatId) => {
    socket.join(String(chatId));
    console.log(`👥 Joined chat room ${chatId}`);
  });

  socket.on("sendMessage", async (msg) => {
    const { chatId, senderId, senderName, text } = msg;
    await db.read();

    const chat = db.data.chats.find((c) => c.id == chatId);
    if (!chat) return;

    const message = {
      id: Date.now(),
      chatId: Number(chatId),
      senderId,
      senderName,
      text,
      timestamp: new Date().toISOString(),
    };

    chat.messages.push(message);
    await db.write();

    // ✅ Broadcast to participants
    io.to(String(chatId)).emit("message", message);

    // ✅ Update all chat lists
    io.emit("chatUpdated", { chatId, chat });
  });

  socket.on("disconnect", () => console.log("🔴 Client disconnected:", socket.id));
});

server.listen(4000, () =>
  console.log("✅ Server running on http://localhost:4000")
);

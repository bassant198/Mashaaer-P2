import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { STORY_SCENES } from './src/data/storyData';
import { INITIAL_ACHIEVEMENTS, INITIAL_INVENTORY_ITEMS } from './src/data/gameAssets';
import { RoomState, SafeRoomState, PlayerSlot, RoomAnswer } from './src/types/game';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent disk storage
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const ROOMS_FILE = path.resolve(DATA_DIR, 'rooms.json');

// In-memory active rooms & SSE subscribers
const rooms = new Map<string, RoomState>();
const sseClients = new Map<string, Set<{ res: Response; playerId: string }>>();

// Load saved rooms from disk
function loadRoomsFromDisk() {
  try {
    if (fs.existsSync(ROOMS_FILE)) {
      const data = fs.readFileSync(ROOMS_FILE, 'utf-8');
      const loaded = JSON.parse(data);
      Object.entries(loaded).forEach(([code, room]) => {
        rooms.set(code, room as RoomState);
      });
      console.log(`Loaded ${rooms.size} rooms from storage.`);
    }
  } catch (err) {
    console.error('Failed to load rooms from storage:', err);
  }
}

// Save rooms to disk atomically
function saveRoomsToDisk() {
  try {
    const obj: Record<string, RoomState> = {};
    rooms.forEach((val, key) => {
      obj[key] = val;
    });
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save rooms to storage:', err);
  }
}

loadRoomsFromDisk();

// Broadcast SSE updates to room listeners
function broadcastRoomUpdate(roomCode: string) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const clients = sseClients.get(roomCode);
  if (!clients || clients.size === 0) return;

  clients.forEach(client => {
    try {
      const safeState = getSafeRoomState(room, client.playerId);
      client.res.write(`data: ${JSON.stringify({ state: safeState })}\n\n`);
    } catch {
      // Client connection dropped
    }
  });
}

// Sanitize room state so unrevealed answers are NEVER exposed to the other player
function getSafeRoomState(room: RoomState, playerId: string): SafeRoomState {
  let mySlot: PlayerSlot | null = null;
  let myName: string | null = null;
  let partnerName: string | null = null;
  let partnerConnected = false;

  if (room.players.p1 && room.players.p1.id === playerId) {
    mySlot = 'p1';
    myName = room.players.p1.name;
    if (room.players.p2) {
      partnerName = room.players.p2.name;
      partnerConnected = room.players.p2.connected;
    }
  } else if (room.players.p2 && room.players.p2.id === playerId) {
    mySlot = 'p2';
    myName = room.players.p2.name;
    if (room.players.p1) {
      partnerName = room.players.p1.name;
      partnerConnected = room.players.p1.connected;
    }
  }

  // Mask unrevealed answers
  const safeAnswers: SafeRoomState['answers'] = {};
  Object.entries(room.answers).forEach(([sceneId, ans]) => {
    const isRevealed = ans.status === 'revealed';
    let safeP1Answer: string | null = null;
    let safeP2Answer: string | null = null;

    if (isRevealed) {
      safeP1Answer = ans.p1Answer;
      safeP2Answer = ans.p2Answer;
    } else {
      // Only show current player their own answer
      if (mySlot === 'p1') {
        safeP1Answer = ans.p1Answer;
        safeP2Answer = null; // Strictly hidden
      } else if (mySlot === 'p2') {
        safeP1Answer = null; // Strictly hidden
        safeP2Answer = ans.p2Answer;
      }
    }

    safeAnswers[sceneId] = {
      sceneId: ans.sceneId,
      p1Submitted: ans.p1Submitted,
      p2Submitted: ans.p2Submitted,
      p1Answer: safeP1Answer,
      p2Answer: safeP2Answer,
      status: ans.status,
      narrativeReaction: ans.narrativeReaction,
      pointsAwarded: ans.pointsAwarded,
    };
  });

  return {
    ...room,
    answers: safeAnswers,
    mySlot,
    myName,
    partnerName,
    partnerConnected,
  };
}

// Generate memorable 4-6 letter romantic room codes
const ROMANTIC_WORDS = ['QAMAR', 'NOUR', 'WARD', 'SHAMS', 'HAYA', 'ROSE', 'SAHR', 'NAJMA', 'MASHAR', 'GHRAM'];
function generateRoomCode(): string {
  const base = ROMANTIC_WORDS[Math.floor(Math.random() * ROMANTIC_WORDS.length)];
  const num = Math.floor(10 + Math.random() * 90);
  const code = `${base}${num}`;
  if (rooms.has(code)) {
    return generateRoomCode();
  }
  return code;
}

// ==========================================
// API ROUTES
// ==========================================

// Create Room
app.post('/api/rooms/create', (req: Request, res: Response): void => {
  const { playerName = 'بسنت' } = req.body;
  const roomCode = generateRoomCode();
  const roomId = crypto.randomUUID();
  const playerId = crypto.randomUUID();

  const newRoom: RoomState = {
    roomId,
    roomCode,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    currentChapterId: 1,
    currentSceneId: 'c1_s1',
    status: 'waiting_for_partner',
    players: {
      p1: {
        id: playerId,
        name: playerName || 'بسنت',
        slot: 'p1',
        connected: true,
        lastActive: Date.now(),
      },
      p2: null,
    },
    answers: {
      'c1_s1': {
        sceneId: 'c1_s1',
        p1Answer: null,
        p2Answer: null,
        p1Submitted: false,
        p2Submitted: false,
        p1SubmittedAt: null,
        p2SubmittedAt: null,
        status: 'waiting',
      },
    },
    inventory: [],
    achievements: [],
    messages: [],
    decisions: {},
    points: 0,
  };

  rooms.set(roomCode, newRoom);
  saveRoomsToDisk();

  res.json({
    roomCode,
    player: {
      id: playerId,
      name: newRoom.players.p1!.name,
      slot: 'p1',
    },
    state: getSafeRoomState(newRoom, playerId),
  });
});

// Join Room
app.post('/api/rooms/join', (req: Request, res: Response): void => {
  const { roomCode, playerName = 'عمرو' } = req.body;
  if (!roomCode) {
    res.status(400).json({ error: 'كود الغرفة مطلوب.' });
    return;
  }

  const code = roomCode.trim().toUpperCase();
  const room = rooms.get(code);

  if (!room) {
    res.status(404).json({ error: 'لم يتم العثور على الغرفة. تأكد من صحة الكود.' });
    return;
  }

  // Check if slot 2 is available
  if (room.players.p2) {
    res.status(403).json({ error: 'عفواً، هذه الغرفة ممتلئة بالفعل بلاعبين.' });
    return;
  }

  const playerId = crypto.randomUUID();
  room.players.p2 = {
    id: playerId,
    name: playerName || 'عمرو',
    slot: 'p2',
    connected: true,
    lastActive: Date.now(),
  };

  room.status = 'ready';
  room.updatedAt = Date.now();

  saveRoomsToDisk();
  broadcastRoomUpdate(code);

  res.json({
    roomCode: code,
    player: {
      id: playerId,
      name: room.players.p2.name,
      slot: 'p2',
    },
    state: getSafeRoomState(room, playerId),
  });
});

// Reconnect to existing session
app.post('/api/rooms/:code/reconnect', (req: Request, res: Response): void => {
  const { code } = req.params;
  const { playerId } = req.body;
  const room = rooms.get(code.toUpperCase());

  if (!room) {
    res.status(404).json({ error: 'الغرفة غير موجودة.' });
    return;
  }

  if (room.players.p1 && room.players.p1.id === playerId) {
    room.players.p1.connected = true;
    room.players.p1.lastActive = Date.now();
  } else if (room.players.p2 && room.players.p2.id === playerId) {
    room.players.p2.connected = true;
    room.players.p2.lastActive = Date.now();
  } else {
    res.status(403).json({ error: 'رمز الجلسة غير صالح لهذه الغرفة.' });
    return;
  }

  room.updatedAt = Date.now();
  saveRoomsToDisk();
  broadcastRoomUpdate(code.toUpperCase());

  res.json({ state: getSafeRoomState(room, playerId) });
});

// Get room state
app.get('/api/rooms/:code/state', (req: Request, res: Response): void => {
  const { code } = req.params;
  const playerId = String(req.query.playerId || '');
  const room = rooms.get(code.toUpperCase());

  if (!room) {
    res.status(404).json({ error: 'الغرفة غير موجودة.' });
    return;
  }

  res.json({ state: getSafeRoomState(room, playerId) });
});

// SSE Real-time stream
app.get('/api/rooms/:code/stream', (req: Request, res: Response): void => {
  const code = req.params.code.toUpperCase();
  const playerId = String(req.query.playerId || '');
  const room = rooms.get(code);

  if (!room) {
    res.status(404).end();
    return;
  }

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
  });

  const client = { res, playerId };
  if (!sseClients.has(code)) {
    sseClients.set(code, new Set());
  }
  sseClients.get(code)!.add(client);

  // Send initial state immediately
  res.write(`data: ${JSON.stringify({ state: getSafeRoomState(room, playerId) })}\n\n`);

  // Heartbeat ping every 15s to prevent timeout
  const pingInterval = setInterval(() => {
    res.write(': ping\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(pingInterval);
    const clients = sseClients.get(code);
    if (clients) {
      clients.delete(client);
    }
  });
});

// Submit Private Answer
app.post('/api/rooms/:code/submit', (req: Request, res: Response): void => {
  const code = req.params.code.toUpperCase();
  const { playerId, sceneId, answer } = req.body;
  const room = rooms.get(code);

  if (!room) {
    res.status(404).json({ error: 'الغرفة غير موجودة.' });
    return;
  }

  let slot: PlayerSlot | null = null;
  if (room.players.p1 && room.players.p1.id === playerId) slot = 'p1';
  if (room.players.p2 && room.players.p2.id === playerId) slot = 'p2';

  if (!slot) {
    res.status(403).json({ error: 'غير مصرح لك بالإجابة في هذه الغرفة.' });
    return;
  }

  // Ensure answer record exists for scene
  if (!room.answers[sceneId]) {
    room.answers[sceneId] = {
      sceneId,
      p1Answer: null,
      p2Answer: null,
      p1Submitted: false,
      p2Submitted: false,
      p1SubmittedAt: null,
      p2SubmittedAt: null,
      status: 'waiting',
    };
  }

  const ans = room.answers[sceneId];

  // Prevent modifying an already revealed answer
  if (ans.status === 'revealed') {
    res.json({ state: getSafeRoomState(room, playerId) });
    return;
  }

  if (slot === 'p1') {
    ans.p1Answer = answer;
    ans.p1Submitted = true;
    ans.p1SubmittedAt = Date.now();
  } else {
    ans.p2Answer = answer;
    ans.p2Submitted = true;
    ans.p2SubmittedAt = Date.now();
  }

  // Record decisions for ending calculations
  room.decisions[`${sceneId}_${slot}`] = answer;

  // Check if BOTH players have submitted
  if (ans.p1Submitted && ans.p2Submitted) {
    ans.status = 'revealed';
    room.status = 'scene_revealed';

    const currentScene = STORY_SCENES[sceneId];
    if (currentScene) {
      // Determine reaction dialogue
      const match = ans.p1Answer === ans.p2Answer;
      let reaction = currentScene.revealDialogue.general;
      if (match && currentScene.revealDialogue.bothSame) {
        reaction = `${currentScene.revealDialogue.bothSame} — ${reaction}`;
      } else if (!match && currentScene.revealDialogue.divergent) {
        reaction = `${currentScene.revealDialogue.divergent} — ${reaction}`;
      }
      ans.narrativeReaction = reaction;
      ans.pointsAwarded = currentScene.points;
      room.points += currentScene.points;

      // Unlock inventory clue if specified and not already owned
      if (currentScene.rewardClueId) {
        const item = INITIAL_INVENTORY_ITEMS.find(i => i.id === currentScene.rewardClueId);
        if (item && !room.inventory.some(i => i.id === item.id)) {
          room.inventory.push({ ...item, discoveredAt: Date.now() });
        }
      }

      // Unlock achievement if specified and not already earned
      if (currentScene.rewardAchievementId) {
        const ach = INITIAL_ACHIEVEMENTS.find(a => a.id === currentScene.rewardAchievementId);
        if (ach && !room.achievements.some(a => a.id === ach.id)) {
          room.achievements.push({ ...ach, unlockedAt: Date.now() });
        }
      }
    }
  }

  room.updatedAt = Date.now();
  saveRoomsToDisk();
  broadcastRoomUpdate(code);

  res.json({ state: getSafeRoomState(room, playerId) });
});

// Send Private Letter
app.post('/api/rooms/:code/letter', (req: Request, res: Response): void => {
  const code = req.params.code.toUpperCase();
  const { playerId, content } = req.body;
  const room = rooms.get(code);

  if (!room) {
    res.status(404).json({ error: 'الغرفة غير موجودة.' });
    return;
  }

  let slot: PlayerSlot | null = null;
  let senderName = '';
  if (room.players.p1 && room.players.p1.id === playerId) {
    slot = 'p1';
    senderName = room.players.p1.name;
  } else if (room.players.p2 && room.players.p2.id === playerId) {
    slot = 'p2';
    senderName = room.players.p2.name;
  }

  if (!slot) {
    res.status(403).json({ error: 'غير مصرح لك بإرسال رسائل في هذه الغرفة.' });
    return;
  }

  // Update or append letter
  const existingIndex = room.messages.findIndex(m => m.senderSlot === slot);
  if (existingIndex >= 0) {
    room.messages[existingIndex].content = content;
    room.messages[existingIndex].createdAt = Date.now();
  } else {
    room.messages.push({
      id: crypto.randomUUID(),
      senderSlot: slot,
      senderName,
      content,
      createdAt: Date.now(),
      revealed: false,
    });
  }

  // If both players have sent letters, reveal them!
  const p1Msg = room.messages.find(m => m.senderSlot === 'p1');
  const p2Msg = room.messages.find(m => m.senderSlot === 'p2');
  if (p1Msg && p2Msg) {
    p1Msg.revealed = true;
    p2Msg.revealed = true;
  }

  room.updatedAt = Date.now();
  saveRoomsToDisk();
  broadcastRoomUpdate(code);

  res.json({ success: true, state: getSafeRoomState(room, playerId) });
});

// Advance to Next Scene
app.post('/api/rooms/:code/next', (req: Request, res: Response): void => {
  const code = req.params.code.toUpperCase();
  const { playerId } = req.body;
  const room = rooms.get(code);

  if (!room) {
    res.status(404).json({ error: 'الغرفة غير موجودة.' });
    return;
  }

  const currentScene = STORY_SCENES[room.currentSceneId];
  if (!currentScene) {
    res.status(400).json({ error: 'المشهد الحالي غير صالح.' });
    return;
  }

  if (currentScene.nextSceneId) {
    const nextScene = STORY_SCENES[currentScene.nextSceneId];
    if (nextScene) {
      room.currentSceneId = nextScene.id;
      room.currentChapterId = nextScene.chapterId;
      room.status = 'in_scene';

      // Initialize answer container for next scene
      if (!room.answers[nextScene.id]) {
        room.answers[nextScene.id] = {
          sceneId: nextScene.id,
          p1Answer: null,
          p2Answer: null,
          p1Submitted: false,
          p2Submitted: false,
          p1SubmittedAt: null,
          p2SubmittedAt: null,
          status: 'waiting',
        };
      }
    }
  } else {
    // Campaign Finale reached!
    room.status = 'game_finished';

    // Calculate personalized ending
    let adventureScore = 0;
    let heartScore = 0;
    let secretsScore = 0;

    Object.values(room.decisions).forEach(choice => {
      if (['curiosity', 'door_stars', 'sand_clock', 'path_tower', 'dream_travel', 'endless_talk'].includes(choice)) {
        adventureScore++;
      } else if (['romantic', 'door_warmth', 'coffee_mug', 'path_bridge', 'dream_home', 'pure_peace'].includes(choice)) {
        heartScore++;
      } else {
        secretsScore++;
      }
    });

    if (adventureScore >= heartScore && adventureScore >= secretsScore) {
      room.endingType = 'adventurers';
    } else if (heartScore >= adventureScore && heartScore >= secretsScore) {
      room.endingType = 'heart_mind';
    } else {
      room.endingType = 'little_secrets';
    }
  }

  room.updatedAt = Date.now();
  saveRoomsToDisk();
  broadcastRoomUpdate(code);

  res.json({ success: true, state: getSafeRoomState(room, playerId) });
});

// Reset / Replay Game
app.post('/api/rooms/:code/reset', (req: Request, res: Response): void => {
  const code = req.params.code.toUpperCase();
  const { playerId } = req.body;
  const room = rooms.get(code);

  if (!room) {
    res.status(404).json({ error: 'الغرفة غير موجودة.' });
    return;
  }

  room.currentChapterId = 1;
  room.currentSceneId = 'c1_s1';
  room.status = 'in_scene';
  room.points = 0;
  room.answers = {
    'c1_s1': {
      sceneId: 'c1_s1',
      p1Answer: null,
      p2Answer: null,
      p1Submitted: false,
      p2Submitted: false,
      p1SubmittedAt: null,
      p2SubmittedAt: null,
      status: 'waiting',
    },
  };
  room.updatedAt = Date.now();

  saveRoomsToDisk();
  broadcastRoomUpdate(code);

  res.json({ success: true, state: getSafeRoomState(room, playerId) });
});

// ==========================================
// VITE DEV SERVER OR STATIC PROD SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`مشاعر | Masha'aer Server running on port ${PORT}`);
  });
}

startServer();

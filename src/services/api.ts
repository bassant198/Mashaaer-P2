
import { SafeRoomState, PlayerSlot } from '../types/game';

const API_BASE = '/api/rooms';

export interface CreateRoomResponse {
  roomCode: string;
  player: {
    id: string;
    name: string;
    slot: PlayerSlot;
  };
  state: SafeRoomState;
}

export interface JoinRoomResponse {
  roomCode: string;
  player: {
    id: string;
    name: string;
    slot: PlayerSlot;
  };
  state: SafeRoomState;
}

async function readError(res: Response, fallback: string): Promise<Error> {
  const err = await res.json().catch(() => ({}));
  return new Error(err.error || fallback);
}

export async function createRoom(playerName: string): Promise<CreateRoomResponse> {
  const res = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName }),
  });

  if (!res.ok) {
    throw await readError(res, 'تعذر إنشاء الغرفة، يرجى المحاولة مرة أخرى.');
  }

  return res.json();
}

export async function joinRoom(
  roomCode: string,
  playerName: string
): Promise<JoinRoomResponse> {
  const res = await fetch(`${API_BASE}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roomCode: roomCode.trim().toUpperCase(),
      playerName,
    }),
  });

  if (!res.ok) {
    throw await readError(res, 'تعذر الانضمام للغرفة، تأكد من صحة الكود.');
  }

  return res.json();
}

export async function reconnectRoom(
  roomCode: string,
  playerId: string
): Promise<SafeRoomState> {
  const res = await fetch(
    `${API_BASE}/${encodeURIComponent(roomCode.trim().toUpperCase())}/reconnect`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    }
  );

  if (!res.ok) {
    throw await readError(res, 'تعذر استعادة الجلسة.');
  }

  const data = await res.json();
  return data.state;
}

export async function getRoomState(
  roomCode: string,
  playerId: string
): Promise<SafeRoomState> {
  const res = await fetch(
    `${API_BASE}/${encodeURIComponent(roomCode)}/state?playerId=${encodeURIComponent(playerId)}`
  );

  if (!res.ok) {
    throw await readError(res, 'تعذر جلب حالة اللعبة.');
  }

  const data = await res.json();
  return data.state;
}

export async function submitAnswer(
  roomCode: string,
  playerId: string,
  sceneId: string,
  answer: string
): Promise<{ state: SafeRoomState }> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(roomCode)}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, sceneId, answer }),
  });

  if (!res.ok) {
    throw await readError(res, 'تعذر إرسال الإجابة.');
  }

  return res.json();
}

export async function sendPrivateLetter(
  roomCode: string,
  playerId: string,
  content: string
): Promise<{ success: boolean; state: SafeRoomState }> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(roomCode)}/letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId, content }),
  });

  if (!res.ok) {
    throw await readError(res, 'تعذر إرسال الرسالة.');
  }

  return res.json();
}

export async function advanceToNextScene(
  roomCode: string,
  playerId: string
): Promise<{ success: boolean; state: SafeRoomState }> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(roomCode)}/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId }),
  });

  if (!res.ok) {
    throw await readError(res, 'تعذر الانتقال للمشهد التالي.');
  }

  return res.json();
}

export async function resetGame(
  roomCode: string,
  playerId: string
): Promise<{ success: boolean; state: SafeRoomState }> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(roomCode)}/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerId }),
  });

  if (!res.ok) {
    throw await readError(res, 'تعذر إعادة بدء الحكاية.');
  }

  return res.json();
}

/**
 * Subscribe to room updates using SSE with a polling fallback.
 * Polling is enabled only when SSE is unavailable.
 */
export function subscribeToRoom(
  roomCode: string,
  playerId: string,
  onUpdate: (state: SafeRoomState) => void,
  onConnectionChange: (connected: boolean) => void
): () => void {
  let cancelled = false;
  let eventSource: EventSource | null = null;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let requestInFlight = false;
  let lastStateSignature = '';

  const publishState = (state: SafeRoomState) => {
    if (cancelled) return;

    let signature: string;
    try {
      signature = JSON.stringify(state);
    } catch {
      onUpdate(state);
      return;
    }

    if (signature === lastStateSignature) return;

    lastStateSignature = signature;
    onUpdate(state);
  };

  const stopPolling = () => {
    if (pollTimer !== null) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };

  const pollOnce = async () => {
    if (cancelled || requestInFlight) return;

    requestInFlight = true;

    try {
      const state = await getRoomState(roomCode, playerId);

      if (!cancelled) {
        publishState(state);
        onConnectionChange(true);
      }
    } catch {
      if (!cancelled) {
        onConnectionChange(false);
      }
    } finally {
      requestInFlight = false;
    }
  };

  const startPolling = () => {
    if (cancelled || pollTimer !== null) return;

    void pollOnce();
    pollTimer = setInterval(() => {
      void pollOnce();
    }, 2000);
  };

  try {
    const url =
      `${API_BASE}/${encodeURIComponent(roomCode)}/stream` +
      `?playerId=${encodeURIComponent(playerId)}`;

    eventSource = new EventSource(url);

    eventSource.onopen = () => {
      if (cancelled) return;

      onConnectionChange(true);
      stopPolling();
    };

    eventSource.onmessage = (event: MessageEvent<string>) => {
      if (cancelled) return;

      try {
        const payload = JSON.parse(event.data);
        if (payload?.state) {
          publishState(payload.state as SafeRoomState);
        }
      } catch (error) {
        console.error('SSE message parsing failed:', error);
      }
    };

    eventSource.onerror = () => {
      if (cancelled) return;

      onConnectionChange(false);

      // Let EventSource attempt to reconnect; use polling as a fallback.
      startPolling();
    };
  } catch {
    startPolling();
  }

  // Fetch the latest state when the subscription begins.
  void pollOnce();

  return () => {
    cancelled = true;
    stopPolling();

    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}

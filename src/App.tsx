import React, { useState, useEffect, useCallback } from 'react';
import { StarBackground } from './components/StarBackground';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CreateRoomModal } from './components/CreateRoomModal';
import { JoinRoomModal } from './components/JoinRoomModal';
import { WaitingRoomView } from './components/WaitingRoomView';
import { ChapterMapView } from './components/ChapterMapView';
import { SceneView } from './components/SceneView';
import { RevealView } from './components/RevealView';
import { InventoryModal } from './components/InventoryModal';
import { AchievementsModal } from './components/AchievementsModal';
import { MemoryBoxModal } from './components/MemoryBoxModal';
import { EndingScreen } from './components/EndingScreen';
import { STORY_SCENES } from './data/storyData';
import { SafeRoomState } from './types/game';
import { 
  createRoom, 
  joinRoom, 
  reconnectRoom, 
  subscribeToRoom, 
  submitAnswer, 
  sendPrivateLetter, 
  advanceToNextScene, 
  resetGame 
} from './services/api';
import { saveSession, loadSession, clearSession } from './services/session';
import { soundManager } from './services/audio';
import { AlertCircle, WifiOff } from 'lucide-react';

export default function App() {
  const [roomState, setRoomState] = useState<SafeRoomState | null>(null);
  const [activeModal, setActiveModal] = useState<'create' | 'join' | 'map' | 'inventory' | 'achievements' | 'memory' | null>(null);
  const [modalInitialCode, setModalInitialCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  // Check URL query parameters for direct invite links: ?room=CODE
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');
      if (urlRoom && !roomState) {
        setModalInitialCode(urlRoom.toUpperCase());
        setActiveModal('join');
      }
    } catch {
      // Ignore
    }
  }, []);

  // Restore saved session from localStorage on initial boot
  useEffect(() => {
    const saved = loadSession();
    if (saved && !roomState) {
      reconnectRoom(saved.roomCode, saved.playerId)
        .then((state) => {
          setRoomState(state);
          setIsConnected(true);
        })
        .catch(() => {
          // If session expired or invalid on server, clear local cache
          clearSession();
        });
    }
  }, []);

  // Subscribe to real-time room updates via SSE & resilient polling fallback
  useEffect(() => {
    if (!roomState?.roomCode) return;

    const saved = loadSession();
    const playerId = saved?.playerId || roomState.players.p1?.id || '';
    if (!playerId) return;

    const unsubscribe = subscribeToRoom(
      roomState.roomCode,
      playerId,
      (updatedState) => {
        setRoomState(updatedState);
      },
      (connected) => {
        setIsConnected(connected);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [roomState?.roomCode]);

  // Handle Room Creation
  const handleCreateRoom = async (playerName: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await createRoom(playerName);
      saveSession({
        roomCode: res.roomCode,
        playerId: res.player.id,
        playerSlot: res.player.slot,
        playerName: res.player.name,
      });
      setRoomState(res.state);
      setActiveModal(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء الغرفة.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Room Join
  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await joinRoom(roomCode, playerName);
      saveSession({
        roomCode: res.roomCode,
        playerId: res.player.id,
        playerSlot: res.player.slot,
        playerName: res.player.name,
      });
      setRoomState(res.state);
      setActiveModal(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الانضمام للغرفة.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const enabled = soundManager.toggleSound();
    setSoundEnabled(enabled);
  };

  // Submit Answer
  const handleSubmitAnswer = async (answer: string) => {
    if (!roomState) return;
    const saved = loadSession();
    const playerId = saved?.playerId;
    if (!playerId) return;

    setIsSubmitting(true);
    try {
      const res = await submitAnswer(roomState.roomCode, playerId, roomState.currentSceneId, answer);
      setRoomState(res.state);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ الإجابة، يرجى المحاولة مرة أخرى.';
      console.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send Private Letter in Chapter 4 Scene 4
  const handleSendLetter = async (content: string) => {
    if (!roomState) return;
    const saved = loadSession();
    const playerId = saved?.playerId;
    if (!playerId) return;

    try {
      const res = await sendPrivateLetter(roomState.roomCode, playerId, content);
      setRoomState(res.state);
    } catch (err) {
      console.error('Failed to send letter:', err);
    }
  };

  // Advance to Next Scene
  const handleNextScene = async () => {
    if (!roomState) return;
    const saved = loadSession();
    const playerId = saved?.playerId;
    if (!playerId) return;

    setIsAdvancing(true);
    try {
      const res = await advanceToNextScene(roomState.roomCode, playerId);
      setRoomState(res.state);
    } catch (err) {
      console.error('Failed to advance scene:', err);
    } finally {
      setIsAdvancing(false);
    }
  };

  // Reset Game
  const handleResetGame = async () => {
    if (!roomState) return;
    const saved = loadSession();
    const playerId = saved?.playerId;
    if (!playerId) return;

    try {
      const res = await resetGame(roomState.roomCode, playerId);
      setRoomState(res.state);
    } catch (err) {
      console.error('Failed to reset game:', err);
    }
  };

  // Go back to home view without destroying active session
  const handleGoHome = () => {
    soundManager.playClick();
    setActiveModal(null);
  };

  // Determine which game view to render
  const renderCurrentView = () => {
    if (!roomState) {
      const saved = loadSession();
      return (
        <HomeView
          onStartCreate={() => {
            setErrorMsg(null);
            setActiveModal('create');
          }}
          onStartJoin={() => {
            setErrorMsg(null);
            setModalInitialCode('');
            setActiveModal('join');
          }}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          savedRoomCode={saved?.roomCode}
          onResumeGame={() => {
            if (saved) {
              reconnectRoom(saved.roomCode, saved.playerId).then(setRoomState);
            }
          }}
        />
      );
    }

    // 1. Waiting room if second player has not connected yet
    if (roomState.status === 'waiting_for_partner') {
      return (
        <WaitingRoomView
          roomState={roomState}
          onStartGame={() => handleNextScene()}
        />
      );
    }

    // 2. Waiting room ready state (both connected, waiting to start)
    if (roomState.status === 'ready') {
      return (
        <WaitingRoomView
          roomState={roomState}
          onStartGame={() => handleNextScene()}
        />
      );
    }

    // 3. Campaign Finale reached!
    if (roomState.status === 'game_finished') {
      return (
        <EndingScreen
          roomState={roomState}
          onResetGame={handleResetGame}
          onOpenMemoryBox={() => setActiveModal('memory')}
        />
      );
    }

    // 4. In active scene
    const currentScene = STORY_SCENES[roomState.currentSceneId] || STORY_SCENES['c1_s1'];
    const currentAnswer = roomState.answers[currentScene.id];
    const isRevealed = currentAnswer?.status === 'revealed' || roomState.status === 'scene_revealed';

    if (isRevealed) {
      return (
        <RevealView
          scene={currentScene}
          roomState={roomState}
          onNextScene={handleNextScene}
          isAdvancing={isAdvancing}
        />
      );
    }

    return (
      <SceneView
        scene={currentScene}
        roomState={roomState}
        onSubmitAnswer={handleSubmitAnswer}
        onSendLetter={handleSendLetter}
        isSubmitting={isSubmitting}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#211A20] text-[#F6E9D7] flex flex-col relative overflow-x-hidden selection:bg-[#9B7A88]/30 font-sans">
      {/* Visual Stars & Mood Canvas */}
      <StarBackground />

      {/* Main App Header */}
      <Header
        roomState={roomState}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenInventory={() => setActiveModal('inventory')}
        onOpenAchievements={() => setActiveModal('achievements')}
        onOpenMemoryBox={() => setActiveModal('memory')}
        onOpenMap={() => setActiveModal('map')}
        onGoHome={handleGoHome}
      />

      {/* Disconnection Banner (if connection drops temporarily) */}
      {!isConnected && roomState && (
        <div className="z-30 bg-amber-950/80 border-b border-amber-500/30 px-3 py-1.5 text-center text-xs text-amber-200 flex items-center justify-center gap-1.5 animate-pulse">
          <WifiOff size={13} />
          <span>الاتصال اتقطع مؤقتاً، بنحاول نرجعك للعبة تلقائياً...</span>
        </div>
      )}

      {/* Main Dynamic View Area */}
      <main className="flex-1 flex flex-col items-center justify-center pb-12 w-full">
        {renderCurrentView()}
      </main>

      {/* Modals */}
      <CreateRoomModal
        isOpen={activeModal === 'create'}
        onClose={() => setActiveModal(null)}
        onCreate={handleCreateRoom}
        isLoading={isLoading}
        error={errorMsg}
      />

      <JoinRoomModal
        isOpen={activeModal === 'join'}
        onClose={() => setActiveModal(null)}
        onJoin={handleJoinRoom}
        isLoading={isLoading}
        error={errorMsg}
        initialCode={modalInitialCode}
      />

      <ChapterMapView
        isOpen={activeModal === 'map'}
        onClose={() => setActiveModal(null)}
        roomState={roomState}
      />

      <InventoryModal
        isOpen={activeModal === 'inventory'}
        onClose={() => setActiveModal(null)}
        roomState={roomState}
      />

      <AchievementsModal
        isOpen={activeModal === 'achievements'}
        onClose={() => setActiveModal(null)}
        roomState={roomState}
      />

      <MemoryBoxModal
        isOpen={activeModal === 'memory'}
        onClose={() => setActiveModal(null)}
        roomState={roomState}
      />
    </div>
  );
}

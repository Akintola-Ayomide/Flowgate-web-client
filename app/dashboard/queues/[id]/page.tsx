"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useRouter, useParams } from "next/navigation";
import { 
  Loader2, AlertTriangle, ArrowLeft, Play, Pause, 
  EllipsisVertical, RefreshCw, Users, Camera, Plus, 
  Sparkles, X, AlertCircle, CheckCircle2, ArrowUpCircle, Trash2
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { queueApi, Queue, QueueEntry } from "@/features/Queue/services/queue.api";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ManageQueuePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const queueId = Number(id);

  const [queue, setQueue] = useState<Queue | null>(null);
  const [participants, setParticipants] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServing, setIsServing] = useState(false);
  const [queueActive, setQueueActive] = useState(true);
  const [isDeletingQueue, setIsDeletingQueue] = useState(false);
  const socketRef = useRef<any>(null);

  // Modals / Overlays states
  const [showScanner, setShowScanner] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [prioritizingEntry, setPrioritizingEntry] = useState<QueueEntry | null>(null);
  const [targetPosition, setTargetPosition] = useState<number>(1);

  // Scanner states
  const [cameraActive, setCameraActive] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Walk-in guest states
  const [guestName, setGuestName] = useState("");
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [addGuestError, setAddGuestError] = useState<string | null>(null);

  // Initial data fetch
  const fetchData = async () => {
    if (isNaN(queueId)) return;
    try {
      const [queueData, participantsData] = await Promise.all([
        queueApi.getQueue(queueId),
        queueApi.getParticipants(queueId),
      ]);
      setQueue(queueData);
      setQueueActive(queueData.status === "active");
      setParticipants(participantsData);
    } catch (e) {
      console.warn("Failed to load queue data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [queueId]);

  // Socket for real‑time updates
  useEffect(() => {
    if (isNaN(queueId)) return;
    // Connect directly to the backend WebSocket server.
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;
    socket.emit("joinQueueRoom", { queueId });

    socket.on("queueShifted", fetchData);
    socket.on("nextServed", fetchData);
    socket.on("userPrioritized", fetchData);
    socket.on("userJoined", fetchData);
    socket.on("userLeft", fetchData);
    socket.on("queueStatusChanged", fetchData);
    // If this queue gets deleted (e.g. from another tab), go back to list.
    socket.on("queueDeleted", () => {
      router.replace('/dashboard/queues');
    });

    return () => {
      socket.disconnect();
    };
  }, [queueId]);

  const toggleQueueStatus = async () => {
    if (!queue) return;
    const newStatus = !queueActive;
    try {
      await queueApi.updateStatus(queue.id, newStatus ? "active" : "paused");
      setQueueActive(newStatus);
    } catch (e) {
      alert("Failed to update queue status");
    }
  };

  const handleServeNext = async () => {
    if (!queue) return;
    setIsServing(true);
    try {
      await queueApi.serveNext(queue.id);
    } catch (e) {
      alert("Failed to serve next user");
    } finally {
      setIsServing(false);
    }
  };

  const handlePrioritizeUser = async (userId: number, pos: number) => {
    if (!queue) return;
    try {
      await queueApi.prioritizeUser(queue.id, userId, pos);
      setPrioritizingEntry(null);
      fetchData(); // Trigger manual refresh in case socket takes time
    } catch (e) {
      alert("Failed to prioritize user");
    }
  };

  const handleDeleteQueue = async () => {
    if (!queue) return;
    if (!confirm(`Are you sure you want to permanently delete "${queue.name}"? This cannot be undone and all participants will be removed.`)) return;
    setIsDeletingQueue(true);
    try {
      await queueApi.deleteQueue(queue.id);
      router.replace('/dashboard/queues');
    } catch (e: any) {
      alert(e.message || 'Failed to delete queue.');
      setIsDeletingQueue(false);
    }
  };

  // Walk-in Guest register & join flow
  const handleAddGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setIsAddingGuest(true);
    setAddGuestError(null);

    try {
      // 1. Backend Guest register
      const response = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: guestName.trim() }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to register walk-in guest user.");
      }
      
      const guestData = await response.json();

      // 2. Join queue using guest token in Bearer Auth header
      const joinResponse = await fetch("/api/queues/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${guestData.accessToken}`
        },
        body: JSON.stringify({ queueId }),
      });

      if (!joinResponse.ok) {
        throw new Error("Failed to join guest to queue.");
      }

      setGuestName("");
      setShowAddGuest(false);
      fetchData();
    } catch (err: any) {
      setAddGuestError(err.message || "Failed to add guest.");
    } finally {
      setIsAddingGuest(false);
    }
  };

  // Camera scanner actions
  const startCamera = async () => {
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Failed to get camera access", err);
      alert("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleOpenScanner = () => {
    setShowScanner(true);
    setScanResult(null);
    setTokenInput("");
  };

  const handleCloseScanner = () => {
    stopCamera();
    setShowScanner(false);
  };

  const handleVerifyToken = async (token: string) => {
    if (!token.trim()) return;
    setIsVerifyingToken(true);
    setScanResult(null);
    try {
      const result = await queueApi.verifyQr(token);
      setScanResult({
        success: true,
        message: `Verify Success! Participant: ${result.user?.name || `ID #${result.userId}`} is at Position #${result.position} in the queue.`
      });
      fetchData();
    } catch (err: any) {
      setScanResult({
        success: false,
        message: err.message || "Ticket verification failed. Code is invalid or expired."
      });
    } finally {
      setIsVerifyingToken(false);
    }
  };

  const handleSimulateScan = () => {
    if (participants.length > 0) {
      // Simulate with the first user waiting
      const firstUser = participants[0];
      handleVerifyToken(firstUser.qrCodeToken);
    } else {
      setScanResult({
        success: false,
        message: "No participants currently waiting in the queue to simulate verification."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background p-4 text-center">
        <AlertTriangle className="h-12 w-12 text-accent mb-4" />
        <h1 className="text-xl font-display font-bold text-foreground mb-1">Queue Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">The queue you are looking for might have been deleted or does not exist.</p>
        <Button onClick={() => router.back()} variant="secondary" size="default">
          Go Back
        </Button>
      </div>
    );
  }

  const activeCount = participants.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()} 
            className="mr-3.5 rounded-md bg-secondary border border-border p-2 text-foreground hover:bg-background transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground tracking-tight">Manage Queue</h1>
            <p className="text-muted-foreground text-xs font-medium mt-0.5">Control live participation, verify tickets, and add walk-in users.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-0 ml-12">
          <Button 
            onClick={handleOpenScanner} 
            variant="secondary" 
            className="gap-2 text-xs font-bold uppercase shrink-0"
          >
            <Camera className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline">Verify QR Ticket</span>
            <span className="sm:hidden">Verify</span>
          </Button>
          <Button 
            onClick={() => { setShowAddGuest(true); setAddGuestError(null); }} 
            className="gap-2 text-xs font-bold uppercase shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Walk-in</span>
            <span className="sm:hidden">Walk-in</span>
          </Button>
        </div>
      </div>

      {/* Meta Card */}
      <div className="rounded-md bg-background p-6 border border-border/80 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.1] pointer-events-none" />
        <div className="flex justify-between items-start border-b border-border/60 pb-4 mb-5 relative z-10">
          <div>
            <h2 className="text-lg font-display font-bold text-foreground tracking-tight">{queue.name}</h2>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">ID: {queue.id}</p>
            {queue.description && (
              <p className="text-xs text-muted-foreground font-medium mt-1.5 max-w-xl">
                {/* Check if description contains serialized details */}
                {queue.description.startsWith("{") ? JSON.parse(queue.description).desc : queue.description}
              </p>
            )}
          </div>
          <span
            className={`rounded-sm border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              queueActive ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary text-muted-foreground border-border/60"
            }`}
          >
            {queueActive ? "Active / Open" : "Paused"}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center relative z-10">
          <div className="bg-secondary/40 border border-border/50 rounded-md py-3.5 px-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Waiting</p>
            <p className="text-2xl font-display font-black text-primary tracking-tight">{activeCount}</p>
          </div>
          <div className="bg-secondary/40 border border-border/50 rounded-md py-3.5 px-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Served Today</p>
            <p className="text-2xl font-display font-black text-foreground tracking-tight">{queue.totalToday || 0}</p>
          </div>
          <div className="bg-secondary/40 border border-border/50 rounded-md py-3.5 px-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Capacity</p>
            <p className="text-2xl font-display font-black text-foreground tracking-tight">{queue.maxParticipants}</p>
          </div>
          <div className="bg-secondary/40 border border-border/50 rounded-md py-3.5 px-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Avg Service</p>
            <p className="text-2xl font-display font-black text-accent tracking-tight">{queue.avgServiceTime}m</p>
          </div>
        </div>
      </div>

      {/* Controls Card */}
      <div className="flex items-center justify-between rounded-md bg-background p-4 border border-border/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-md bg-secondary border border-border/60 flex items-center justify-center text-foreground shrink-0">
            {queueActive ? <Play className="h-4 w-4 text-primary" /> : <Pause className="h-4 w-4 text-accent" />}
          </div>
          <div>
            <span className="font-bold text-xs uppercase tracking-wide text-foreground">Accepting Waitlist Joins</span>
            <p className="text-[10px] text-muted-foreground font-medium">Toggle whether customers can join this queue</p>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <button
          onClick={toggleQueueStatus}
          className={`focus:outline-none relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            queueActive ? "bg-primary" : "bg-secondary border border-border/85"
          }`}
          aria-label="Toggle Waitlist"
        >
          <span 
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-foreground shadow-xs transition duration-200 ease-in-out ${
              queueActive ? "translate-x-5 bg-background" : "translate-x-0 bg-muted-foreground"
            }`} 
          />
        </button>
      </div>

      {/* AI Insights banner */}
      <div className="rounded-md border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-bl-md">
          Coming Soon
        </div>
        <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">AI Queue Operations Insights</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
            We are building smart queue models that predict peak hour overflows, compute optimal serve speed adjustments, and warn customers about potential delays before they leave home.
          </p>
        </div>
      </div>

      {/* Participant List */}
      <div className="space-y-3">
        <h2 className="font-display text-xs font-bold tracking-wider text-muted-foreground uppercase">Next Up ({activeCount})</h2>
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md bg-background py-16 px-6 border border-border/80 shadow-xs text-center">
            <Users className="h-10 w-10 text-muted-foreground/60 mb-4" />
            <p className="text-base font-display font-bold text-foreground">Waitlist is empty</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">When users scan the code or join online, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {participants.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md bg-background p-3 sm:p-4 border border-border/80 shadow-xs hover:border-primary/30 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-md border font-display font-black text-sm ${
                      idx === 0 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-secondary text-foreground border-border/60"
                    }`}
                  >
                    <span>{p.position}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">{p.user?.name || `User #${p.userId}`}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Joined {new Date(p.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setTargetPosition(p.position);
                    setPrioritizingEntry(p);
                  }}
                  className="rounded-md bg-secondary border border-border/60 p-2 text-muted-foreground hover:text-foreground transition-all cursor-pointer hover:bg-background shrink-0"
                  title="Prioritize / Move User"
                >
                  <EllipsisVertical className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Serve Next Button */}
      {participants.length > 0 && (
        <div className="pt-2">
          <Button
            onClick={handleServeNext}
            disabled={isServing}
            className="w-full h-12 text-xs font-bold uppercase tracking-wider gap-2 shadow-glow"
            size="lg"
          >
            {isServing ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <RefreshCw className="h-4.5 w-4.5" />}
            <span>Call Next Person</span>
          </Button>
        </div>
      )}

      {/* Danger Zone — Delete Queue */}
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-5 shadow-xs relative overflow-hidden mt-4">
        <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trash2 className="h-4 w-4 text-destructive shrink-0" />
              <h3 className="text-sm font-display font-bold text-destructive tracking-tight">Delete Queue</h3>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Permanently removes this queue and all participant records. This cannot be undone.
            </p>
          </div>
          <button
            onClick={handleDeleteQueue}
            disabled={isDeletingQueue}
            className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider border border-destructive/30 bg-background text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeletingQueue ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            <span>Delete Queue</span>
          </button>
        </div>
      </div>

      {/* Verification / QR Camera Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-background border border-border rounded-md shadow-lg max-w-md w-full overflow-hidden flex flex-col relative animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-sm text-foreground">Verify QR Ticket</h3>
              </div>
              <button 
                onClick={handleCloseScanner}
                className="h-8 w-8 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Tabs / Scan Options */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-md">
                <button 
                  onClick={() => { if (!cameraActive) startCamera(); }}
                  className={cn(
                    "py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors",
                    cameraActive ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Camera Stream
                </button>
                <button 
                  onClick={stopCamera}
                  className={cn(
                    "py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors",
                    !cameraActive ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Manual Input
                </button>
              </div>

              {/* Viewport for camera or manual form */}
              {cameraActive ? (
                <div className="relative aspect-square w-full rounded-md bg-black overflow-hidden border border-border flex items-center justify-center">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                  {/* Laser scan animation overlay */}
                  <div className="absolute inset-x-0 h-1 bg-primary/80 shadow-[0_0_12px_var(--primary)] top-1/2 -translate-y-1/2 animate-bounce pointer-events-none" />
                  <div className="absolute inset-4 border-2 border-dashed border-primary/60 rounded-md pointer-events-none" />
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    label="QR Token Code"
                    placeholder="Enter customer's ticket code token"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    disabled={isVerifyingToken}
                  />
                  <Button
                    onClick={() => handleVerifyToken(tokenInput)}
                    disabled={isVerifyingToken || !tokenInput.trim()}
                    className="w-full text-xs font-bold uppercase"
                  >
                    {isVerifyingToken ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                    Verify Ticket
                  </Button>
                </div>
              )}

              {/* Simulation Option */}
              <div className="p-3 bg-secondary border border-border rounded-md space-y-2">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Verification Testing Simulator</p>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Testing walk-ins or don't have a device? Click below to automatically grab the first ticket token in the waitlist and verify it.
                </p>
                <button
                  onClick={handleSimulateScan}
                  disabled={participants.length === 0}
                  className="w-full py-2 border border-primary/20 hover:border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                >
                  Simulate scanning QR code
                </button>
              </div>

              {/* Result Indicator */}
              {scanResult && (
                <div className={cn(
                  "p-4 rounded-md border flex items-start gap-3 animate-fade-in",
                  scanResult.success 
                    ? "bg-primary/5 border-primary/20 text-primary" 
                    : "bg-destructive/5 border-destructive/20 text-destructive"
                )}>
                  {scanResult.success ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider">
                      {scanResult.success ? "Verification Successful" : "Verification Failed"}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{scanResult.message}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-secondary/35">
              <Button onClick={handleCloseScanner} variant="secondary" className="text-xs font-bold uppercase">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Walk-in Guest Modal */}
      {showAddGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form onSubmit={handleAddGuestSubmit} className="bg-background border border-border rounded-md shadow-lg max-w-md w-full overflow-hidden flex flex-col relative animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-sm text-foreground">Add Walk-in Customer</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddGuest(false)}
                className="h-8 w-8 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add a physical walk-in customer who isn't using a phone. This generates a simulated guest waitlist ticket.
              </p>
              <Input
                label="Customer Display Name *"
                placeholder="e.g. Robert Smith"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                disabled={isAddingGuest}
              />
              {addGuestError && (
                <div className="p-3 bg-destructive/5 text-destructive text-xs rounded-md border border-destructive/10 font-medium">
                  {addGuestError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-3 border-t border-border bg-secondary/35">
              <Button type="button" variant="secondary" onClick={() => setShowAddGuest(false)} className="text-xs font-bold uppercase">
                Cancel
              </Button>
              <Button type="submit" isLoading={isAddingGuest} className="text-xs font-bold uppercase">
                Add to Waitlist
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Prioritization Position Dialog */}
      {prioritizingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-background border border-border rounded-md shadow-lg max-w-sm w-full overflow-hidden flex flex-col relative animate-scale-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-sm text-foreground">Reprioritize Position</h3>
              </div>
              <button 
                onClick={() => setPrioritizingEntry(null)}
                className="h-8 w-8 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-semibold">Customer:</p>
                <p className="font-bold text-foreground text-sm">{prioritizingEntry.user?.name || `User #${prioritizingEntry.userId}`}</p>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Current Position: #{prioritizingEntry.position}</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">
                  Choose New Waitlist Position
                </label>
                <select
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(Number(e.target.value))}
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2.5 text-xs font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all"
                >
                  {Array.from({ length: Math.max(participants.length, 1) }, (_, i) => i + 1).map((pos) => (
                    <option key={pos} value={pos}>
                      Position #{pos} {pos === 1 ? "(Serve Next)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 px-6 py-3 border-t border-border bg-secondary/35">
              <Button variant="secondary" onClick={() => setPrioritizingEntry(null)} className="text-xs font-bold uppercase">
                Cancel
              </Button>
              <Button 
                onClick={() => handlePrioritizeUser(prioritizingEntry.userId, targetPosition)} 
                className="text-xs font-bold uppercase"
              >
                Confirm Move
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

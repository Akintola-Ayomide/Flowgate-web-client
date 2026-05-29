// app/dashboard/queues/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Loader2, AlertTriangle, ArrowLeft, Play, Pause, Person, PersonCheck, EllipsisVertical, RefreshCw } from "lucide-react";
import { queueApi, Queue, QueueEntry } from "@/features/Queue/services/queue.api";

export default function ManageQueuePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const queueId = Number(id);

  const [queue, setQueue] = useState<Queue | null>(null);
  const [participants, setParticipants] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isServing, setIsServing] = useState(false);
  const [queueActive, setQueueActive] = useState(true);
  const socketRef = useRef<any>(null);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [queueData, participantsData] = await Promise.all([
          queueApi.getById(queueId),
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
    if (!isNaN(queueId)) fetchData();
  }, [queueId]);

  // WebSocket for real‑time updates
  useEffect(() => {
    if (isNaN(queueId)) return;
    const socket = io();
    socketRef.current = socket;
    socket.emit("joinQueueRoom", { queueId });

    const refresh = async () => {
      try {
        const [q, p] = await Promise.all([
          queueApi.getById(queueId),
          queueApi.getParticipants(queueId),
        ]);
        setQueue(q);
        setQueueActive(q.status === "active");
        setParticipants(p);
      } catch (e) {
        console.warn("Failed to refresh queue via socket", e);
      }
    };

    socket.on("queueShifted", refresh);
    socket.on("nextServed", refresh);
    socket.on("userPrioritized", refresh);
    socket.on("userJoined", refresh);
    socket.on("userLeft", refresh);

    return () => socket.disconnect();
  }, [queueId]);

  const handleServeNext = async () => {
    if (isNaN(queueId)) return;
    setIsServing(true);
    try {
      await queueApi.serveNext(queueId);
      const updated = await queueApi.getParticipants(queueId);
      setParticipants(updated);
    } catch (e: any) {
      alert(e.message || "Failed to serve next user");
    } finally {
      setIsServing(false);
    }
  };

  const toggleQueueStatus = async () => {
    if (isNaN(queueId)) return;
    const newStatus = !queueActive;
    try {
      await queueApi.updateQueueStatus(queueId, newStatus ? "active" : "paused");
      setQueueActive(newStatus);
    } catch (e) {
      alert("Failed to update queue status");
    }
  };

  const prioritizeUser = async (userId: number) => {
    if (isNaN(queueId)) return;
    try {
      await queueApi.prioritizeUser(queueId, userId, 1);
      const updated = await queueApi.getParticipants(queueId);
      setParticipants(updated);
    } catch (e) {
      alert("Failed to prioritize user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Queue Not Found</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const activeCount = participants.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 rounded-full bg-gray-200 p-2 hover:bg-gray-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Manage Queue</h1>
      </div>

      {/* Meta Card */}
      <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between border-b pb-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{queue.name}</h2>
            <p className="text-sm text-gray-500">ID: {queue.id}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${queueActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
          >
            {queueActive ? "Open" : "Closed"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Waiting</p>
            <p className="text-2xl font-bold text-primary">{activeCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Served Today</p>
            <p className="text-2xl font-bold text-primary">{queue.totalToday || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Capacity</p>
            <p className="text-2xl font-bold text-primary">{queue.maxParticipants}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Wait</p>
            <p className="text-2xl font-bold text-primary">{queue.avgServiceTime}m</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm border border-gray-200">
        <div className="flex items-center">
          {queueActive ? <Play className="h-5 w-5 text-green-600 mr-2" /> : <Pause className="h-5 w-5 text-gray-600 mr-2" />}
          <span className="font-medium">Accepting Users</span>
        </div>
        <button
          onClick={toggleQueueStatus}
          className={`focus:outline-none ${queueActive ? "bg-green-600" : "bg-gray-300"} rounded-full p-1`}
        >
          {queueActive ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
        </button>
      </div>

      {/* Participant List */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Next Up ({activeCount})</h2>
        {participants.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl bg-white p-8 shadow-sm border border-gray-200">
            <Person className="h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-800">No one waiting</p>
            <p className="mt-2 text-center text-sm text-gray-500">When users join, they'll appear here.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {participants.map((p, idx) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full mr-4 ${idx === 0 ? "bg-primary" : "bg-primary/10"}`}
                  >
                    <span className={`font-bold ${idx === 0 ? "text-primary-foreground" : "text-primary"}`}>{p.position}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{p.user?.name || `User #${p.userId}`}</p>
                    <p className="text-sm text-gray-500">Joined {new Date(p.joinedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Prioritize ${p.user?.name || "this user"}?`)) {
                      prioritizeUser(p.userId);
                    }
                  }}
                  className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                >
                  <EllipsisVertical className="h-5 w-5 text-gray-600" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Serve Next Button */}
      {participants.length > 0 && (
        <button
          onClick={handleServeNext}
          disabled={isServing}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isServing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <RefreshCw className="mr-2 h-5 w-5" />}
          Call Next Person
        </button>
      )}
    </div>
  );
}

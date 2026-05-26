/**
 * @file queue.api.ts
 * @description API service for all queue-related endpoints.
 * Mirrors the backend QueueController surface.
 */

const getApiBaseUrl = (): string => {
    // Proxy all requests through Next.js to avoid cross-origin cookie issues
    return '/api';
};

const API_BASE = getApiBaseUrl();

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: 'An unexpected error occurred' };
        }
        throw new ApiError(
            response.status,
            errorData.message || 'Request failed',
            errorData.code,
            errorData.details || errorData.errors
        );
    }

    // Handle 204 No Content
    const text = await response.text();
    return text ? JSON.parse(text) : (undefined as T);
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type QueueStatus = 'active' | 'paused' | 'closed';
export type QueueEntryStatus = 'waiting' | 'serving' | 'completed' | 'cancelled';

export interface Queue {
    id: number;
    name: string;
    description: string | null;
    maxParticipants: number;
    customFields: Record<string, any>[];
    avgServiceTime: number;
    status: QueueStatus;
    ownerId: number;
    owner?: { id: number; name: string; email: string };
    createdAt: string;
    updatedAt: string;
    // Enriched fields from service
    activeParticipants?: number;
    totalToday?: number;
    inLine?: number;
    waitTime?: number;
}

export interface QueueEntry {
    id: number;
    queueId: number;
    userId: number;
    position: number;
    status: QueueEntryStatus;
    customData: Record<string, any> | null;
    qrCodeToken: string;
    joinedAt: string;
    servedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    user?: { id: number; name: string; email: string; avatar: string | null };
    queue?: Queue;
}

export interface CreateQueueDto {
    name: string;
    description?: string;
    maxParticipants?: number;
    avgServiceTime?: number;
    customFields?: Record<string, any>[];
}

export interface JoinQueueResponse {
    entry: QueueEntry;
    qrCode: string;
    estimatedWaitTime: number;
}

export interface QueueStatusResponse {
    status: 'joined' | 'not_joined';
    queue?: Queue;
    position?: number;
    peopleAhead?: number;
    estimatedWaitTime?: number;
    entry?: QueueEntry;
}

// ─── Queue API ────────────────────────────────────────────────────────────────

export const queueApi = {
    /** Create a new queue owned by the current user. */
    createQueue: (dto: CreateQueueDto): Promise<Queue> =>
        request<Queue>('/queues', {
            method: 'POST',
            body: JSON.stringify(dto),
        }),

    /** Get all queues owned by the current user (includes activeParticipants, totalToday). */
    getMyQueues: (): Promise<Queue[]> =>
        request<Queue[]>('/queues/my'),

    /** Get all active queues in the system (for public browse). */
    getAllActiveQueues: (): Promise<Queue[]> =>
        request<Queue[]>('/queues/active'),

    /** Get queues the current user has joined and is currently waiting in. */
    getJoinedQueues: (): Promise<{ entry: QueueEntry; queue: Queue }[]> =>
        request<{ entry: QueueEntry; queue: Queue }[]>('/queues/joined'),

    /** Get a single queue by ID. */
    getQueue: (id: number): Promise<Queue> =>
        request<Queue>(`/queues/${id}`),

    /** Get the current user's status in a specific queue. */
    getQueueStatus: (id: number): Promise<QueueStatusResponse> =>
        request<QueueStatusResponse>(`/queues/${id}/status`),

    /** Get all participants in a queue (owner only). */
    getParticipants: (id: number): Promise<QueueEntry[]> =>
        request<QueueEntry[]>(`/queues/${id}/participants`),

    /** Join a queue. */
    joinQueue: (queueId: number, customData?: Record<string, any>): Promise<JoinQueueResponse> =>
        request<JoinQueueResponse>('/queues/join', {
            method: 'POST',
            body: JSON.stringify({ queueId, customData }),
        }),

    /** Leave a queue. */
    leaveQueue: (id: number): Promise<void> =>
        request<void>(`/queues/${id}/leave`, { method: 'POST' }),

    /** Serve the next user in line (owner only). */
    serveNext: (id: number): Promise<QueueEntry> =>
        request<QueueEntry>(`/queues/${id}/serve-next`, { method: 'POST' }),

    /** Update a queue's status (owner only). */
    updateStatus: (id: number, status: QueueStatus): Promise<Queue> =>
        request<Queue>(`/queues/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    /** Reorder a participant (owner only). */
    prioritizeUser: (queueId: number, userId: number, newPosition: number): Promise<QueueEntry> =>
        request<QueueEntry>(`/queues/${queueId}/prioritize`, {
            method: 'PATCH',
            body: JSON.stringify({ userId, newPosition }),
        }),

    /** Verify a QR code token (owner only). */
    verifyQr: (token: string): Promise<QueueEntry> =>
        request<QueueEntry>('/queues/verify-qr', {
            method: 'POST',
            body: JSON.stringify({ token }),
        }),
};

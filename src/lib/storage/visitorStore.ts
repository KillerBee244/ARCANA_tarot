/**
 * ARCANA — Visitor Analytics & Access Storage Engine
 * Hybrid Architecture:
 * - Direct Supabase PostgreSQL REST integration if SUPABASE_URL & SUPABASE_KEY are provided.
 * - Resilient Local File / In-memory storage for offline local dev and zero-config deployment.
 */

import fs from "fs";
import path from "path";
import { AdminDashboardStats, VisitorDrawnCard, VisitorLogRecord } from "@/types/reading";
import { QuestionCategory, SpreadType } from "@/types/tarot";

const LOCAL_STORE_DIR = path.join(process.cwd(), "data");
const LOCAL_STORE_FILE = path.join(LOCAL_STORE_DIR, "visitors_store.json");

// In-memory fallback cache to ensure instant reads and resilience
let memoryLogsCache: VisitorLogRecord[] = [];
let isCacheLoaded = false;

function getStoreFilePath(): string {
  // On Vercel serverless, process.cwd() is read-only in some runtimes, /tmp is writable
  if (process.env.VERCEL) {
    return path.join("/tmp", "visitors_store.json");
  }
  return LOCAL_STORE_FILE;
}

function loadLocalLogs(): VisitorLogRecord[] {
  if (isCacheLoaded && memoryLogsCache.length > 0) {
    return memoryLogsCache;
  }
  const filePath = getStoreFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryLogsCache = parsed;
        isCacheLoaded = true;
        return memoryLogsCache;
      }
    }
  } catch (err) {
    console.warn("[VisitorStore] Could not read local file, using memory cache", err);
  }
  isCacheLoaded = true;
  return memoryLogsCache;
}

function saveLocalLogs(logs: VisitorLogRecord[]) {
  memoryLogsCache = logs;
  isCacheLoaded = true;
  const filePath = getStoreFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.warn("[VisitorStore] Could not persist to file system (read-only environment), retained in memory", err);
  }
}

// -------------------------------------------------------------
// Supabase REST Adapter (Zero-dependency fetch)
// -------------------------------------------------------------
function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim();
  if (url && key) {
    return { url: url.replace(/\/$/, ""), key };
  }
  return null;
}

export async function recordVisitorEntry(
  sessionId: string,
  visitorName: string,
  meta?: { ip?: string; userAgent?: string }
): Promise<VisitorLogRecord> {
  const now = new Date().toISOString();
  const cleanName = visitorName.trim() || "Lữ khách phương xa";

  const newRecord: VisitorLogRecord = {
    id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sessionId,
    visitorName: cleanName,
    enteredAt: now,
    status: "entered",
    ip: meta?.ip || "Ẩn danh",
    userAgent: meta?.userAgent || "Không xác định",
  };

  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const res = await fetch(`${supabase.url}/rest/v1/visitors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          session_id: sessionId,
          visitor_name: cleanName,
          entered_at: now,
          status: "entered",
          ip: newRecord.ip,
          user_agent: newRecord.userAgent,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]?.id) {
          newRecord.id = String(data[0].id);
        }
      }
    } catch (e) {
      console.error("[VisitorStore] Supabase insert failed, falling back to local store", e);
    }
  }

  // Always update local cache for ultra-fast local response
  const localLogs = loadLocalLogs();
  const existingIdx = localLogs.findIndex((l) => l.sessionId === sessionId);
  if (existingIdx >= 0) {
    localLogs[existingIdx].visitorName = cleanName;
    saveLocalLogs(localLogs);
    return localLogs[existingIdx];
  } else {
    localLogs.unshift(newRecord);
    // Keep last 500 entries
    saveLocalLogs(localLogs.slice(0, 500));
    return newRecord;
  }
}

export async function recordReadingComplete(
  sessionId: string,
  readingData: {
    visitorName?: string;
    question: string;
    category: QuestionCategory;
    spreadType: SpreadType;
    cards: VisitorDrawnCard[];
    aiTitle?: string;
    aiOverview?: string;
  }
): Promise<void> {
  const completedAt = new Date().toISOString();
  const supabase = getSupabaseConfig();

  if (supabase) {
    try {
      await fetch(`${supabase.url}/rest/v1/visitors?session_id=eq.${encodeURIComponent(sessionId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
        },
        body: JSON.stringify({
          status: "completed",
          completed_at: completedAt,
          visitor_name: readingData.visitorName,
          question: readingData.question,
          category: readingData.category,
          spread_type: readingData.spreadType,
          cards: readingData.cards,
          ai_title: readingData.aiTitle,
          ai_overview: readingData.aiOverview,
        }),
      });
    } catch (e) {
      console.error("[VisitorStore] Supabase update failed", e);
    }
  }

  // Update local store
  const localLogs = loadLocalLogs();
  const target = localLogs.find((l) => l.sessionId === sessionId);
  if (target) {
    target.status = "completed";
    target.completedAt = completedAt;
    if (readingData.visitorName) target.visitorName = readingData.visitorName;
    target.question = readingData.question;
    target.category = readingData.category;
    target.spreadType = readingData.spreadType;
    target.cards = readingData.cards;
    target.aiTitle = readingData.aiTitle;
    target.aiOverview = readingData.aiOverview;
    saveLocalLogs(localLogs);
  } else {
    // If not found, create completed record
    const newRecord: VisitorLogRecord = {
      id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId,
      visitorName: readingData.visitorName || "Lữ khách",
      enteredAt: completedAt,
      completedAt,
      status: "completed",
      question: readingData.question,
      category: readingData.category,
      spreadType: readingData.spreadType,
      cards: readingData.cards,
      aiTitle: readingData.aiTitle,
      aiOverview: readingData.aiOverview,
      ip: "Ẩn danh",
      userAgent: "Desktop / Web",
    };
    localLogs.unshift(newRecord);
    saveLocalLogs(localLogs.slice(0, 500));
  }
}

export async function getVisitorLogs(): Promise<{ logs: VisitorLogRecord[]; storageMode: "supabase" | "local" }> {
  const supabase = getSupabaseConfig();
  if (supabase) {
    try {
      const res = await fetch(
        `${supabase.url}/rest/v1/visitors?select=*&order=entered_at.desc&limit=200`,
        {
          headers: {
            apikey: supabase.key,
            Authorization: `Bearer ${supabase.key}`,
          },
        }
      );
      if (res.ok) {
        const rows = await res.json();
        const logs: VisitorLogRecord[] = rows.map((r: any) => ({
          id: String(r.id),
          sessionId: r.session_id,
          visitorName: r.visitor_name,
          enteredAt: r.entered_at,
          completedAt: r.completed_at,
          status: r.status,
          question: r.question,
          category: r.category,
          spreadType: r.spread_type,
          cards: r.cards,
          aiTitle: r.ai_title,
          aiOverview: r.ai_overview,
          ip: r.ip,
          userAgent: r.user_agent,
        }));
        return { logs, storageMode: "supabase" };
      }
    } catch (e) {
      console.error("[VisitorStore] Supabase fetch failed, falling back to local store", e);
    }
  }

  const localLogs = loadLocalLogs();
  return { logs: localLogs, storageMode: "local" };
}

export function computeAdminStats(logs: VisitorLogRecord[]): AdminDashboardStats {
  const totalVisitors = logs.length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayVisitors = logs.filter((l) => l.enteredAt?.startsWith(todayStr)).length;
  const completedReadings = logs.filter((l) => l.status === "completed").length;
  const completionRate = totalVisitors > 0 ? Math.round((completedReadings / totalVisitors) * 100) : 0;

  const categoryCounts: Record<string, number> = {
    love: 0,
    career: 0,
    finance: 0,
    self: 0,
    general: 0,
  };

  const cardTally: Record<string, { nameVi: string; count: number }> = {};

  for (const log of logs) {
    if (log.category && categoryCounts[log.category] !== undefined) {
      categoryCounts[log.category]++;
    }
    if (log.cards && Array.isArray(log.cards)) {
      for (const c of log.cards) {
        if (!cardTally[c.cardId]) {
          cardTally[c.cardId] = { nameVi: c.nameVi, count: 0 };
        }
        cardTally[c.cardId].count++;
      }
    }
  }

  const topCards = Object.entries(cardTally)
    .map(([cardId, val]) => ({ cardId, nameVi: val.nameVi, count: val.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalVisitors,
    todayVisitors,
    completedReadings,
    completionRate,
    categoryCounts,
    topCards,
  };
}

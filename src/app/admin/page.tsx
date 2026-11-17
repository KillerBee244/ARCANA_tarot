"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Download,
  Search,
  ExternalLink,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Database,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { AdminDashboardStats, VisitorLogRecord } from "@/types/reading";
import { QuestionCategory } from "@/types/tarot";
import { getCategoryLabelVi } from "@/data/tarot/categories";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [logs, setLogs] = useState<VisitorLogRecord[]>([]);
  const [storageMode, setStorageMode] = useState<"supabase" | "local">("local");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<VisitorLogRecord | null>(null);

  // Check saved session PIN
  useEffect(() => {
    try {
      const savedPin = sessionStorage.getItem("arcana_admin_pin");
      if (savedPin) {
        verifyPinAndLoad(savedPin);
      }
    } catch {
      // ignore
    }
  }, []);

  const verifyPinAndLoad = async (pinToTest: string) => {
    setIsVerifying(true);
    setPinError(null);
    try {
      const verifyRes = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToTest }),
      });
      const verifyJson = await verifyRes.json();

      if (verifyJson.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("arcana_admin_pin", pinToTest);
        fetchLogs(pinToTest);
      } else {
        setIsAuthenticated(false);
        setPinError(verifyJson.message || "Mã PIN không chính xác.");
      }
    } catch {
      setPinError("Lỗi kết nối tới máy chủ.");
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchLogs = useCallback(async (activePin?: string) => {
    const pin = activePin || sessionStorage.getItem("arcana_admin_pin") || "";
    if (!pin) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/logs?pin=${encodeURIComponent(pin)}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setStats(data.stats || null);
        setStorageMode(data.storageMode || "local");
      } else {
        if (res.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem("arcana_admin_pin");
        }
      }
    } catch (e) {
      console.error("Failed to fetch logs", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError("Vui lòng nhập mã PIN quản trị.");
      return;
    }
    verifyPinAndLoad(pinInput.trim());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("arcana_admin_pin");
    setPinInput("");
    setLogs([]);
    setStats(null);
  };

  // Filter logs by search term and category
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !searchTerm.trim() ||
        log.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.sessionId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = filterCategory === "all" || log.category === filterCategory;

      return matchSearch && matchCategory;
    });
  }, [logs, searchTerm, filterCategory]);

  // Export CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = [
      "Thời Gian",
      "Danh Xưng",
      "Trạng Thái",
      "Chủ Đề",
      "Câu Hỏi",
      "Lá Bài Đã Rút",
      "IP",
      "Thiết Bị",
    ];

    const rows = logs.map((l) => {
      const time = l.enteredAt ? new Date(l.enteredAt).toLocaleString("vi-VN") : "";
      const status = l.status === "completed" ? "Đã hoàn thành" : "Đã vào cổng";
      const cat = l.category ? getCategoryLabelVi(l.category) : "Chưa chọn";
      const q = `"${(l.question || "").replace(/"/g, '""')}"`;
      const cards = l.cards
        ? `"${l.cards.map((c) => `${c.nameVi} [${c.orientation === "upright" ? "Thuận" : "Ngược"}]`).join("; ")}"`
        : '""';
      const ip = l.ip || "";
      const ua = `"${(l.userAgent || "").replace(/"/g, '""')}"`;

      return [time, `"${l.visitorName}"`, status, `"${cat}"`, q, cards, ip, ua].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `arcana_visitors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================================
  // Screen 1: PIN Authentication Screen
  // ============================================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#111E2C] text-[#F4EADA] flex flex-col justify-center items-center px-4 select-none relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #DAB48A 0%, #80BDB2 50%, transparent 70%)" }}
        />

        <div className="relative z-10 w-full max-w-md bg-[#192B38] border border-[#DAB48A]/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#284450] border border-[#DAB48A]/50 flex items-center justify-center shadow-celestial-glow">
              <Lock className="w-6 h-6 text-[#C7E9AD]" />
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-widest text-[#DAB48A] uppercase">
                ✦ CELESTIAL ARCHIVE 2.0 ✦
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-light text-[#F4EADA] tracking-wide mt-1">
                Cổng Quản Trị Truy Cập
              </h1>
            </div>
            <p className="font-body text-xs sm:text-sm text-[#A7BBC0] leading-relaxed max-w-xs">
              Nhập mã PIN bí mật của Dien Vu để mở bảng theo dõi lượt lữ khách và quẻ bài.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError(null);
                }}
                placeholder="Nhập mã PIN..."
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-[#223846] border border-[#DAB48A]/40 text-[#F4EADA] placeholder-[#A7BBC0]/50 focus:outline-none focus:border-[#C7E9AD] focus:ring-1 focus:ring-[#C7E9AD] transition-all text-center font-mono text-lg tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A7BBC0] hover:text-[#F4EADA] p-1 cursor-pointer transition-colors"
                title={showPin ? "Ẩn PIN" : "Hiện PIN"}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {pinError && (
              <p className="text-xs font-body text-[#E8A598] text-center">{pinError}</p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#DAB48A] via-[#ECD2B3] to-[#DAB48A] text-[#111E2C] font-body text-sm font-semibold tracking-wide shadow-copper-glow hover:shadow-celestial-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <span>Mở Cổng Quản Trị ➔</span>
              )}
            </button>
          </form>

          {/* Local Hint */}
          <div className="mt-6 pt-4 border-t border-[#DAB48A]/15 text-center">
            <p className="text-[11px] font-mono text-[#A7BBC0]/70">
              Mã PIN mặc định: <span className="text-[#C7E9AD] font-bold">arcana2026</span>
            </p>
            <p className="text-[10px] text-[#A7BBC0]/50 mt-1">
              (Cấu hình biến ADMIN_PIN trên Vercel để đổi mã bảo mật)
            </p>
          </div>

          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-xs text-[#DAB48A] hover:text-[#F4EADA] underline transition-colors"
            >
              ← Quay lại Thư viện Tarot
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // Screen 2: Authenticated Dashboard
  // ============================================================
  return (
    <main className="min-h-screen bg-[#111E2C] text-[#F4EADA] selection:bg-[#C7E9AD] selection:text-[#111E2C] flex flex-col justify-between">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 w-full px-4 md:px-8 py-3.5 bg-[#111E2C]/90 backdrop-blur-md border-b border-[#DAB48A]/25 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#284450] border border-[#DAB48A]/50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#C7E9AD]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display text-lg tracking-wider text-[#F4EADA] font-medium leading-none">
                ARCANA
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[#DAB48A] uppercase">
                • DASHBOARD QUẢN TRỊ
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#A7BBC0]">
              Quản lý bởi Dien Vu • Theo dõi lượt truy cập thời gian thực
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-3">
          {/* Storage Badge */}
          <div
            className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
              storageMode === "supabase"
                ? "bg-[#1E3B34] border-[#80BDB2] text-[#C7E9AD]"
                : "bg-[#284450] border-[#DAB48A]/40 text-[#DAB48A]"
            }`}
            title={
              storageMode === "supabase"
                ? "Đang lưu trữ trực tiếp trên Supabase PostgreSQL"
                : "Đang chạy bộ nhớ cục bộ / Vercel Serverless. Thêm biến SUPABASE_URL để đồng bộ đám mây."
            }
          >
            <Database className="w-3.5 h-3.5" />
            <span>{storageMode === "supabase" ? "Supabase Cloud" : "Bộ nhớ Cục bộ"}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchLogs()}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#223846] border border-[#DAB48A]/30 text-[#F4EADA] hover:bg-[#284450] transition-colors cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#C7E9AD]" : ""}`} />
          </button>

          {/* Link to Tarot App */}
          <a
            href="/"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#284450] border border-[#DAB48A]/40 text-xs font-body font-medium hover:bg-[#385968] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C7E9AD]" />
            <span className="hidden sm:inline">Vào Thư Viện</span>
          </a>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-[#3B2323] border border-[#E8A598]/40 text-[#E8A598] hover:bg-[#522D2D] transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Total Visitors */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#192B38] border border-[#DAB48A]/30 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-[#A7BBC0] text-xs font-body mb-2">
              <span>Tổng Lữ Khách</span>
              <Users className="w-4 h-4 text-[#DAB48A]" />
            </div>
            <div className="font-display text-3xl sm:text-4xl text-[#F4EADA] font-light">
              {stats?.totalVisitors ?? logs.length}
            </div>
            <div className="font-mono text-[10px] text-[#A7BBC0]/70 mt-1">
              Đã khắc tên vào Cổng Trời
            </div>
          </div>

          {/* Card 2: Today Visitors */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#192B38] border border-[#C7E9AD]/30 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-[#A7BBC0] text-xs font-body mb-2">
              <span>Lữ Khách Hôm Nay</span>
              <Calendar className="w-4 h-4 text-[#C7E9AD]" />
            </div>
            <div className="font-display text-3xl sm:text-4xl text-[#C7E9AD] font-light">
              {stats?.todayVisitors ?? 0}
            </div>
            <div className="font-mono text-[10px] text-[#A7BBC0]/70 mt-1">
              Ghé thăm trong 24 giờ qua
            </div>
          </div>

          {/* Card 3: Completed Readings */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#192B38] border border-[#80BDB2]/30 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-[#A7BBC0] text-xs font-body mb-2">
              <span>Quẻ Đã Khai Mở</span>
              <Compass className="w-4 h-4 text-[#80BDB2]" />
            </div>
            <div className="font-display text-3xl sm:text-4xl text-[#F4EADA] font-light">
              {stats?.completedReadings ?? 0}
            </div>
            <div className="font-mono text-[10px] text-[#A7BBC0]/70 mt-1">
              Hoàn thành bốc bài & đọc cổ thư
            </div>
          </div>

          {/* Card 4: Completion Rate */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#192B38] border border-[#DAB48A]/30 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-[#A7BBC0] text-xs font-body mb-2">
              <span>Tỉ Lệ Hoàn Thành</span>
              <CheckCircle2 className="w-4 h-4 text-[#DAB48A]" />
            </div>
            <div className="font-display text-3xl sm:text-4xl text-[#DAB48A] font-light">
              {stats?.completionRate ?? 0}%
            </div>
            <div className="font-mono text-[10px] text-[#A7BBC0]/70 mt-1">
              Lữ khách đi hết hành trình
            </div>
          </div>
        </div>

        {/* Category Breakdown Bar */}
        {stats && (
          <div className="p-4 rounded-xl bg-[#192B38]/70 border border-[#DAB48A]/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#DAB48A] font-medium whitespace-nowrap">
              Phân loại chủ đề thỉnh bài:
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs font-body">
              <span className="px-2.5 py-1 rounded-full bg-[#E8A598]/20 border border-[#E8A598]/40 text-[#E8A598]">
                Tình yêu: {stats.categoryCounts.love || 0}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#80BDB2]/20 border border-[#80BDB2]/40 text-[#80BDB2]">
                Sự nghiệp: {stats.categoryCounts.career || 0}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#DAB48A]/20 border border-[#DAB48A]/40 text-[#DAB48A]">
                Tài chính: {stats.categoryCounts.finance || 0}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#C7E9AD]/20 border border-[#C7E9AD]/40 text-[#C7E9AD]">
                Bản thân: {stats.categoryCounts.self || 0}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#A7BBC0]/20 border border-[#A7BBC0]/40 text-[#A7BBC0]">
                Tự do: {stats.categoryCounts.general || 0}
              </span>
            </div>
          </div>
        )}

        {/* Controls Toolbar: Search, Filters & Export */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7BBC0]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên lữ khách hoặc câu hỏi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#192B38] border border-[#DAB48A]/30 text-[#F4EADA] placeholder-[#A7BBC0]/50 text-xs font-body focus:outline-none focus:border-[#C7E9AD]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "all", label: "Tất cả" },
              { id: "love", label: "Tình yêu" },
              { id: "career", label: "Sự nghiệp" },
              { id: "finance", label: "Tài chính" },
              { id: "self", label: "Bản thân" },
              { id: "general", label: "Tự do" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body transition-colors cursor-pointer ${
                  filterCategory === cat.id
                    ? "bg-[#DAB48A] text-[#111E2C] font-semibold"
                    : "bg-[#192B38] border border-[#DAB48A]/30 text-[#A7BBC0] hover:text-[#F4EADA]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#223846] border border-[#DAB48A]/40 text-xs font-body font-semibold text-[#F4EADA] hover:bg-[#284450] transition-colors cursor-pointer disabled:opacity-40"
          >
            <Download className="w-4 h-4 text-[#C7E9AD]" />
            <span>Xuất file Excel/CSV</span>
          </button>
        </div>

        {/* Live Visitor Log Table */}
        <div className="w-full bg-[#192B38] border border-[#DAB48A]/30 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[#223846] text-[#A7BBC0] uppercase font-mono text-[11px] border-b border-[#DAB48A]/20">
                <tr>
                  <th className="px-4 py-3.5">Thời gian</th>
                  <th className="px-4 py-3.5">Lữ khách</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-4 py-3.5">Chủ đề & Câu hỏi</th>
                  <th className="px-4 py-3.5">Lá bài đã rút</th>
                  <th className="px-4 py-3.5 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DAB48A]/15 text-[#F4EADA]">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-[#A7BBC0] font-body">
                      {isLoading ? "Đang tải dữ liệu lữ khách..." : "Chưa có lượt truy cập nào phù hợp với bộ lọc."}
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const formattedTime = log.enteredAt
                      ? new Date(log.enteredAt).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—";

                    const isCompleted = log.status === "completed";

                    return (
                      <tr key={log.id} className="hover:bg-[#223846]/50 transition-colors">
                        {/* Time */}
                        <td className="px-4 py-3.5 font-mono text-[11px] text-[#A7BBC0] whitespace-nowrap">
                          {formattedTime}
                        </td>

                        {/* Visitor Name */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-[#284450] border border-[#DAB48A]/50 flex items-center justify-center font-display text-xs text-[#C7E9AD] font-semibold">
                              {log.visitorName?.charAt(0)?.toUpperCase() || "L"}
                            </div>
                            <span className="font-display font-medium text-sm text-[#F4EADA]">
                              {log.visitorName}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {isCompleted ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#1E3B34] text-[#C7E9AD] border border-[#80BDB2]/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C7E9AD]" />
                              <span>Đã Khai Mở</span>
                            </span>
                          ) : log.question ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#223846] text-[#80BDB2] border border-[#80BDB2]/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#80BDB2] animate-pulse" />
                              <span>Đang Chọn Bài</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#382C1D] text-[#DAB48A] border border-[#DAB48A]/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#DAB48A]" />
                              <span>Vào Cổng</span>
                            </span>
                          )}
                        </td>

                        {/* Category & Question */}
                        <td className="px-4 py-3.5 max-w-xs">
                          {log.category && (
                            <span className="inline-block text-[10px] font-mono text-[#DAB48A] uppercase mb-0.5">
                              [{getCategoryLabelVi(log.category as QuestionCategory)}]
                            </span>
                          )}
                          <p className="truncate text-xs text-[#C1CFD0]">
                            {log.question ? `"${log.question}"` : "Chưa nhập câu hỏi"}
                          </p>
                        </td>

                        {/* Cards */}
                        <td className="px-4 py-3.5">
                          {log.cards && log.cards.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {log.cards.map((c, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#223846] border border-[#DAB48A]/30 text-[10px] font-body text-[#F4EADA]"
                                  title={`${c.nameVi} (${c.positionName}): ${c.orientation === "upright" ? "Thuận" : "Ngược"}`}
                                >
                                  {c.nameVi}
                                  <span className="text-[9px] text-[#DAB48A] ml-1">
                                    {c.orientation === "upright" ? "↑" : "↓"}
                                  </span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#A7BBC0]/60 italic">Chưa bốc bài</span>
                          )}
                        </td>

                        {/* Action: Detail Button */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="px-3 py-1 rounded-lg bg-[#284450] border border-[#DAB48A]/40 text-[11px] font-body text-[#C7E9AD] hover:bg-[#385968] transition-colors cursor-pointer"
                          >
                            Xem quẻ
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111E2C]/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#192B38] border border-[#DAB48A]/50 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#DAB48A]/20 pb-4 mb-4">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-[#DAB48A] uppercase">
                  ✦ CHI TIẾT LƯỢT THỈNH BÀI ✦
                </span>
                <h3 className="font-display text-2xl text-[#F4EADA] font-medium mt-1">
                  Lữ khách: {selectedLog.visitorName}
                </h3>
                <div className="text-xs font-mono text-[#A7BBC0] mt-1">
                  Thời gian: {new Date(selectedLog.enteredAt).toLocaleString("vi-VN")}
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-full text-[#A7BBC0] hover:text-[#F4EADA] hover:bg-[#284450] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Question */}
              <div className="p-4 rounded-xl bg-[#223846] border border-[#DAB48A]/30">
                <span className="font-mono text-[10px] uppercase text-[#DAB48A] tracking-wider">
                  Câu hỏi của Lữ khách:
                </span>
                <p className="font-display text-base text-[#F4EADA] mt-1">
                  &ldquo;{selectedLog.question || "Chưa đặt câu hỏi"}&rdquo;
                </p>
                {selectedLog.category && (
                  <div className="mt-2 text-xs text-[#C7E9AD] font-body">
                    Chủ đề: {getCategoryLabelVi(selectedLog.category as QuestionCategory)}
                  </div>
                )}
              </div>

              {/* Cards Drawn */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#A7BBC0] block mb-2">
                  Các lá bài đã rút ({selectedLog.cards?.length || 0}):
                </span>
                {selectedLog.cards && selectedLog.cards.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedLog.cards.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#223846]/70 border border-[#DAB48A]/30 text-center space-y-1"
                      >
                        <span className="text-[10px] font-mono text-[#A7BBC0] block">
                          {c.positionName}
                        </span>
                        <div className="font-display font-medium text-xs text-[#F4EADA]">
                          {c.nameVi}
                        </div>
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-mono ${
                            c.orientation === "upright"
                              ? "bg-[#C7E9AD]/20 text-[#C7E9AD]"
                              : "bg-[#E8A598]/20 text-[#E8A598]"
                          }`}
                        >
                          {c.orientation === "upright" ? "Thuận" : "Ngược"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#A7BBC0] italic">Người này chưa tiến hành bốc bài.</p>
                )}
              </div>

              {/* AI / Interpretation Overview */}
              {selectedLog.aiOverview && (
                <div className="p-4 rounded-xl bg-[#111E2C] border border-[#80BDB2]/40 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-[#C7E9AD]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Thông điệp vũ trụ đã trao:</span>
                  </div>
                  <p className="font-body text-xs text-[#C1CFD0] leading-relaxed">
                    {selectedLog.aiOverview}
                  </p>
                </div>
              )}

              {/* Technical Metadata */}
              <div className="p-3 rounded-xl bg-[#111E2C]/50 border border-[#DAB48A]/15 text-[11px] font-mono text-[#A7BBC0]/70 space-y-1">
                <div>Session ID: {selectedLog.sessionId}</div>
                <div>IP: {selectedLog.ip || "Ẩn danh"}</div>
                <div className="truncate">Thiết bị: {selectedLog.userAgent || "Desktop Web"}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#DAB48A]/20 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-[#223846] border border-[#DAB48A]/40 text-xs font-body text-[#F4EADA] hover:bg-[#284450] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full px-6 py-4 border-t border-[#DAB48A]/20 flex flex-col sm:flex-row items-center justify-between text-[#A7BBC0] font-body text-xs bg-[#111E2C]/70">
        <div>Designed & Engineered by Dien Vu • Arcana Celestial Archive</div>
        <div className="font-mono text-[11px] text-[#C7E9AD]">ADMIN CONSOLE v2.0</div>
      </footer>
    </main>
  );
}

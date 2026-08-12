"use client";

import { type FormEvent, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe2,
  LockKeyhole,
  Server,
  ShieldCheck,
} from "@/components/icons";
import {
  normalizePortalServer,
  parsePortalDiscovery,
  type PortalServer,
} from "@/lib/server-registration";

const discoveryCacheTtlMs = 60_000;

type SubmissionState =
  | { status: "idle" }
  | { status: "checking" }
  | { message: string; status: "error" }
  | { server: PortalServer; status: "ready" };

export function DomainOnboarding({
  assetBasePath = "",
}: {
  assetBasePath?: string;
}) {
  const [domain, setDomain] = useState("");
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: "checking" });

    try {
      if (!navigator.onLine) {
        throw new Error(
          "Thiết bị đang ngoại tuyến. Hãy kiểm tra kết nối mạng rồi thử lại.",
        );
      }
      const target = normalizePortalServer(domain);
      const cachedPayload = readCachedDiscovery(target.origin);
      if (cachedPayload) {
        const server = parsePortalDiscovery(cachedPayload, target.origin);
        setSubmission({ server, status: "ready" });
        window.location.assign(server.entryUrl);
        return;
      }
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12_000);
      let response: Response;
      try {
        const discoveryUrl = new URL("/api/v1/discovery", target.origin);
        discoveryUrl.searchParams.set("domain", target.domain);
        response = await fetch(discoveryUrl, {
          cache: "no-store",
          credentials: "omit",
          headers: { Accept: "application/json" },
          redirect: "error",
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeout);
      }
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(serverErrorMessage(payload));
      }
      const server = parsePortalDiscovery(payload, target.origin);
      cacheDiscovery(target.origin, payload);
      setSubmission({ server, status: "ready" });
      window.location.assign(server.entryUrl);
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "Server phản hồi quá chậm. Hãy kiểm tra DNS, firewall và TLS."
          : error instanceof Error
            ? error.message
            : "Không thể kiểm tra instance tại domain này.";
      setSubmission({ message, status: "error" });
    }
  }

  return (
    <section className="onboarding" aria-labelledby="onboarding-title">
      <div className="onboarding__content">
        <div className="onboarding__intro">
          <p className="hero-badge">
            <ShieldCheck size={16} />
            Bảo mật · Riêng tư · Kiểm soát
          </p>
          <h1 id="onboarding-title">Kết nối chat công ty</h1>
          <p>
            Chat nội bộ an toàn, riêng tư và kiểm soát hoàn toàn. Nhập domain
            công ty để portal xác minh instance rồi mở đúng không gian làm việc.
          </p>
        </div>

        <form
          aria-busy={submission.status === "checking"}
          className="domain-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="company-domain">
            <Globe2 size={21} />
            Nhập domain công ty
          </label>
          <div className="domain-input">
            <input
              aria-describedby={
                submission.status === "error" || submission.status === "ready"
                  ? "domain-help domain-status"
                  : "domain-help"
              }
              aria-invalid={submission.status === "error"}
              aria-label="Domain WebTUI Chat"
              autoCapitalize="none"
              autoComplete="url"
              disabled={submission.status === "checking"}
              id="company-domain"
              onChange={(event) => {
                setDomain(event.target.value);
                if (submission.status !== "idle") {
                  setSubmission({ status: "idle" });
                }
              }}
              placeholder="vd: chat.congty.vn"
              required
              spellCheck={false}
              value={domain}
            />
            <button
              disabled={submission.status === "checking" || !domain.trim()}
              type="submit"
            >
              {submission.status === "checking" ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                <ArrowRight aria-hidden="true" size={18} />
              )}
              {submission.status === "checking" ? "Đang kiểm tra" : "Kiểm tra"}
            </button>
          </div>

          <p className="domain-help" id="domain-help">
            <LockKeyhole size={14} />
            Chỉ dùng để kết nối và xác thực. Chúng tôi không lưu credential.
          </p>

          {submission.status === "error" ? (
            <p
              className="form-message form-message--error"
              id="domain-status"
              role="alert"
            >
              {submission.message}
            </p>
          ) : null}
          {submission.status === "ready" ? (
            <div className="server-result" id="domain-status" role="status">
              <Building2 aria-hidden="true" size={20} />
              <span>
                <strong>{submission.server.name}</strong>
                <small>
                  {submission.server.domain} · v{submission.server.appVersion}
                </small>
              </span>
              <CheckCircle2 aria-hidden="true" size={20} />
            </div>
          ) : null}
        </form>

        <div className="connection-card" aria-label="Trạng thái kết nối">
          <span className="connection-card__icon">
            <ShieldCheck size={24} />
          </span>
          <span>
            <strong>Kết nối an toàn</strong>
            <small>Mã hóa đầu cuối đang được kích hoạt</small>
          </span>
          <span className="signal-dots" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <b />
          </span>
        </div>
      </div>

      <div
        aria-label="WebTUI Chat trên máy tính và điện thoại"
        className="product-showcase"
      >
        <div className="showcase-arc showcase-arc--one" aria-hidden="true" />
        <div className="showcase-arc showcase-arc--two" aria-hidden="true" />
        <div className="product-showcase__status">
          <span />
          Instance sẵn sàng
        </div>
        <div className="showcase-shield" aria-hidden="true">
          <LockKeyhole size={24} />
        </div>
        <div className="product-showcase__desktop">
          <div className="window-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>VPS TTT Chat</span>
          </div>
          <img
            alt="WebTUI Chat trên màn hình máy tính"
            src={`${assetBasePath}/showcase/tablet-chat.png`}
          />
        </div>
        <div className="product-showcase__phone product-showcase__phone--chat">
          <img
            alt="Màn hình cuộc trò chuyện WebTUI Chat trên điện thoại"
            src={`${assetBasePath}/showcase/phone-chat.png`}
          />
        </div>
        <div className="product-showcase__route" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="product-showcase__server">
          <Server size={20} />
          <span>
            <strong>Server công ty</strong>
            <small>TLS đã xác minh</small>
          </span>
          <CheckCircle2 size={17} />
        </div>
      </div>
    </section>
  );
}

function readCachedDiscovery(origin: string): unknown | null {
  try {
    const raw = window.sessionStorage.getItem(discoveryCacheKey(origin));
    if (!raw) {
      return null;
    }
    const cached = JSON.parse(raw) as {
      checkedAt?: unknown;
      payload?: unknown;
    };
    if (
      typeof cached.checkedAt !== "number" ||
      Date.now() - cached.checkedAt > discoveryCacheTtlMs
    ) {
      window.sessionStorage.removeItem(discoveryCacheKey(origin));
      return null;
    }
    return cached.payload ?? null;
  } catch {
    return null;
  }
}

function cacheDiscovery(origin: string, payload: unknown) {
  try {
    window.sessionStorage.setItem(
      discoveryCacheKey(origin),
      JSON.stringify({ checkedAt: Date.now(), payload }),
    );
  } catch {
    // Storage can be unavailable in hardened/private browser modes.
  }
}

function discoveryCacheKey(origin: string) {
  return `webtui:portal-discovery:${origin}`;
}

function serverErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "Không tìm thấy API WebTUI Chat tại domain này.";
  }
  const root = payload as Record<string, unknown>;
  const error =
    root.error && typeof root.error === "object"
      ? (root.error as Record<string, unknown>)
      : null;
  return typeof error?.message === "string"
    ? error.message
    : "Instance chưa sẵn sàng hoặc không phải WebTUI Chat self-hosted.";
}

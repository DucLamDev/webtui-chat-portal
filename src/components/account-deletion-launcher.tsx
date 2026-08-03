"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, Globe2 } from "@/components/icons";
import { normalizePortalServer, parsePortalDiscovery } from "@/lib/server-registration";

export function AccountDeletionLauncher() {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!navigator.onLine) {
      setError("Thiết bị đang ngoại tuyến. Hãy kiểm tra kết nối mạng rồi thử lại.");
      return;
    }

    setIsChecking(true);
    try {
      const target = normalizePortalServer(domain);
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
          signal: controller.signal
        });
      } finally {
        window.clearTimeout(timeout);
      }
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error("Không tìm thấy instance WebTUI Chat đang hoạt động tại domain này.");
      }
      const server = parsePortalDiscovery(payload, target.origin);
      const entry = new URL(server.entryUrl);
      entry.searchParams.set("account_action", "delete");
      entry.searchParams.set("source", "account-deletion");
      window.location.assign(entry.toString());
    } catch (cause) {
      setError(
        cause instanceof DOMException && cause.name === "AbortError"
          ? "Instance phản hồi quá chậm. Hãy kiểm tra domain hoặc liên hệ quản trị viên."
          : cause instanceof Error
            ? cause.message
            : "Không thể mở instance lúc này."
      );
      setIsChecking(false);
    }
  }

  return (
    <form aria-busy={isChecking} className="deletion-launcher" onSubmit={handleSubmit}>
      <label htmlFor="deletion-instance-domain">Domain WebTUI Chat của công ty</label>
      <div className="domain-input">
        <Globe2 size={20} />
        <input
          aria-describedby="deletion-domain-help deletion-domain-status"
          aria-invalid={Boolean(error)}
          autoCapitalize="none"
          autoComplete="url"
          disabled={isChecking}
          id="deletion-instance-domain"
          onChange={(event) => setDomain(event.target.value)}
          placeholder="chat.company.com"
          required
          spellCheck={false}
          value={domain}
        />
        <button disabled={isChecking || !domain.trim()} type="submit">
          <ArrowRight size={19} />
          {isChecking ? "Đang kiểm tra" : "Mở instance"}
        </button>
      </div>
      <small id="deletion-domain-help">
        Portal chỉ kiểm tra domain rồi chuyển bạn thẳng tới server của tổ chức.
      </small>
      <p aria-live="polite" className="form-message form-message--error" id="deletion-domain-status">
        {error}
      </p>
    </form>
  );
}

import { describe, expect, it } from "vitest";
import {
  buildAccountDeletionEntry,
  normalizePortalServer,
  parsePortalDiscovery,
} from "../../src/lib/server-registration";

describe("portal self-hosted registration", () => {
  it("normalizes a customer domain and builds the first-registration URL", () => {
    const target = normalizePortalServer("Chat.Company.Example");
    const server = parsePortalDiscovery(
      discoveryPayload({ domain: "chat.company.example" }),
      target.origin,
    );

    expect(target).toEqual({
      domain: "chat.company.example",
      origin: "https://chat.company.example",
    });
    expect(server.name).toBe("Company Chat");
    expect(server.entryUrl).toBe(
      "https://chat.company.example/?auth=register&source=portal",
    );
  });

  it("sends an activated instance to login", () => {
    const server = parsePortalDiscovery(
      discoveryPayload({
        domain: "chat.company.example",
        registrationMode: "invite_only",
      }),
      "https://chat.company.example",
    );

    expect(server.entryUrl).toContain("auth=login");
  });

  it("builds a login-only deep link to the web account deletion control", () => {
    expect(
      buildAccountDeletionEntry(
        "https://chat.company.example/?auth=register&source=portal",
      ),
    ).toBe(
      "https://chat.company.example/?auth=login&source=account-deletion&section=settings&account_action=delete#delete-account-title",
    );
  });

  it("rejects discovery that redirects clients to another host", () => {
    expect(() =>
      parsePortalDiscovery(
        discoveryPayload({
          apiBaseUrl: "https://attacker.example",
          domain: "chat.company.example",
        }),
        "https://chat.company.example",
      ),
    ).toThrow(/không cùng server/i);
  });

  it("rejects a legacy discovery response without the safety contract", () => {
    const payload = discoveryPayload({ domain: "chat.company.example" });
    delete payload.data.discovery.instance_id;
    delete payload.data.discovery.runtime.api_contract_version;

    expect(() =>
      parsePortalDiscovery(payload, "https://chat.company.example"),
    ).toThrow(/UUID|contract/i);
  });

  it("rejects an instance missing a required safety capability", () => {
    const payload = discoveryPayload({ domain: "chat.company.example" });
    payload.data.discovery.capabilities.blocking = false;

    expect(() =>
      parsePortalDiscovery(payload, "https://chat.company.example"),
    ).toThrow(/blocking/i);
  });
});

function discoveryPayload({
  apiBaseUrl = "https://chat.company.example",
  domain,
  registrationMode = "open",
}: {
  apiBaseUrl?: string;
  domain: string;
  registrationMode?: string;
}) {
  return {
    data: {
      discovery: {
        version: "1",
        instance_id: "11111111-1111-4111-8111-111111111111",
        capabilities: {
          self_hosted: true,
          moderation: true,
          reporting: true,
          blocking: true,
          account_deletion: true,
          legal_acceptance: true,
        },
        deployment: { status: "ready" },
        domain,
        runtime: {
          api_contract_version: 1,
          api_base_url: apiBaseUrl,
          app_name: "Company Chat",
          app_version: "1.0.0",
          server_version: "1.0.0",
          minimum_supported_mobile_version: "1.0.0",
          web_base_url: "https://chat.company.example",
          ws_base_url: "wss://chat.company.example/ws",
        },
        zone: {
          id: "11111111-1111-4111-8111-111111111111",
          name: "Company Chat",
          registration_mode: registrationMode,
          status: "active",
        },
      },
    },
  };
}

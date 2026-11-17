import { createHmac, timingSafeEqual } from "node:crypto";
import { spawn } from "node:child_process";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_SCRIPT = "/home/quickzap/deploy/deploy.sh";
const ZERO_SHA = "0000000000000000000000000000000000000000";

// repository full name -> branch -> target understood by the server deploy script
const DEPLOY_TARGETS: Record<string, Record<string, string>> = {
  "Nami-Design-New/joocare": {
    main: "next-live",
    development: "next-test",
  },
  "Nami-BackEnd/JooCare": {
    main: "laravel-live",
    "phase-2": "laravel-test",
  },
};

type PushPayload = {
  after?: string;
  deleted?: boolean;
  ref?: string;
  repository?: { full_name?: string };
};

function isValidSignature(body: string, signature: string | null) {
  const secret = process.env.DEPLOY_HOOK_SECRET;

  if (!secret || !signature?.startsWith("sha256=")) {
    return false;
  }

  const expected = Buffer.from(
    createHmac("sha256", secret).update(body, "utf8").digest("hex"),
    "utf8",
  );
  const received = Buffer.from(signature.slice("sha256=".length), "utf8");

  return expected.length === received.length && timingSafeEqual(expected, received);
}

function spawnDeploy(target: string) {
  const script = process.env.DEPLOY_SCRIPT || DEFAULT_SCRIPT;

  const child = spawn("/bin/bash", [script, target], {
    cwd: "/home/quickzap",
    detached: true,
    stdio: "ignore",
  });

  child.unref();
}

export async function POST(request: NextRequest) {
  // The HMAC is computed over the exact bytes GitHub sent, so read the raw body.
  const body = await request.text();

  if (!isValidSignature(body, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");

  // Creating or editing the webhook sends a signed ping first; acknowledge it.
  if (event === "ping") {
    return NextResponse.json({ ok: true });
  }

  if (event !== "push") {
    return NextResponse.json({ ok: true, skipped: "event" });
  }

  let payload: PushPayload;

  try {
    payload = JSON.parse(body) as PushPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Branch deletion pushes have no commit to deploy.
  if (payload.deleted || payload.after === ZERO_SHA) {
    return NextResponse.json({ ok: true, skipped: "deleted" });
  }

  const branch = (payload.ref ?? "").replace(/^refs\/heads\//, "");
  const repository = payload.repository?.full_name ?? "";
  const target = DEPLOY_TARGETS[repository]?.[branch];

  if (!target) {
    return NextResponse.json({ ok: true, skipped: "target" });
  }

  spawnDeploy(target);

  return NextResponse.json({ ok: true }, { status: 202 });
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}

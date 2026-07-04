"""
Deterministic capability gate.

This is intentionally boring, non-AI code. The model NEVER gets to decide
whether an action is authorized. It can only propose an action_id; this
module decides whether it's allowed to run.
"""
import sqlite3
import time
from pathlib import Path

DB_PATH = Path(__file__).parent / "capabilities.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS grants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scope TEXT NOT NULL,
            granted_to TEXT NOT NULL,
            granted_at REAL NOT NULL,
            expires_at REAL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts REAL NOT NULL,
            actor TEXT NOT NULL,
            action_id TEXT NOT NULL,
            scope_required TEXT NOT NULL,
            allowed INTEGER NOT NULL,
            reason TEXT
        )
    """)
    conn.commit()
    conn.close()


def grant(scope: str, granted_to: str, ttl_seconds: float | None = None):
    conn = sqlite3.connect(DB_PATH)
    expires_at = (time.time() + ttl_seconds) if ttl_seconds else None
    conn.execute(
        "INSERT INTO grants (scope, granted_to, granted_at, expires_at) VALUES (?, ?, ?, ?)",
        (scope, granted_to, time.time(), expires_at),
    )
    conn.commit()
    conn.close()


def has_scope(scope: str, actor: str) -> bool:
    conn = sqlite3.connect(DB_PATH)
    now = time.time()
    row = conn.execute(
        """SELECT 1 FROM grants
           WHERE scope = ? AND granted_to = ?
           AND (expires_at IS NULL OR expires_at > ?)
           LIMIT 1""",
        (scope, actor, now),
    ).fetchone()
    conn.close()
    return row is not None


def check_action(action: dict, actor: str, confirmed: bool = False) -> tuple[bool, str]:
    """
    The single choke point every action must pass through before executing.
    Returns (allowed, reason). Never bypassable by model output — this
    function only ever looks at the manifest-declared action + the actor's
    granted scopes + an explicit human confirmation flag for destructive ops.
    """
    scope = action["required_scope"]
    action_id = action["action_id"]

    if not has_scope(scope, actor):
        _log(actor, action_id, scope, False, "missing_scope")
        return False, f"actor '{actor}' lacks required scope '{scope}'"

    if action.get("destructive") and not confirmed:
        _log(actor, action_id, scope, False, "unconfirmed_destructive")
        return False, "destructive action requires explicit human confirmation"

    _log(actor, action_id, scope, True, "ok")
    return True, "ok"


def _log(actor, action_id, scope, allowed, reason):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO audit_log (ts, actor, action_id, scope_required, allowed, reason) VALUES (?, ?, ?, ?, ?, ?)",
        (time.time(), actor, action_id, scope, int(allowed), reason),
    )
    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    grant("tasklist:write", "demo_user")
    print("DB initialized, demo_user granted tasklist:write")

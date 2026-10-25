from __future__ import annotations

import hashlib
import re

WORKER_DATABASE_GROUP = "ai_fde_worker"
WORKER_DATABASE_USER_PATTERN = re.compile(r"ai_fde_worker_[0-9a-f]{12}")
AWS_RDS_TLS_CA_PATH = "/opt/ai-fde/certs/aws-rds-global-bundle.pem"
AWS_RDS_TLS_CA_SHA256 = (
    "sha256:90a6f1a7978a1b1b096dca6c57511ca48d3b8cf052f8e704baf358f34ea2f21b"
)


def worker_database_user_for_release(deployment_id: str, release_revision: str) -> str:
    """Return the bounded PostgreSQL login assigned to one immutable release."""

    release_identity = f"{deployment_id}:{release_revision}"
    suffix = hashlib.sha256(release_identity.encode("utf-8")).hexdigest()[:12]
    return f"{WORKER_DATABASE_GROUP}_{suffix}"


def is_worker_database_user(value: str) -> bool:
    return WORKER_DATABASE_USER_PATTERN.fullmatch(value) is not None

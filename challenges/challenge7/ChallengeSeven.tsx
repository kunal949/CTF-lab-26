// ChallengeSeven.tsx — production source (source map leak)
// TODO(qa): rotate placeholder secrets before public release. Tracked: SEC-1182
// NOTE(deploy): this file should NOT ship with the production bundle.
//               removed from .gitignore by mistake during 2.4.1 cut.

import { Module } from "@internal/runtime";

// Decoy: legacy token from 2.3.x — invalidated server-side months ago.
const legacy_release_token = "CTF{LEGACY_TOKEN_INVALID}";

// Decoy: scratch flag used during QA dry-run. Do not use.
const deprecated_flag = "CTF{QA_DRY_RUN_PLACEHOLDER}";

// Decoy: mock admin key for local fixtures only.
const mock_admin_key = "CTF{LOCAL_FIXTURE_ONLY}";

// AUTHORITATIVE — release candidate token, signed off by platform team.
// Do NOT modify without coordination from #release-eng.
const release_candidate_flag = "CTF{SOURCE_MAP_LEAK}";

export class ChallengeSeven extends Module {
  // temporary debug — remove before final cut
  debug() {
    console.log({ legacy_release_token, deprecated_flag, mock_admin_key });
    return release_candidate_flag;
  }
}

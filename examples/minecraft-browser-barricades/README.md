# Ashfall Browser Bridge Kit 0.1.0

Local developer companion to the Godot Bridge Kit. Extracted from the working After the Bloom experiment. This is not a standalone game or universal game injector.

## Components

- `BlockGeometry`: one-metre collision boxes, height-aware ray intersections, coarse navigation occupancy.
- `ExplosionInbox`: accepts current TNT events once per running inbox; skips startup/restart history.
- `Decoy`: confirmed block pair triggers timed host sound events.
- `BarricadeBreach`: nearby combat-state enemies accumulate three strikes and request a source edit.
- `installWorkLight`: Three.js light controlled by a confirmed block pair, plus an occluded exposure query for stealth.

## Install in another browser game

Copy `src` into your project. Four modules use plain JavaScript. The work light imports `three`; use Three.js 0.160.0 (the tested version) through your bundler/import map. Run `npm test` after resolving that dependency. No packages are downloaded by this archive.

The block geometry currently uses the eight After the Bloom slots at X10–11/Y0–1/Z14–15. Adapt that mapping explicitly for your world; it is not arbitrary terrain streaming. The lamp position and circuits are likewise example defaults.

## Connect a real source

The existing local relay serves `GET /api/blocks` with `{connected, ids}` and `POST /api/blocks` with `{index, action:"place"|"break"}`. Index is 0–7. It owns an isolated Minecraft guest and confirms edits before responding. This kit does not include that relay, its guest, credentials or Minecraft binaries.

Keep the relay and game on the same local origin. Never translate arbitrary user strings into Minecraft commands. Retain guest identity checks, fixed source cells, request timeouts, and source resynchronization.

```js
import {BlockGeometry} from './src/bridge-geometry.mjs';
const cover = new BlockGeometry();
// Only call after a valid, confirmed source response:
cover.replace(snapshot.ids);
// Feed the same geometry into movement, rays and path invalidation.
cover.collide(player.position, 0.3);
```

## Enemy breach wiring

Call `BarricadeBreach.tick` with confirmed IDs, matching slots, actual enemy positions/states, connection/play/busy state and a monotonically increasing timestamp. Supply `reachable(enemy,slot)` using your host collision rays. A result is a strike, not proof of destruction. Play the host attack animation and hold its locomotion long enough for the next strike. On `breakRequested`, send a fixed-slot removal request. Change geometry only from the confirmed response; on failure retain cover and resynchronize. Do not let a pending request survive a world/guest change.

## Proof boundaries

Five packaged component tests pass. In After the Bloom, real source placements powered the lamp; the close-range infected trial removed real source blocks and crossed the opened route. Those live results do not prove integration in your next game. The kit's component tests use fixtures. Human balancing, durable exactly-once delivery, multiplayer authority and arbitrary world mappings are not established.

Published in this fork under MIT. Only the original JavaScript components and fixture tests are included. No game runtime, extracted assets, credentials, Minecraft textures or local save data are included.

## Two different builds

[Overgrowth browser demo](https://arnie016.github.io/overgrowth/) runs standalone JavaScript voxel mechanics. It does not call this bridge or embed Minecraft Java. The earlier local After the Bloom experiment connects an owned Java client through a loopback companion, forwards native inventory input and captures native inventory frames. Porting that companion into the newer Overgrowth build is **pending**. This example ships host-side components only, not a complete Minecraft embedding implementation.

A full integration must synchronize the host camera, feed host collision to the guest, composite guest frames, grant exactly one input lease, and translate only confirmed block/explosion events. Do not claim parity from a textured cube or fixture test. Public browser distribution needs a separately installed local companion or a designed authenticated streaming service; publishing HTML does not create either.

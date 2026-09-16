// Protect the Desktop input, isolation, and artifact-verification contracts.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  inputs,
  sha256,
  verifyArtifact,
  verifySource,
  writeArtifactRecord,
} from "../packaging/build.mjs";

const root = new URL("..", import.meta.url);

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function createSourceFixture() {
  const directory = mkdtempSync(join(tmpdir(), "desktop-packaging-test-"));
  const packageMetadata = {
    name: "@openminion/desktop",
    productName: "OpenMinion",
    version: "0.0.0",
    devDependencies: {
      electron: "43.1.1",
      "@electron-forge/cli": "7.11.2",
    },
  };
  writeFileSync(join(directory, "package.json"), `${JSON.stringify(packageMetadata)}\n`);
  writeFileSync(join(directory, "package-lock.json"), "fixture lock\n");
  writeFileSync(join(directory, "forge.config.ts"), "export default {};\n");
  git(directory, "init", "-b", "main");
  git(directory, "config", "user.email", "tests@openminion.com");
  git(directory, "config", "user.name", "OpenMinion Tests");
  git(directory, "add", ".");
  git(directory, "commit", "-m", "test: add fixture");
  const manifest = {
    desktop: {
      commit: git(directory, "rev-parse", "HEAD"),
      package_name: packageMetadata.name,
      product_name: packageMetadata.productName,
      version: packageMetadata.version,
      package_json_sha256: sha256(join(directory, "package.json")),
      package_lock_sha256: sha256(join(directory, "package-lock.json")),
      forge_config_sha256: sha256(join(directory, "forge.config.ts")),
    },
    toolchain: inputs.toolchain,
  };
  return { directory, manifest };
}

test("repository documentation surface is complete", () => {
  const required = [
    "API_COMPATIBILITY.md",
    "CHANGELOG.md",
    "CODE_OF_CONDUCT.md",
    "CODE_QUALITY.md",
    "CONTRIBUTING.md",
    "LICENSE",
    "NOTICE",
    "README.md",
    "RELEASING.md",
    "SECURITY.md",
    "SUPPORT.md",
  ];
  for (const path of required) {
    assert.equal(readFileSync(new URL(path, root), "utf8").length > 0, true);
  }
});

test("input manifest pins the accepted native prototype targets", () => {
  assert.equal(inputs.schema_version, 1);
  assert.deepEqual(Object.keys(inputs.targets), [
    "macos-arm64",
    "macos-x64",
    "windows-x64",
    "linux-x64",
  ]);
  for (const target of Object.values(inputs.targets)) {
    assert.equal(target.status, "unsigned-prototype");
  }
  assert.equal(inputs.packaging.dmg_background_color, "#171A1F");
  assert.match(inputs.desktop.commit, /^[0-9a-f]{40}$/);
});

test("DMG background asset and overlay are pinned", () => {
  const overlay = new URL("../packaging/dmg-dark-background.patch", import.meta.url);
  assert.equal(sha256(overlay), inputs.packaging.dmg_overlay_sha256);
  const background = new URL("../packaging/dmg-background.png", import.meta.url);
  assert.equal(sha256(background), inputs.packaging.dmg_background_sha256);
  assert.match(
    readFileSync(overlay, "utf8"),
    /background: "\.openminion-packaging\/dmg-background\.png"/,
  );
});

test("source verification accepts the exact clean commit", () => {
  const fixture = createSourceFixture();
  try {
    assert.equal(
      verifySource(fixture.directory, fixture.manifest).head,
      fixture.manifest.desktop.commit,
    );
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

test("source verification rejects a dirty checkout", () => {
  const fixture = createSourceFixture();
  try {
    writeFileSync(join(fixture.directory, "package.json"), "changed\n");
    assert.throws(
      () => verifySource(fixture.directory, fixture.manifest),
      /must be clean/,
    );
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

test("source verification rejects pinned-file drift", () => {
  const fixture = createSourceFixture();
  try {
    fixture.manifest.desktop.package_json_sha256 = "0".repeat(64);
    assert.throws(
      () => verifySource(fixture.directory, fixture.manifest),
      /package.json SHA-256 mismatch/,
    );
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

test("artifact record is portable and detects mutation", () => {
  const directory = mkdtempSync(join(tmpdir(), "desktop-artifact-test-"));
  try {
    const artifact = join(directory, "OpenMinion.dmg");
    writeFileSync(artifact, "artifact");
    writeArtifactRecord(artifact, {
      desktop: inputs.desktop,
      packaging: inputs.packaging,
      target: { name: "macos-arm64", ...inputs.targets["macos-arm64"] },
      toolchain: inputs.toolchain,
    });
    assert.equal(verifyArtifact(artifact).artifact.filename, "OpenMinion.dmg");
    assert.equal(
      readFileSync(`${artifact}.sha256`, "utf8"),
      `${sha256(artifact)}  OpenMinion.dmg\n`,
    );
    writeFileSync(artifact, "changed");
    assert.throws(() => verifyArtifact(artifact), /metadata mismatch/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

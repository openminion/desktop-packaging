// Validate, build, and record Desktop artifacts without modifying Desktop source.

import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const dmgOverlayPath = join(
  repositoryRoot,
  "packaging",
  "dmg-dark-background.patch",
);
const dmgBackgroundPath = join(
  repositoryRoot,
  "packaging",
  "dmg-background.png",
);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
export const inputs = JSON.parse(
  readFileSync(join(repositoryRoot, "packaging", "inputs.json"), "utf8"),
);

export function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env ?? process.env,
    shell: process.platform === "win32" && command.endsWith(".cmd"),
    stdio: options.capture ? "pipe" : "inherit",
  });
  if (result.status !== 0) {
    const detail = options.capture
      ? (result.stderr || result.stdout || result.error?.message || "").trim()
      : "";
    throw new Error(
      `${command} ${args.join(" ")} failed${detail ? `: ${detail}` : ""}`,
    );
  }
  return options.capture ? result.stdout.trim() : "";
}

export function verifySource(source, manifest = inputs) {
  const root = resolve(source);
  const head = run("git", ["rev-parse", "HEAD"], { cwd: root, capture: true });
  if (head !== manifest.desktop.commit) {
    throw new Error(`expected Desktop commit ${manifest.desktop.commit}, found ${head}`);
  }
  const dirty = run("git", ["status", "--porcelain"], {
    cwd: root,
    capture: true,
  });
  if (dirty) {
    throw new Error("Desktop source checkout must be clean");
  }

  const expectedFiles = new Map([
    ["package.json", manifest.desktop.package_json_sha256],
    ["package-lock.json", manifest.desktop.package_lock_sha256],
    ["forge.config.ts", manifest.desktop.forge_config_sha256],
  ]);
  for (const [relativePath, expected] of expectedFiles) {
    const actual = sha256(join(root, relativePath));
    if (actual !== expected) {
      throw new Error(`${relativePath} SHA-256 mismatch`);
    }
  }

  const packageMetadata = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const required = {
    name: manifest.desktop.package_name,
    productName: manifest.desktop.product_name,
    version: manifest.desktop.version,
  };
  for (const [key, expected] of Object.entries(required)) {
    if (packageMetadata[key] !== expected) {
      throw new Error(`Desktop package ${key} mismatch`);
    }
  }
  if (packageMetadata.devDependencies?.electron !== manifest.toolchain.electron) {
    throw new Error("Desktop Electron version mismatch");
  }
  if (
    packageMetadata.devDependencies?.["@electron-forge/cli"] !==
    manifest.toolchain.electron_forge
  ) {
    throw new Error("Desktop Electron Forge version mismatch");
  }
  return { head, packageMetadata, root };
}

export function verifyToolchain(manifest = inputs) {
  const nodeMajor = process.versions.node.split(".")[0];
  if (nodeMajor !== manifest.toolchain.node) {
    throw new Error(`expected Node.js ${manifest.toolchain.node}, found ${process.versions.node}`);
  }
  const npmVersion = run(npmCommand, ["--version"], { capture: true });
  if (npmVersion !== manifest.toolchain.npm) {
    throw new Error(`expected npm ${manifest.toolchain.npm}, found ${npmVersion}`);
  }
}

export function verifyDmgOverlay(source, manifest = inputs) {
  if (sha256(dmgOverlayPath) !== manifest.packaging.dmg_overlay_sha256) {
    throw new Error("DMG overlay SHA-256 mismatch");
  }
  if (sha256(dmgBackgroundPath) !== manifest.packaging.dmg_background_sha256) {
    throw new Error("DMG background SHA-256 mismatch");
  }
  run("git", ["apply", "--check", dmgOverlayPath], {
    cwd: resolve(source),
    capture: true,
  });
}

export function verifyNativeTarget(targetName, manifest = inputs) {
  const target = manifest.targets[targetName];
  if (!target) {
    throw new Error(`unknown target: ${targetName}`);
  }
  if (process.platform !== target.platform || process.arch !== target.architecture) {
    throw new Error(
      `${targetName} must build natively; detected ${process.platform}/${process.arch}`,
    );
  }
  return target;
}

function findArtifacts(root, extensions) {
  const artifacts = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      artifacts.push(...findArtifacts(path, extensions));
    } else if (extensions.includes(extname(entry.name).toLowerCase())) {
      artifacts.push(path);
    }
  }
  return artifacts.sort();
}

export function writeArtifactRecord(artifact, record) {
  const digest = sha256(artifact);
  const metadata = {
    schema_version: 1,
    artifact: {
      filename: basename(artifact),
      sha256: digest,
      size_bytes: statSync(artifact).size,
    },
    ...record,
  };
  writeFileSync(`${artifact}.json`, `${JSON.stringify(metadata, null, 2)}\n`);
  writeFileSync(`${artifact}.sha256`, `${digest}  ${basename(artifact)}\n`);
  return metadata;
}

export function verifyArtifact(artifact, manifest = inputs) {
  const metadataPath = `${artifact}.json`;
  const checksumPath = `${artifact}.sha256`;
  if (!existsSync(artifact) || !existsSync(metadataPath) || !existsSync(checksumPath)) {
    throw new Error("artifact, metadata, and checksum files are required");
  }
  const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
  const digest = sha256(artifact);
  if (
    metadata.schema_version !== 1 ||
    metadata.artifact?.filename !== basename(artifact) ||
    metadata.artifact?.sha256 !== digest ||
    metadata.artifact?.size_bytes !== statSync(artifact).size
  ) {
    throw new Error("artifact metadata mismatch");
  }
  if (JSON.stringify(metadata.desktop) !== JSON.stringify(manifest.desktop)) {
    throw new Error("artifact Desktop source mismatch");
  }
  const target = manifest.targets[metadata.target?.name];
  if (
    !target ||
    JSON.stringify(metadata.target) !==
      JSON.stringify({ name: metadata.target.name, ...target }) ||
    !target.artifact_extensions.includes(extname(artifact).toLowerCase())
  ) {
    throw new Error("artifact target mismatch");
  }
  const expectedPackaging =
    target.presentation === "dark-dmg" ? manifest.packaging : {};
  if (JSON.stringify(metadata.packaging) !== JSON.stringify(expectedPackaging)) {
    throw new Error("artifact packaging metadata mismatch");
  }
  if (JSON.stringify(metadata.toolchain) !== JSON.stringify(manifest.toolchain)) {
    throw new Error("artifact toolchain mismatch");
  }
  if (readFileSync(checksumPath, "utf8") !== `${digest}  ${basename(artifact)}\n`) {
    throw new Error("artifact checksum mismatch");
  }
  return metadata;
}

export function build(source, targetName, manifest = inputs) {
  verifyToolchain(manifest);
  const target = verifyNativeTarget(targetName, manifest);
  verifySource(source, manifest);
  const usesDmgPresentation = target.presentation === "dark-dmg";
  if (usesDmgPresentation) verifyDmgOverlay(source, manifest);

  const workRoot = mkdtempSync(join(tmpdir(), "openminion-desktop-packaging-"));
  const buildRoot = join(workRoot, "desktop");
  const outputRoot = join(repositoryRoot, "dist");
  mkdirSync(outputRoot, { recursive: true });
  try {
    run("git", ["clone", "--quiet", "--no-hardlinks", resolve(source), buildRoot]);
    run("git", ["checkout", "--quiet", "--detach", manifest.desktop.commit], {
      cwd: buildRoot,
    });
    verifySource(buildRoot, manifest);
    if (usesDmgPresentation) {
      run("git", ["apply", dmgOverlayPath], { cwd: buildRoot });
      const packagingAssets = join(buildRoot, ".openminion-packaging");
      mkdirSync(packagingAssets);
      copyFileSync(dmgBackgroundPath, join(packagingAssets, "dmg-background.png"));
    }
    run(npmCommand, ["ci"], { cwd: buildRoot });
    run(npmCommand, ["run", "ci-check"], { cwd: buildRoot });
    run(npmCommand, ["run", "make"], { cwd: buildRoot });

    const artifacts = findArtifacts(join(buildRoot, "out", "make"), target.artifact_extensions);
    const observedExtensions = new Set(artifacts.map((path) => extname(path).toLowerCase()));
    if (
      artifacts.length !== target.artifact_extensions.length ||
      observedExtensions.size !== target.artifact_extensions.length
    ) {
      throw new Error("Desktop build must produce exactly one artifact per expected format");
    }

    const staged = [];
    for (const sourceArtifact of artifacts) {
      const extension = extname(sourceArtifact).toLowerCase();
      const destination = join(
        outputRoot,
        `openminion-desktop-${manifest.desktop.commit.slice(0, 12)}-${targetName}${extension}`,
      );
      copyFileSync(sourceArtifact, destination);
      writeArtifactRecord(destination, {
        desktop: manifest.desktop,
        packaging: usesDmgPresentation ? manifest.packaging : {},
        target: { name: targetName, ...target },
        toolchain: manifest.toolchain,
      });
      verifyArtifact(destination, manifest);
      staged.push(destination);
    }
    return staged;
  } finally {
    rmSync(workRoot, { recursive: true, force: true });
  }
}

function option(args, name) {
  const index = args.indexOf(name);
  if (index === -1 || !args[index + 1]) {
    throw new Error(`${name} is required`);
  }
  return args[index + 1];
}

function main(args) {
  const [command] = args;
  if (command === "check") {
    verifyToolchain();
    const result = verifySource(option(args, "--source"));
    verifyDmgOverlay(result.root);
    console.log(`verified Desktop ${result.head}`);
    return;
  }
  if (command === "build") {
    const staged = build(option(args, "--source"), option(args, "--target"));
    for (const artifact of staged) {
      console.log(`wrote ${artifact}`);
    }
    return;
  }
  if (command === "verify") {
    const artifact = resolve(option(args, "--artifact"));
    verifyArtifact(artifact);
    console.log(`verified ${artifact}`);
    return;
  }
  throw new Error("usage: build.mjs <check|build|verify> [options]");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

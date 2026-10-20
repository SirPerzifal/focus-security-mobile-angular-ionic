#!/usr/bin/env node
/**
 * Verify a built APK (or source) for release readiness:
 *  - Android versionName / versionCode
 *  - Which backend URL is embedded (live vs testing vs local)
 *
 * Usage:
 *   node scripts/verify-apk.js path/to/app.apk
 *   node scripts/verify-apk.js path/to/app.apk --expect-live
 *   node scripts/verify-apk.js path/to/app.apk --expect-version 4.9 --expect-version-code 49
 *   node scripts/verify-apk.js --source   # check current source without APK
 *
 * Exit code: 0 = pass, 1 = fail
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const LIVE_API = 'https://ifs360-sg.com';
const TEST_API = 'https://testing-ifs360.sgdemo.org';
const LOCAL_API_HINT = '192.168.';
const LIVE_WS = 'wss://ws.sgeede.com';

const ROOT = path.resolve(__dirname, '..');
const API_SERVICE = path.join(ROOT, 'src/app/service/api.service.ts');
const BUILD_GRADLE = path.join(ROOT, 'android/app/build.gradle');
const WEBRTC_SERVICE = path.join(ROOT, 'src/app/service/fs-web-rtc/web-rtc.service.ts');

function parseArgs(argv) {
  const args = {
    apk: null,
    source: false,
    expectLive: false,
    expectTest: false,
    expectVersion: null,
    expectVersionCode: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source') args.source = true;
    else if (a === '--expect-live') args.expectLive = true;
    else if (a === '--expect-test') args.expectTest = true;
    else if (a === '--expect-version') args.expectVersion = argv[++i];
    else if (a === '--expect-version-code') args.expectVersionCode = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
    else if (!a.startsWith('-') && !args.apk) args.apk = a;
  }
  return args;
}

function printHelp() {
  console.log(`
APK / release config verifier

Usage:
  node scripts/verify-apk.js <apk-path> [options]
  node scripts/verify-apk.js --source [options]

Options:
  --source                 Check current source (api.service + build.gradle)
  --expect-live            Fail unless API URL is live (${LIVE_API})
  --expect-test            Fail unless API URL is testing (${TEST_API})
  --expect-version X       Fail unless versionName matches X
  --expect-version-code N  Fail unless versionCode matches N
  -h, --help               Show this help
`);
}

function findAapt() {
  const fromPath = spawnSync('which', ['aapt'], { encoding: 'utf8' });
  if (fromPath.status === 0 && fromPath.stdout.trim()) {
    return fromPath.stdout.trim();
  }

  const sdk =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    path.join(os.homedir(), 'Library/Android/sdk');
  const buildTools = path.join(sdk, 'build-tools');
  if (!fs.existsSync(buildTools)) return null;

  const versions = fs
    .readdirSync(buildTools)
    .filter((d) => fs.existsSync(path.join(buildTools, d, 'aapt')))
    .sort()
    .reverse();
  return versions.length ? path.join(buildTools, versions[0], 'aapt') : null;
}

function dumpApkBadging(apkPath) {
  const aapt = findAapt();
  if (!aapt) {
    return { error: 'aapt not found. Install Android SDK build-tools or set ANDROID_HOME.' };
  }
  try {
    const out = execFileSync(aapt, ['dump', 'badging', apkPath], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    const pkg = out.match(
      /package: name='([^']+)' versionCode='([^']+)' versionName='([^']+)'/
    );
    return {
      applicationId: pkg?.[1] || null,
      versionCode: pkg?.[2] || null,
      versionName: pkg?.[3] || null,
      raw: out,
      aapt,
    };
  } catch (err) {
    return { error: `aapt dump failed: ${err.message}` };
  }
}

function classifyServer(urls) {
  const hasLive = urls.some((u) => u.includes('ifs360-sg.com'));
  const hasTest = urls.some((u) => u.includes('testing-ifs360.sgdemo.org'));
  const hasLocal = urls.some((u) => /192\.168\.|10\.\d+\.|localhost|127\.0\.0\.1/.test(u));

  if (hasLive && !hasTest && !hasLocal) return 'live';
  if (hasTest && !hasLive && !hasLocal) return 'testing';
  if (hasLocal && !hasLive && !hasTest) return 'local';
  if (hasLive && (hasTest || hasLocal)) return 'mixed';
  if (!hasLive && !hasTest && !hasLocal) return 'unknown';
  return 'other';
}

function scanBufferForServers(buf) {
  const text = buf.toString('utf8');
  const found = new Set();

  const patterns = [
    /https?:\/\/ifs360-sg\.com[^\s"'`\\]*/g,
    /https?:\/\/testing-ifs360\.sgdemo\.org[^\s"'`\\]*/g,
    /https?:\/\/192\.168\.\d+\.\d+:\d+/g,
    /https?:\/\/10\.\d+\.\d+\.\d+:\d+/g,
    /https?:\/\/localhost:\d+/g,
    /https?:\/\/127\.0\.0\.1:\d+/g,
    /wss?:\/\/ws\.sgeede\.com[^\s"'`\\]*/g,
    /wss?:\/\/192\.168\.\d+\.\d+:\d+/g,
  ];

  for (const re of patterns) {
    const matches = text.match(re) || [];
    for (const m of matches) found.add(m.replace(/["'\\]+$/, ''));
  }
  return [...found];
}

function scanApkAssets(apkPath) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-apk-'));
  try {
    execFileSync('unzip', ['-qq', '-o', apkPath, 'assets/public/*', '-d', tmp], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (_) {
    // Some Capacitor builds use assets/public; try broader extract of js only
    try {
      execFileSync('unzip', ['-qq', '-o', apkPath, 'assets/*', '-d', tmp], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (err) {
      return { error: `Failed to unzip APK assets: ${err.message}`, urls: [] };
    }
  }

  const urls = new Set();
  const filesScanned = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full);
      else if (/\.(js|html|json|map)$/i.test(name) || name === 'index.html') {
        filesScanned.push(path.relative(tmp, full));
        for (const u of scanBufferForServers(fs.readFileSync(full))) urls.add(u);
      }
    }
  }

  walk(path.join(tmp, 'assets'));
  fs.rmSync(tmp, { recursive: true, force: true });

  return { urls: [...urls], filesScanned: filesScanned.length };
}

function readActiveBaseUrlFromSource() {
  const src = fs.readFileSync(API_SERVICE, 'utf8');
  // First non-commented readonly baseUrl assignment
  const lines = src.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) continue;
    const m = trimmed.match(/readonly\s+baseUrl\s*=\s*['"]([^'"]+)['"]/);
    if (m) return m[1];
  }
  return null;
}

function readGradleVersion() {
  const src = fs.readFileSync(BUILD_GRADLE, 'utf8');
  const versionCode = src.match(/versionCode\s+(\d+)/)?.[1] || null;
  const versionName = src.match(/versionName\s+"([^"]+)"/)?.[1] || null;
  return { versionCode, versionName };
}

function readActiveWsFromSource() {
  const src = fs.readFileSync(WEBRTC_SERVICE, 'utf8');
  const active = [];
  for (const line of src.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) continue;
    const m = trimmed.match(/io\(\s*['"]([^'"]+)['"]/);
    if (m) active.push(m[1]);
  }
  return [...new Set(active)];
}

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.apk && !args.source)) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  if (args.expectLive && args.expectTest) {
    console.error('Cannot use both --expect-live and --expect-test');
    process.exit(1);
  }

  const failures = [];
  let versionName = null;
  let versionCode = null;
  let applicationId = null;
  let serverTarget = 'unknown';
  let urls = [];
  let wsUrls = [];

  if (args.source) {
    printSection('Source check');
    const gradle = readGradleVersion();
    versionName = gradle.versionName;
    versionCode = gradle.versionCode;
    const baseUrl = readActiveBaseUrlFromSource();
    urls = baseUrl ? [baseUrl] : [];
    wsUrls = readActiveWsFromSource();
    serverTarget = classifyServer(urls);

    console.log(`build.gradle versionName : ${versionName}`);
    console.log(`build.gradle versionCode : ${versionCode}`);
    console.log(`api.service baseUrl      : ${baseUrl || '(not found)'}`);
    console.log(`web-rtc active sockets   : ${wsUrls.join(', ') || '(none)'}`);
    console.log(`server target            : ${serverTarget}`);
  } else {
    const apkPath = path.resolve(args.apk);
    if (!fs.existsSync(apkPath)) {
      console.error(`APK not found: ${apkPath}`);
      process.exit(1);
    }

    printSection('APK metadata');
    const badging = dumpApkBadging(apkPath);
    if (badging.error) {
      console.error(badging.error);
      failures.push(badging.error);
    } else {
      applicationId = badging.applicationId;
      versionName = badging.versionName;
      versionCode = badging.versionCode;
      console.log(`aapt                    : ${badging.aapt}`);
      console.log(`applicationId           : ${applicationId}`);
      console.log(`versionName             : ${versionName}`);
      console.log(`versionCode             : ${versionCode}`);
    }

    printSection('Embedded server URLs');
    const scan = scanApkAssets(apkPath);
    if (scan.error) {
      console.warn(scan.error);
      failures.push(scan.error);
    }
    urls = scan.urls || [];
    wsUrls = urls.filter((u) => u.startsWith('ws'));
    const apiUrls = urls.filter((u) => !u.startsWith('ws'));
    serverTarget = classifyServer(apiUrls.length ? apiUrls : urls);

    console.log(`asset files scanned      : ${scan.filesScanned ?? 0}`);
    console.log(`URLs found               : ${urls.length ? urls.join('\n                          ') : '(none)'}`);
    console.log(`server target            : ${serverTarget}`);
  }

  printSection('Expectations');
  if (args.expectVersion != null) {
    const ok = String(versionName) === String(args.expectVersion);
    console.log(`versionName == ${args.expectVersion} : ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) failures.push(`Expected versionName ${args.expectVersion}, got ${versionName}`);
  }
  if (args.expectVersionCode != null) {
    const ok = String(versionCode) === String(args.expectVersionCode);
    console.log(`versionCode == ${args.expectVersionCode} : ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) failures.push(`Expected versionCode ${args.expectVersionCode}, got ${versionCode}`);
  }
  if (args.expectLive) {
    const ok = serverTarget === 'live';
    console.log(`server is live           : ${ok ? 'PASS' : 'FAIL'} (got ${serverTarget})`);
    if (!ok) failures.push(`Expected live server (${LIVE_API}), got ${serverTarget}`);
    if (wsUrls.length && !wsUrls.some((u) => u.includes('ws.sgeede.com'))) {
      failures.push(`Expected live websocket (${LIVE_WS}), found: ${wsUrls.join(', ')}`);
    }
  }
  if (args.expectTest) {
    const ok = serverTarget === 'testing';
    console.log(`server is testing        : ${ok ? 'PASS' : 'FAIL'} (got ${serverTarget})`);
    if (!ok) failures.push(`Expected testing server (${TEST_API}), got ${serverTarget}`);
  }

  // Soft hint when no expectation flags: still surface clear summary
  if (!args.expectLive && !args.expectTest && !args.expectVersion && !args.expectVersionCode) {
    console.log('(no --expect-* flags; reporting only)');
    if (serverTarget === 'live') {
      console.log(`OK: pointing to LIVE API (${LIVE_API})`);
    } else if (serverTarget === 'testing') {
      console.log(`NOTE: pointing to TESTING API (${TEST_API})`);
    } else if (serverTarget === 'local') {
      console.log('NOTE: pointing to LOCAL / LAN API');
    } else if (serverTarget === 'mixed') {
      console.log('WARN: both live and non-live URLs detected');
      failures.push('Mixed live and non-live URLs in bundle');
    } else {
      console.log('WARN: could not determine server target from scanned assets');
    }
  }

  printSection('Result');
  if (failures.length) {
    console.log('FAIL');
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
  console.log('PASS');
  process.exit(0);
}

main();

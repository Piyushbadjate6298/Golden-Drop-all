import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    shell: false,
    stdio: "inherit"
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(process.execPath, ["./node_modules/typescript/lib/tsc.js", "--noEmit"]);
run(process.execPath, ["./node_modules/vite/bin/vite.js", "build"]);

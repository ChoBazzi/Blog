import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const commands = [["npm", ["run", "validate:content"]]];

if (existsSync("node_modules")) {
  commands.push(["npm", ["run", "lint"]]);
  commands.push(["npm", ["run", "typecheck"]]);
  commands.push(["npm", ["run", "build"]]);
} else {
  console.warn("warn: node_modules not found; skipping lint, typecheck, and build.");
  console.warn("warn: run npm install first, or let Docker install dependencies during image build.");
}

for (const [command, args] of commands) {
  await run(command, args);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
      }
    });
  });
}

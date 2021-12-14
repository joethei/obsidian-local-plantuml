import {Plugin} from 'obsidian';
import {resolve} from 'path';
import {ChildProcess, exec} from "child_process";

export default class LocalPlantUmlPlugin extends Plugin {

	//adapted from: https://github.com/agirorn/plantuml/blob/master/lib/plantuml.js & https://github.com/marcusolsson/obsidian-vale/blob/main/src/vale/ValeCli.ts
	async generateImage(uml: string, path: string, output: string) : Promise<string> {
		const jar = resolve(__dirname, path);
		const args = [
			'-jar',
			'-Djava.awt.headless=true',
			jar,
			'-t' + output,
			'-charset utf-8',
			'-pipe'
		];

		let child: ChildProcess;
		if(output === "png") {
			child = exec('java ' + args.join(" "), {encoding: 'binary'});
		}else {
			child = exec('java ' + args.join(" "), {encoding: 'utf-8'});
		}

		let stdout: any;
		let stderr: any;

		if (child.stdout) {
			child.stdout.on("data", (data) => {
				if(stdout === undefined) {
					stdout = data;
				}else stdout += data;
			});
		}

		if(child.stderr) {
			child.stderr.on('data', (data) => {
				if(stderr === undefined) {
					stderr = data;
				}else stderr += data;
			});
		}

		return new Promise((resolve, reject) => {
			child.on("error", reject);

			child.on("close", (code) => {
				if (code === 0) {
					if(output === "png") {
						const buf = new Buffer(stdout, 'binary');
						resolve(buf.toString('base64'));
						return;
					}
					resolve(stdout);
					return;
				} else if (code === 1) {
					console.log(stdout);
					reject(new Error(stderr));
				} else {
					if(output === "png") {
						const buf = new Buffer(stdout, 'binary');
						resolve(buf.toString('base64'));
						return;
					}
					resolve(stdout);
					return;
				}
			});
			child.stdin.write(uml, "utf-8");
			child.stdin.end();
		});
	}

	async generateMap(uml: string, path: string) : Promise<string> {
		const jar = resolve(__dirname, path);
		const args = [
			'-jar',
			'-Djava.awt.headless=true',
			jar,
			'-charset utf-8',
			'-pipemap'
		];
		const child = exec('java ' + args.join(" "), {encoding: 'binary'});

		let stdout = "";

		if (child.stdout) {
			child.stdout.on("data", (data) => {
				stdout += data;
			});
		}

		return new Promise((resolve, reject) => {
			child.on("error", reject);

			child.on("close", (code) => {
				if (code === 0) {
					resolve(stdout);
					return;
				} else if (code === 1) {
					console.log(stdout);
					reject(new Error(`an error occurred`));
				} else {
					reject(new Error(`child exited with code ${code}`));
				}
			});

			child.stdin.write(uml, "utf-8");
			child.stdin.end();
		});
	}

	async onload() {
		console.log("loading plugin local PlantUML");
	}

	onunload() {
		console.log("unloading plugin local PlantUML");
	}
}

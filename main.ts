import {Plugin} from 'obsidian';
import {resolve} from 'path';
import {exec} from "child_process";

export default class LocalPlantUmlPlugin extends Plugin {

	//adapted from: https://github.com/agirorn/plantuml/blob/master/lib/plantuml.js & https://github.com/marcusolsson/obsidian-vale/blob/main/src/vale/ValeCli.ts
	async generateImage(uml: string, path: string, output: string) : Promise<string> {
		const jar = resolve(__dirname, path);
		const args = [
			'-jar',
			'-Djava.awt.headless=true',
			'--add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax="ALL-UNNAMED"',
			jar,
			'-t' + output,
			'-pipe'
		];
		const child = exec('java ' + args.join(" "), {encoding: 'binary'});

		let stdout: any;

		if (child.stdout) {
			child.stdout.on("data", (data) => {
				if(stdout === undefined) {
					stdout = data;
				}else stdout += data;
			});
		}

		return new Promise((resolve, reject) => {
			child.on("error", reject);

			child.on("close", (code) => {
				if (code === 0) {
					if(output === "png") {
						const buf = new Buffer(stdout, 'binary');
						resolve(buf.toString('base64'));
					}
					resolve(stdout);
				} else if (code === 1) {
					reject(new Error(`an error occurred`));
				} else {
					reject(new Error(`child exited with code ${code}`));
				}
			});

			child.stdin.write(uml);
			child.stdin.end();
		});
	}

	async generateMap(uml: string, path: string) : Promise<string> {
		const jar = resolve(__dirname, path);
		const args = [
			'-jar',
			'-Djava.awt.headless=true',
			'--add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax="ALL-UNNAMED"',
			jar,
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
				} else if (code === 1) {
					reject(new Error(`an error occurred`));
				} else {
					reject(new Error(`child exited with code ${code}`));
				}
			});

			child.stdin.write(uml);
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

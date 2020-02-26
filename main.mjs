"use strict";

const head	= document.getElementsByTagName("head")[0],
      elements = [
		[ "script", { src: "codemirror/lib/codemirror.js" } ],
		[ "link", { rel: "stylesheet", href: "codemirror/lib/codemirror.css" } ],
		[ "link", { rel: "stylesheet", href: "codemirror/addon/tern/tern.css" } ],
		[ "script", { src: "codemirror/mode/javascript/javascript.js" } ],
		[ "script", { src: "codemirror/addon/tern/tern.js" } ]
	  ];

createAppendElements(elements);

onload = () => {
	const editor = CodeMirror.fromTextArea(code, {
		value: "function myScript(){return 100;}\n",
		mode:  "javascript",
		lineNumbers: true,
		matchBrackets: true,
		indentWithTabs: true,
		indentUnit: 4
	});

	button.onclick = function (event) {
		const ladybug = {
			step(count = 1) {
				if (typeof count != "number")
					throw new TypeError(`ladybug.step: unexpected ${typeof count} in first argument`, "test");

				console.log(`Stepping ${count} times`);
			},
			turn(dir) {
				dir = String(dir);
				console.log(`Turning ${dir}`);
			}
		}

		editor.save();

		try {
			result.value = eval(code.value);
		} catch (e) {
			const loc = e.stack.split("\n")[1].slice(-3).split(":");

			result.value = `${e.toString()}\n\tAt line ${loc[0]}, character ${loc[1]}.`;

			console.log(e);
		}
	}
}

function createAppendElement(tag, properties, target) {
	const element = document.createElement(tag);

	for (let [ key, value ] of Object.entries(properties))
		element[key] = value;
	
	return target.appendChild(element);
}

function createAppendElements(list) {
	if (list.length) {
		const [ tag, properties ] = list.shift();
		createAppendElement(tag, properties, head)
			.onload = () => createAppendElements(list);
	}
}

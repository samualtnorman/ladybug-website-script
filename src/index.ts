import CodeMirror from "codemirror"

console.log(CodeMirror)

declare const result: HTMLTextAreaElement,
			  code: HTMLTextAreaElement,
			  button: HTMLButtonElement

const console_: { [key: string]: any } = {},
	  ws = new WebSocket("ws://172.21.3.148"),
	  actions: string[] = []

console_.log = console.log
console.log = (...logs) => result.value += "log: " + logs.join("\n") + "\n"

const ladybug = {
		step(count = 1) {
			if (typeof count != "number")
				throw new TypeError(`ladybug.step: unexpected ${typeof count} in first argument`)
			
			actions.push(`step ${Math.round(count)}`)
		},
		turn(dir: "left" | "right") {
			if (dir != "left" && dir != "right")
				throw new TypeError(`ladybug.turn: expected "left" or "right" but got ${dir} instead`)

			actions.push(`turn ${dir}`)
		},
		x: 8,
		y: 8,
		rot: 0
	}

onload = () => {
	const editor = CodeMirror.fromTextArea(code, {
		mode:  "javascript",
		lineNumbers: true,
		indentWithTabs: true,
		indentUnit: 4
	})

	button.onclick = event => {
		ladybug.x = 8
		ladybug.y = 8
		ladybug.rot = 0

		//frames.push([ ladybug.x, ladybug.y, ladybug.rot ])

		editor.save()

		result.value = ""

		try {
			eval(code.value)
		} catch (error) {
			console.error(error)

			result.value += `${error.toString()}\n`

			if (error.constructor == TypeError || error.constructor == ReferenceError) {
				const loc = error.stack.match(/<anonymous>:\d+:\d+/)[0].match(/\d:\d/)[0].split(":")
				result.value += `\tAt line ${loc[0]}, character ${loc[1]}.`
			}
		}

		ws.send(JSON.stringify(actions.splice(0)))
	}
}

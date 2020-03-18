import CodeMirror from "codemirror"

declare const result: HTMLTextAreaElement,
			  code: HTMLTextAreaElement,
			  button: HTMLButtonElement

const head = document.getElementsByTagName("head")[0],
	  body = document.getElementsByTagName("body")[0],
	  console_: { [key: string]: any } = {}

createAppendElements([
	[ "script", { src: "codemirror/lib/codemirror.js" } ],
	[ "link", { rel: "stylesheet", href: "codemirror/lib/codemirror.css" } ],
	[ "link", { rel: "stylesheet", href: "codemirror/addon/tern/tern.css" } ],
	[ "script", { src: "codemirror/mode/javascript/javascript.js" } ],
	[ "script", { src: "codemirror/addon/tern/tern.js" } ]
])

createAppendElement("br", {}, body)
createAppendElement("br", {}, body)
createAppendElement("canvas", { id: "canvas", width: 256, height: 256, style: "border:1px solid #000000" }, body)

console_.log = console.log
console.log = (...logs) => result.value += "log: " + logs.join("\n") + "\n"

const ladybug = {
		step(count = 1) {
			if (typeof count != "number")
				throw new TypeError(`ladybug.step: unexpected ${typeof count} in first argument`)
			
			count = Math.round(count)

			console.log(`Stepping ${count} times`)

			switch (ladybug.rot) {
				case 0:
					for (var i = 0; i < count; i++) {
						ladybug.y--
						//frames.push([ ladybug.x, ladybug.y, ladybug.rot ])
					}
					break
				case 1:
					for (var i = 0; i < count; i++) {
						ladybug.x++
						//frames.push([ ladybug.x, ladybug.y, ladybug.rot ])
					}
					
					break
				case 2:
					for (var i = 0; i < count; i++) {
						ladybug.y++
						//frames.push([ ladybug.x, ladybug.y, ladybug.rot ])
					}
					
					break
				case 3:
					for (var i = 0; i < count; i++) {
						ladybug.x--
						//frames.push([ ladybug.x, ladybug.y, ladybug.rot ])
					}
					
					break
			}
		},
		turn(dir: "left" | "right") {
			if (dir == "left") {
				console.log("turning left")
				ladybug.rot--
			} else if (dir == "right") {
				console.log("turning right")
				ladybug.rot++
			} else
				throw new TypeError(`ladybug.turn: expected "left" or "right" but got ${dir} instead`)
			
			if (ladybug.rot < 0)
				ladybug.rot = 3
			else if (ladybug.rot > 3)
				ladybug.rot = 0
			
			//frames.push([ ladybug.x, ladybug.y, ladybug.rot ])
		},
		x: 8,
		y: 8,
		rot: 0
	},
	context = canvas.getContext("2d")
	
let test


onload = () => {
	draw()

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
			test = error.stack
			console.error(error)

			result.value += `${error.toString()}\n`

			if (error.constructor == TypeError || error.constructor == ReferenceError) {
				const loc = error.stack.match(/<anonymous>:\d+:\d+/)[0].match(/\d:\d/)[0].split(":")
				result.value += `\tAt line ${loc[0]}, character ${loc[1]}.`
			}
		}

		draw()
	}
}

function createAppendElement(tag: string, properties: {}, target: HTMLElement) {
	const element = document.createElement(tag)

	for (let [ key, value ] of Object.entries(properties))
		// @ts-ignore
		element[key] = value
	
	return target.appendChild(element)
}

function createAppendElements(list: []) {
	for (let item of list)
		$(list[0])

	if (list.length) {
		const [ tag, properties ] = list.shift()
		createAppendElement(tag, properties, head)
			.onload = () => createAppendElements(list)
	}
}

function draw(i = 0) {
	if (i < frames.length) {
		wait(250).then(() => {
			context.clearRect(0, 0, canvas.width, canvas.height)

			context.beginPath()
			context.moveTo(frames[0][0] * 16, frames[0][1] * 16)

			for (var j = 1; j < i + 1; j++) {
				let frame = frames[j]
				const [ x, y, rot, log ] = frame

				context.lineTo(x * 16, y * 16)
			}

			context.stroke()

			const [ x, y, rot ] = frames[i]

			context.beginPath()
			context.arc(x * 16, y * 16, 4, 0, 2 * Math.PI)
			context.fillStyle = "red"
			context.fill()

			//console.log(log)

			draw(i + 1)
		})
	}
}

function wait(time) {
	return new Promise(resolve => setTimeout(() => resolve(true), time))
}

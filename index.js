const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.6
const movementVelocity = 5
const jumpVelocity = 25 * gravity
const spriteHeight = 150
const spriteWidth = 50

function modulo (a) {
	let b;
	if(a >= 0) {
		b = a;
	} else b = -a; 
	return b
}

function mayor (a, b) {
	let c
	if(a > b) {
		c = a
	} else if (a < b) {
		c = b
	} else c = null
	return c
}

class Sprite{
	constructor({position, velocity, color = "red"}) {
		this.position = position
		this.velocity = velocity
		this.height = spriteHeight
		this.width = spriteWidth
		this.iteracion ={i: -1, a: 0, b: 0} 
		this.inAir
		this.color = color
	}

	draw() {
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}

	canvasLimit() {
		if(this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0
		} else this.velocity.y += gravity		
	}

	update() {
		this.draw()
		this.iteracion.i *= -1
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		this.canvasLimit()
		switch (this.iteracion.i){
			case 1:
			this.iteracion.a = this.velocity.y;
			break
			case -1:
			this.iteracion.b = this.velocity.y
		}

		if(this.iteracion.a == 0 && this.iteracion.b == 0) {
			this.inAir = false
		} else this.inAir = true
	}
}

const player = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: "blue"
})


const enemy = new Sprite({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: "red"
})

//Devuelve el personaje que se encuentre en la posicion izquierda relativa al otro
// function onLeft(box1, box2) {
// 	let a
// 	if(box1.position.x <= box2.position.x) {
// 		a = "box1"
// 	} else a = "box2"
// 	return a
// }


// function hitBox(box1, box2) {
// 	let dif = box2.position.x - box1.position.x;
// 	if (modulo(box1.position.y - box2.position.y) < spriteHeight) {
// 		if (0 < modulo(dif) && modulo(dif) < spriteWidth) {
// 		switch (onLeft(box1, box2)){
// 			case "box1":
// 				box1.velocity.x = (dif - spriteWidth) / 2
// 				box2.velocity.x = (spriteWidth - dif) / 2
// 			break
// 			case "box2":
// 				box1.velocity.x = (spriteWidth - dif) / 2
// 				box2.velocity.x = (dif - spriteWidth) / 2
// 			break
// 			}
// 		}	
// 	}
// }

function relativePosition(box1, box2) {
	let position = {left:"", right:"", upper:"", closer: null}
	//define left y right
	if(box1.position.x <= box2.position.x) {
		position.left = "box1"
		position.right = "box2"
	} else {position.left = "box2", position.right = "box1"}

	//define upper
	if (modulo(box1.position.y - box2.position.y) > spriteHeight) {
		console.log(mayor(box1.position.y, box2.position.y))
		if(mayor(box1.position.y, box2.position.y) === box1.position.y) {
			upper = "box1"
			console.log("funciono")
		} else upper = "box2"
	}
}

const keys = {
	a: {
		pressed:false 
	},
	d: {
		pressed:false
	},
	ArrowRight: {
		pressed:false
	},
	ArrowLeft: {
		pressed:false
	}
}

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = "black"
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	//player movement
	if(keys.a.pressed && keys.d.pressed){
		player.velocity.x = 0
	} else if(keys.a.pressed){
		player.velocity.x = -movementVelocity
	} else if (keys.d.pressed){
		player.velocity.x = movementVelocity
	}
	//enemy movement
	if(keys.ArrowRight.pressed && keys.ArrowLeft.pressed){
		enemy.velocity.x = 0
	} else if(keys.ArrowLeft.pressed){
		enemy.velocity.x = -movementVelocity
	} else if (keys.ArrowRight.pressed){
		enemy.velocity.x = movementVelocity
	}
	relativePosition(player, enemy)
	//hitbox
	// hitBox(player, enemy)
}

animate()

window.addEventListener("keydown", (event) => {
	switch (event.key) {
		//player
		case "d":
			keys.d.pressed = true
		break
		case "a":
			keys.a.pressed = true
		break
		case "w":
			if (!player.inAir) {
				player.velocity.y = -jumpVelocity;
			}
		break

		//enemy
		case "ArrowRight":
			keys.ArrowRight.pressed = true
		break
		case "ArrowLeft":
			keys.ArrowLeft.pressed = true
		break
		case "ArrowUp":
			if (!enemy.inAir) {
				enemy.velocity.y = -jumpVelocity;
			}
		break
	}
	console.log(event.key)
})

window.addEventListener("keyup", (event) => {
	switch (event.key) {
		case "d":
			keys.d.pressed = false
		break
		case "a":
			keys.a.pressed = false
		break
		case "ArrowRight":
			keys.ArrowRight.pressed = false
		break
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false
		break
			}
	console.log(event.key)
})

let config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 1000
      },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
}

let game = new Phaser.Game(config)
let player
let meats
let bombs
let characterScale = 5
let meatScale = 4
let bombScale = 4
let score = 0
let scoreText
let timedEvent
let timedEvent1

function preload() {
  this.load.image('background1', 'assets/background/plx-1.png')
  this.load.image('background2', 'assets/background/plx-2.png')
  this.load.image('background3', 'assets/background/plx-3.png')
  this.load.image('background4', 'assets/background/plx-4.png')
  this.load.image('background5', 'assets/background/plx-5.png')
  this.load.image('platform', 'assets/background/platform.png')
  this.load.image('meat', 'assets/sprites/meat.png')
  this.load.spritesheet('doux', 'assets/sprites/doux.png', {frameWidth: 23.8, frameHeight: 17})
  this.load.spritesheet('bomb', 'assets/sprites/bombs.png', {frameWidth: 14.5, frameHeight: 12})
}

function create() {

  this.background1 = this.add.tileSprite(400, 300, 1000, 600, 'background1')
  this.background2 = this.add.tileSprite(400, 300, 1000, 600, 'background2')
  this.background3 = this.add.tileSprite(400, 300, 1000, 600, 'background3')
  this.background4 = this.add.tileSprite(400, 300, 1000, 600, 'background4')
  this.background5 = this.add.tileSprite(400, 300, 1000, 600, 'background5')

  this.ground = this.add.tileSprite(400, 568, 800, 100, 'platform')
  this.physics.add.existing(this.ground)
  this.ground.body.immovable = true
  this.ground.body.moves = false

  player = this.physics.add.sprite(100, 450, 'doux')
  player.getBounds()

  player.setBounce(0.2)
  player.setCollideWorldBounds(true)
  player.setScale(characterScale)
  player.setSize(13, 17, 0, 0)

  meats = this.physics.add.group()
  bombs = this.physics.add.group()

  timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true})
  timedEvent1 = this.time.addEvent({ delay: 3000, callback: onEvent1, callbackScope: this, loop: true})

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('doux', { start: 3, end: 9 }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: 'hurt',
    frames: this.anims.generateFrameNumbers('doux', { start: 14, end: 16 }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: 'boom',
    frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  })

  function collectMeat (player, meat) {
    meat.destroy()
    score += 100
    scoreText.setText('SCORE: ' + score)
  }

  function hitBomb (player, bomb) {
    this.physics.pause()
    player.setTint(0xff0000)
    player.anims.play('hurt')
    gameOver = true;
    gameOverText = this.add.text(250, 250, 'GAME OVER', { fontSize: '50px', fill: '#FFFFFF' })
    score
  }

  scoreText = this.add.text(16, 16, 'SCORE: 0', { fontSize: '32px', fill: '#FFFFFF' })

  this.physics.add.collider(player, this.ground)
  this.physics.add.collider(meats, this.ground)
  this.physics.add.collider(bombs, this.ground)
  this.physics.add.overlap(player, meats, collectMeat, null, this)
  this.physics.add.collider(player, bombs, hitBomb, null, this)
  this.cameras.main.startFollow(player, true, 0.05, 0.05)
  this.cameras.main.setBounds(0, 0, 800, 600)
  cursors = this.input.keyboard.createCursorKeys()
}

function update() {
  // score += 1
  // scoreText.setText('SCORE: ' + score)

  if (cursors.right.isDown) {
    player.anims.play('run', true)
    player.setVelocityX(200)
    player.flipX = false
  }
  else if (cursors.left.isDown) {
    player.anims.play('run', true)
    player.setVelocityX(-260)
  }
  else {
    player.setVelocityX(0)
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-600);
  }


  this.background1.tilePositionX += 10
  this.background2.tilePositionX += 10
  this.background3.tilePositionX += 10
  this.background4.tilePositionX += 10
  this.background5.tilePositionX += 10
  this.ground.tilePositionX += 10

}

function onEvent() {
  timedEvent.reset({ delay: Phaser.Math.Between(1000 ,5000), callback: onEvent, callbackScope: this, loop: true})
  meat = meats.create(800, Phaser.Math.Between(200, 485), 'meat')
  meat.setScale(meatScale)
  meat.setBounceY(Phaser.Math.FloatBetween(0.6, 1.2))
  meats.setVelocityX(Phaser.Math.Between(-1000, -300))
}

function onEvent1() {
  timedEvent1.reset({ delay: Phaser.Math.Between(3000 ,5000), callback: onEvent1, callbackScope: this, loop: true})
  bomb = bombs.create(800, Phaser.Math.Between(300, 485), 'bomb')
  bomb.setScale(bombScale)
  bomb.anims.play('boom', true)
  bomb.setBounceY(1.2)
  bombs.setVelocityX(Phaser.Math.Between(-1000, -300))
}

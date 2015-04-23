
BasicGame.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  //this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {

    //  Show the loading progress bar asset we loaded in boot.js
    this.stage.backgroundColor = '#2d2d2d';

    this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
    this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);
    
    // Let's load the homepage before moving on to the other assets.
    this.load.image('titlepage', 'assets/titlepage.png');

   // Here we load the rest of the assets our game needs.
   // Phase 1 assets
   this.load.image('sea', 'assets/sea.png');
   this.load.spritesheet('player', 'assets/player'+BasicGame.PLAYER_SPRITE+'.png', 64, 64);
   this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
   this.load.spritesheet('whiteEnemy', 'assets/shooting-enemy.png', 32, 32);
   this.load.image('bullet', 'assets/bullet.png');
   this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
   this.load.image('enemyBullet', 'assets/enemy-bullet.png');
   this.load.image('powerup1', 'assets/powerup1.png');
   
//    
//    // Phase 2 assets
//    this.load.spritesheet('boss', 'assets/boss.png', 93, 75);
//    
//    // Phase 3 assets
//    this.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.wav']);
//    this.load.audio('playerExplosion', ['assets/player-explosion.ogg', 'assets/player-explosion.wav']);
//    this.load.audio('enemyFire', ['assets/enemy-fire.ogg', 'assets/enemy-fire.wav']);
//    this.load.audio('playerFire', ['assets/player-fire.ogg', 'assets/player-fire.wav']);
//    this.load.audio('powerUp', ['assets/powerup.ogg', 'assets/powerup.wav']);
    // Load any other assets you add into your game follwing the same pattern
  },

  create: function () {

    //  Once the load has finished we disable the crop in case there's anything else we want to load or decode later.
    this.preloadBar.cropEnabled = false;

  },
  update: function () {
//    // If you want to skip the Main menu and start the game directly uncomment the next line
//    this.state.start('Game');
//    // Then we move to the Mainmenu
    this.state.start('MainMenu');
  }
};

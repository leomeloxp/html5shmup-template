BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {
    /* Loads all the assets needed for the actual game before it starts */
    preload: function () {
        this.load.image('sea', 'assets/sea.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
        this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
        this.load.spritesheet('player', 'assets/player.png', 64, 64);
    },
    
    /* Creates the game objects (ideally with already loaded assets) */
    create: function () {
        // Creates the sea background
        this.sea = this.add.tileSprite(0, 0, 800, 600, 'sea');
        
        // Creates the player Sprite
        this.player = this.add.sprite(400, 500, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.animations.add('fly', [0, 1, 2], 20, true);
        this.player.play('fly');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        // 20 x 20 pixel hitbox, centered a little bit higher than the center
        this.player.body.setSize(20, 20, 0, -5);

        // Player's default motion speed
        this.player.speed = 300;
        
        // Player is bound within game stage
        this.player.body.collideWordBounds = true;
        
        //Creates the enemy sprite pool
        this.enemyPool = this.add.group();
        this.enemyPool.enableBody = true;
        this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyPool.createMultiple(50, 'greenEnemy');
        this.enemyPool.setAll('anchor.x', 0.5);
        this.enemyPool.setAll('anchor.y', 0.5);
        this.enemyPool.setAll('outOfBoundsKill', true);
        this.enemyPool.setAll('checkWorldBounds', true);
        
        // Set the animation for each sprite in enemyPool
        this.enemyPool.forEach(function (enemy) {
            enemy.animations.add('fly', [ 0, 1, 2], 20, true);
        });
        
        //Set enemy spawn rate
        this.nextEnemyAt = 0;
        this.enemyDelay = 1000;
        
        // Creates the bullets sprite group
        this.bulletPool = this.add.group();
        
        // Enable physics to the whole sprite group
        this.bulletPool.enableBody = true;
        this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
        
        // Add 100 'bullet' sprites in the group.
        // By default this uses the first frame of the sprite sheet and
        // sets the initial state as non-existing (i.e. killed/dead)
        this.bulletPool.createMultiple(100, 'bullet');
        
        // Sets anchors of all bullet sprites
        this.bulletPool.setAll('anchor.x', 0.5);
        this.bulletPool.setAll('anchor.y', 0.5);
        
        // Automatically kill the bullet sprites when they go out of bounds
        this.bulletPool.setAll('outOfBoundsKill', true);
        this.bulletPool.setAll('checkWorldBounds', true);
        
        
        // Set firing rate
        this.nextShotAt = 0;
        this.shotDelay = 100;

        //Turn explosions into a pool for better performance
        this.explosionPool = this.add.group();
        this.explosionPool.enableBody = true;
        this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.explosionPool.createMultiple(100, 'explosion');
        this.explosionPool.setAll('anchor.x', 0.5);
        this.explosionPool.setAll('anchor.y', 0.5);
        this.explosionPool.forEach(function (explosion) {
          explosion.animations.add('boom');
        });
        
        // Implement keyboard control with arrow keys
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Creates a help message with instructions
        this.instructions = this.add.text(400, 500,
            'Use Arrow Keys to Move, Press Z to Fire\n' +
            'Tapping/clicking does both',
            { font: '20px monospace', fill: '#fff', align: 'center' });
        this.instructions.anchor.setTo(0.5, 0.5);
        this.instExpire = this.time.now + 5000;
    },

    update: function () {
        // Makes the sea move
        this.sea.tilePosition.y += 0.2;
        // Collision handling between enemy and bullet
        this.physics.arcade.overlap(
            this.bulletPool, this.enemyPool, this.enemyHit, null, this
        );

        // Collision detection between player and enemy
        this.physics.arcade.overlap(
            this.player, this.enemyPool, this.playerHit, null, this);
        
        if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0){
            this.nextEnemyAt = this.time.now + this.enemyDelay;
            var enemy = this.enemyPool.getFirstExists(false);
            
            // Spawn at a random location top of the screen
            enemy.reset(this.rnd.integerInRange(20, 780), 0);
            
            // Also randomise speed
            enemy.body.velocity.y = this.rnd.integerInRange(30,60);
            enemy.play('fly');
        }
        
        // Defines Player Motion engine
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        
        // Horizontal Move
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.player.speed;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.player.speed;
        }
        
        // Vertical Move
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -this.player.speed;
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = this.player.speed;
        }
        
        // Implement Mouse and Touch movement
        if (this.input.activePointer.isDown &&
                    this.physics.arcade.distanceToPointer(this.player) > 15) { //Fixes trembling sprite caused by movement overshoot
            
            this.physics.arcade.moveToPointer(this.player, this.player.speed);
        }
        
        if (this.input.keyboard.isDown(Phaser.Keyboard.Z) ||
                    this.input.activePointer.isDown) {
            this.fire();
        }
        
        if (this.instructions.exists && this.time.now > this.instExpire) {
            this.instructions.destroy();
        }
    },
    
    render: function () {
        // Enable debugging
        //this.game.debug.body(this.bullet);
        //this.game.debug.body(this.enemy);
        
    },

    // Function to define behaviour when player is hit
    playerHit: function (player, enemy) {
        this.explode(enemy);
        enemy.kill();
        this.explode(player);
        player.kill();
       },

    // Function to define behaviour when enemy is hit
    enemyHit: function (bullet, enemy) {
        bullet.kill();
        this.explode(enemy);
        enemy.kill();
    },
    
    // Manage player's bullets being fired
    fire: function () {
        if (!this.player.alive || this.nextShotAt > this.time.now) {
            return;
        }
        
        this.nextShotAt = this.time.now + this.shotDelay;
        
        // Find the first dead bullet in the pool
        var bullet = this.bulletPool.getFirstExists(false);
        
        // Reset (revive) the found bullet and place it in a new location
        bullet.reset(this.player.x, this.player.y - 20);

        // Bullet speed
        bullet.body.velocity.y = -500;
    },

    // Manages Explosions
    explode: function (sprite) {
        if (this.explosionPool.countDead() === 0) {
            return;
        }
        var explosion = this.explosionPool.getFirstExists(false);
        explosion.reset(sprite.x, sprite.y);
        explosion.play('boom', 15, false, true);
        // add the original sprite's velocity to the explosion
        explosion.body.velocity.x = sprite.body.velocity.x;
        explosion.body.velocity.y = sprite.body.velocity.y;
    },

    quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }
};

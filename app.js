window.onload = function() {

  //  Create your Phaser game once the page is loaded.
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');
  //var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'gameContainer');

  //  Add the States your game has.
  // Boot: Sets up basic variables and gaming environment.
  game.state.add('Boot', BasicGame.Boot);
  // Prealoader: Loads all assets(images/audio) needed for the game
  game.state.add('Preloader', BasicGame.Preloader);
  // Loads Main Menu and wait for the game to start. Returning here once game's over.
  game.state.add('MainMenu', BasicGame.MainMenu);
  // Actual Game logic and code.
  game.state.add('Game', BasicGame.Game);

  // The boot order is defined above. Inside here we can decide to skip some steps
  // eg, for development. To do that uncomment the relevant .start line.
  game.state.start('Boot');
  $( "select" )
  .change(function () {
    $( "select option:selected" ).each(function() {
      BasicGame.PLAYER_SPRITE = $( this ).val();
      //  Restart the game with a new plane at boot state.
      game.state.start('Boot');
    });
  })
  .change();
};

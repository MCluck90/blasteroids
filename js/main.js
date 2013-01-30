$("#canvas").mousedown(function() {
    this.gameStarted = this.gameStarted || false;

    if (!this.gameStarted) {
        Game.init();
        this.gameStarted = true;
    }
});
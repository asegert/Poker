var Poker = Poker || {};

Poker.EndState = {
    create: function ()
    {
        this.add.sprite(0, 0, 'end');
        this.coupon = this.add.sprite(25, 100, 'coupon');
        this.coupon.scale.setTo(0.7, 0.7);
        if(Poker.Round < JSON.parse(this.game.cache.getText('pokerData')).WinHands.length)
        {
            this.continue = this.add.button(700, 500, 'continue', function()
            {       
                this.game.state.start('Game');
            }, this);
        }
        else
        {
            this.continue = this.add.button(700, 500, 'submit', function()
            {       
                
            }, this);
        }
        this.continue.scale.setTo(0.6, 0.6);
    }
}
var Poker = Poker || {};

Poker.StoryState = {
    create: function ()
    {
        this.add.sprite(0, 0, 'instructions');
        let start = this.add.button(400, 550, 'bet', function()
        {
            this.game.state.start('Game');
        }, this);
        start.scale.setTo(0.5, 0.5);
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/
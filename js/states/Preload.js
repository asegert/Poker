var Poker = Poker || {};

Poker.PreloadState = {
    preload: function ()
    {
        var preloadBG = this.add.sprite((this.world.width - 580) * 0.5, (this.world.height + 150) * 0.5, 'loading-background');
        var preloadProgress = this.add.sprite((this.world.width - 540) * 0.5, (this.world.height + 170) * 0.5, 'loading-progress');
        this.load.setPreloadSprite(preloadProgress);

        this.load.image('background', 'assets/images/background.png');
        this.load.image('hint', 'assets/images/hint.png');
        
        //Cards
        this.load.image('diamond2', 'assets/images/cardDiamonds2.png');
        this.load.image('diamond3', 'assets/images/cardDiamonds3.png');
        this.load.image('diamond4', 'assets/images/cardDiamonds4.png');
        this.load.image('diamond5', 'assets/images/cardDiamonds5.png');
        this.load.image('diamond6', 'assets/images/cardDiamonds6.png');
        this.load.image('diamond7', 'assets/images/cardDiamonds7.png');
        this.load.image('diamond8', 'assets/images/cardDiamonds8.png');
        this.load.image('diamond9', 'assets/images/cardDiamonds9.png');
        this.load.image('diamond10', 'assets/images/cardDiamonds10.png');
        this.load.image('diamondJ', 'assets/images/cardDiamondsJ.png');
        this.load.image('diamondQ', 'assets/images/cardDiamondsQ.png');
        this.load.image('diamondK', 'assets/images/cardDiamondsK.png');
        this.load.image('diamondA', 'assets/images/cardDiamondsA.png');
        
        this.load.image('club2', 'assets/images/cardClubs2.png');
        this.load.image('club3', 'assets/images/cardClubs3.png');
        this.load.image('club4', 'assets/images/cardClubs4.png');
        this.load.image('club5', 'assets/images/cardClubs5.png');
        this.load.image('club6', 'assets/images/cardClubs6.png');
        this.load.image('club7', 'assets/images/cardClubs7.png');
        this.load.image('club8', 'assets/images/cardClubs8.png');
        this.load.image('club9', 'assets/images/cardClubs9.png');
        this.load.image('club10', 'assets/images/cardClubs10.png');
        this.load.image('clubJ', 'assets/images/cardClubsJ.png');
        this.load.image('clubQ', 'assets/images/cardClubsQ.png');
        this.load.image('clubK', 'assets/images/cardClubsK.png');
        this.load.image('clubA', 'assets/images/cardClubsA.png');
        
        this.load.image('heart2', 'assets/images/cardHearts2.png');
        this.load.image('heart3', 'assets/images/cardHearts3.png');
        this.load.image('heart4', 'assets/images/cardHearts4.png');
        this.load.image('heart5', 'assets/images/cardHearts5.png');
        this.load.image('heart6', 'assets/images/cardHearts6.png');
        this.load.image('heart7', 'assets/images/cardHearts7.png');
        this.load.image('heart8', 'assets/images/cardHearts8.png');
        this.load.image('heart9', 'assets/images/cardHearts9.png');
        this.load.image('heart10', 'assets/images/cardHearts10.png');
        this.load.image('heartJ', 'assets/images/cardHeartsJ.png');
        this.load.image('heartQ', 'assets/images/cardHeartsQ.png');
        this.load.image('heartK', 'assets/images/cardHeartsK.png');
        this.load.image('heartA', 'assets/images/cardHeartsA.png');
        
        this.load.image('spade2', 'assets/images/cardSpades2.png');
        this.load.image('spade3', 'assets/images/cardSpades3.png');
        this.load.image('spade4', 'assets/images/cardSpades4.png');
        this.load.image('spade5', 'assets/images/cardSpades5.png');
        this.load.image('spade6', 'assets/images/cardSpades6.png');
        this.load.image('spade7', 'assets/images/cardSpades7.png');
        this.load.image('spade8', 'assets/images/cardSpades8.png');
        this.load.image('spade9', 'assets/images/cardSpades9.png');
        this.load.image('spade10', 'assets/images/cardSpades10.png');
        this.load.image('spadeJ', 'assets/images/cardSpadesJ.png');
        this.load.image('spadeQ', 'assets/images/cardSpadesQ.png');
        this.load.image('spadeK', 'assets/images/cardSpadesK.png');
        this.load.image('spadeA', 'assets/images/cardSpadesA.png');
        
        this.load.image('glow', 'assets/images/glow.png');
        this.load.image('cardBack', 'assets/images/cardBack_red5.png');
        
        this.load.image('start', 'assets/images/start.png');
        this.load.image('hintButton', 'assets/images/hintButton.png');
        this.load.image('close', 'assets/images/close.png');
        this.load.image('trade', 'assets/images/trade.png');
        this.load.image('noTrade', 'assets/images/noTrade.png');
        this.load.image('continue', 'assets/images/continue.png');
        this.load.image('submit', 'assets/images/submit.png');
        
        this.load.image('instructions', 'assets/images/instructions.png');
        this.load.image('winner', 'assets/images/winner.png');
        this.load.image('loser', 'assets/images/loser.png');
        this.load.image('end', 'assets/images/endScreen.png');
        this.load.image('coupon', 'assets/images/coupon.png');
        this.load.image('dealerHand', 'assets/images/Poker_dealerHand.png');
        this.load.image('arrow', 'assets/images/arrow.png');
        
        this.load.text('pokerData', 'assets/data/poker.json');
        /*
        JSON
        DealerHands - 2D array containing the texture name of the 5 cards that comprise each hand type for the dealer
        PlayerHands - 2D array containing the texture name of the 5 cards that comprise each hand type, save for the Royal Flush as it cannot be beaten, for the player
        AdditionalCards - 2D array containing the texture name of the 5 cards that can be used as replacements for each player hand to ensure the player cannot win
        WinText: An array containing a list of all the text hands for display purposes
        Final Hand: The final hand is a win and thus is a Royal Flush
        Trades: A number indicating how many times a player is allowed to trade cards, the additional cards must be large enough to accomodate ie. 1 Trade = 5 cards 2 Trades = 10 cards...
        WinHands: An array spanning however many rounds are to be played and indicating whether or not it is a winning or losing round
        */
        
    },
    create: function ()
    {
        this.state.start('Story');
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/
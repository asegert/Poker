var Poker = Poker || {};

Poker.GameState = {
    create: function ()
    {
        //Set global variables
        this.background = this.add.sprite(0, 0, "background");
        //Store the poker data
        this.pokerData = JSON.parse(this.game.cache.getText('pokerData'));
        //Increase the level
        Poker.Round++;
        //InitializeButtons
        this.initButtons();
        //Initialize round variables
        this.initVariables();
        //Boolean indicating whether or not the player wants to trade cards
        this.swap = false;
        //The array of cards the player is trading
        this.trade=new Array();
        //Index of the hand being played with, used to locate appropriate additional cards for trades
        this.handIndex = 0;
        //Keeps track of how many additional cards have been removed so the player does not get duplicate cards
        this.nulls = 0;
        //The number of trades that occur so the player cannot continously trade
        this.trades = 0;
    },
    initVariables: function()
    {
        //Choose a random value in the indices of available hands
        this.rand = Math.floor(Math.random() * this.pokerData.PlayerHands.length);
        //Check that the new Rand is different than the laast one
        while(this.rand === this.lastRand)
        {
            this.rand = Math.floor(Math.random() * this.pokerData.PlayerHands.length);
        }
        //Boolean to start the glow sequence
        this.glowSequence = false;
        //Boolean check for which cards still need flipped of the 5
        this.flipped = [false, false, false, false, false];
        //If it is not the final round set the cards with a random selection
        if(Poker.Round < 3)
        {
            this.setCardsRandom();
        }
        else if(Poker.Round === 3)
        {
            this.setCardsFinal();
        }
    },
    initButtons: function()
    {
        //Buttons
        //Hint Button
        this.bet = this.add.button(50, 420, 'hintButton', function()
        {
            var hint = this.add.sprite(90, 100, 'hint');
            var button = this.add.button(700, 500, 'close', function()
            {
                hint.kill();
                button.kill();
            }, this);
            button.scale.setTo(0.4, 0.4);
        }, this);
        
        this.bet.scale.setTo(0.4, 0.4);
        
        //Trade Button
        this.tradeStartButton = this.add.button(50, 250, 'cardBack', function()
        {
            //If a trade can be allowed allow the player to select/deselect cards to be traded
            if(this.trades<this.pokerData.Trades)
            {
                this.arrow.destroy();
                this.arrow = this.add.sprite(230, 440, 'arrow');
                this.arrow.rotation=-1.58;
                this.arrow.scale.setTo(0.5, 0.5);
            
                this.arrow.addChild(this.add.sprite(-5, 300, 'arrow'));
                this.arrow.addChild(this.add.sprite(-5, 600, 'arrow'));
                this.arrow.addChild(this.add.sprite(-5, 900, 'arrow'));
                this.arrow.addChild(this.add.sprite(-5, 1200, 'arrow'));
                var text = this.add.text(300, 300, 'Choose the Cards to Trade');
                text.rotation = +1.58;
                text.scale.setTo(2, 2);
                this.arrow.addChild(text);
            
                var tween = this.add.tween(this.arrow).to({y:this.arrow.y+10}, 500, "Linear", true, 0, -1);
                tween.yoyo(true);
            }
            
            this.swap=!this.swap;
        }, this);
        
        this.tradeStartButton.scale.setTo(0.8, 0.8);
        this.tradeStartButton.inputEnabled = false;
        
        //Trade Button
        this.tradeButton = this.add.button(350, 250, 'trade', function()
        {
            //Remove the previous button and increase the number of trades that occur
            this.noTrade.destroy();
            this.trades++;
            //Go through the cards to be traded and replace them with a random card from the additional cards
            for(var i=0, len=this.trade.length; i<len; i++)
            {
                var rand = Math.floor(Math.random() * this.pokerData.AdditionalCards[this.handIndex].length);
                if(this.nulls === this.pokerData.AdditionalCards[this.handIndex].length)
                {
                    this.trade[i].glow.kill();
                    this.trade[i].glow=null;
                }
                else if(this.pokerData.AdditionalCards[this.handIndex][rand]===null)
                {
                    i--;
                }
                else
                {
                    this.trade[i].changeCard(this.pokerData.AdditionalCards[this.handIndex][rand]);
                    this.pokerData.AdditionalCards[this.handIndex][rand]=null;
                    this.trade[i].glow.kill();
                    this.trade[i].glow=null;
                    this.nulls++;
                }
            }
            //Reset indicators and stop allowing input
            this.trade = new Array();
            this.tradeButton.inputEnabled = false;
            this.tradeButton.alpha=0;
            this.swap=false;
            //Get the dealer hand to complete the round
            this.hand.getDealerHand();
        }, this);
        
        this.tradeButton.scale.setTo(0.8, 0.8);
        this.tradeButton.alpha=0;
        this.tradeButton.inputEnabled=false;
    },
    setCardsRandom: function()
    {
        //Check that the selected hand is not the previous hand
        var r1 = Math.floor(Math.random() * this.pokerData.PlayerHands.length);
        
        if(Poker.lastRand != null && r1 === Poker.lastRand)
        {
            r1++;
        }
        Poker.lastRand = r1;
        this.handIndex = r1;
        //Create and display the player and dealer hands
        this.hand = new Poker.Hand(this);
        this.hand.init(this.createCards(this.pokerData.PlayerHands[r1]));
        this.displayCards(this.hand.hand, 270, 520, 150, true, 0.8);
        this.dealerHand = new Poker.Hand(this);
        this.dealerHand.init(this.createCards(this.pokerData.DealerHands[0]));
        this.displayCards(this.dealerHand.hand, 270, 130, 150, true, 0.8);
        //Flip the player cards over
        var count = 0;
        this.game.time.events.repeat(Phaser.Timer.SECOND*0.5, 5, function()
        {
            this.hand.hand[count].flipSprite();
            count++;
        }, this);
        //Show/allow trades
        this.game.time.events.add(Phaser.Timer.SECOND*3.5, function()
        {
            this.tradeStartButton.inputEnabled=true;
            this.arrow = this.add.sprite(150, 250, 'arrow');
            this.arrow.addChild(this.add.text(150, 60, "Trade Cards"));
            var tween = this.add.tween(this.arrow).to({x:this.arrow.x+10}, 500, "Linear", true, 0, -1);
            tween.yoyo(true);
            
            this.noTrade = this.add.button(700, 300, 'noTrade', function()
            {
                for(var i=0, len=this.hand.hand.length; i<len; i++)
                {
                    if(this.hand.hand[i].glow != null)
                    {
                        this.hand.hand[i].glow.destroy();
                        this.hand.hand[i].glow=null;
                    }
                }
                this.noTrade.destroy();
                this.arrow.destroy();
                this.hand.getDealerHand();
            }, this);
            this.noTrade.scale.setTo(0.5, 0.5);
            
        }, this);
    },
    setCardsFinal: function()
    {
        //Set hand index to the last array of additional cards
        this.handIndex = this.pokerData.AdditionalCards.length-1;
        //Create/display the hands
        this.hand = new Poker.Hand(this);
        this.hand.init(this.createCards(this.pokerData.FinalHand));
        this.displayCards(this.hand.hand, 270, 520, 150, true, 0.8);
        this.dealerHand = new Poker.Hand(this);
        this.dealerHand.init(this.createCards(this.pokerData.DealerHands[0]));
        this.displayCards(this.dealerHand.hand, 270, 130, 150, true, 0.8);
        //Flip the player cards over
        var count = 0;
        this.game.time.events.repeat(Phaser.Timer.SECOND*0.5, 5, function()
        {
            this.hand.hand[count].flipSprite();
            count++;
        }, this);
        //Show/allow trades
        this.game.time.events.add(Phaser.Timer.SECOND*3.5, function()
        {
            this.tradeStartButton.inputEnabled=true;
            this.arrow = this.add.sprite(150, 250, 'arrow');
            this.arrow.addChild(this.add.text(150, 60, "Trade Cards"));
            var tween = this.add.tween(this.arrow).to({x:this.arrow.x+10}, 500, "Linear", true, 0, -1);
            tween.yoyo(true);
            
            this.noTrade = this.add.button(700, 300, 'noTrade', function()
            {
                for(var i=0, len=this.hand.hand.length; i<len; i++)
                {
                    if(this.hand.hand[i].glow != null)
                    {
                        this.hand.hand[i].glow.destroy();
                        this.hand.hand[i].glow=null;
                    }
                }
                this.noTrade.destroy();
                this.arrow.destroy();
                this.hand.getDealerHand();
            }, this);
            this.noTrade.scale.setTo(0.5, 0.5);
            
        }, this);
    },
    createCards: function(cardArray)
    {
        //Loop through the array creating cards
        for(let i=0, len = cardArray.length; i<len; i++)
        {
            //Create the new card class
            const Card = new Poker.Card(this);
            //Add the new card to the array
            cardArray[i] = Card.init(cardArray[i]);
        }
        //Return the array now filled with cards
        return cardArray;
    },
    displayCards: function(cardArray, startX, startY, offset, flip, scale)
    {
        for(let i=0, len = cardArray.length; i<len; i++)
        {
            cardArray[i].addSprite((startX + i*offset), startY, flip, scale);
        }
    },
    endGame: function(handType, dealerHandType)
    {
        //Get the card text to display
        var playerHandText = this.pokerData.WinText[handType];
        var dealerHandText = this.pokerData.WinText[dealerHandType];
        //Display a winning or losing senario
        if(handType>dealerHandType)
        {
            this.roundEndText = this.add.text(550, 300, `You Lose\n${dealerHandText} beats ${playerHandText}`, {font: "bold 32px Arial", fill: '#FFFFFF', align: "center"});
            this.roundEndText.anchor.setTo(0.5);
        }
        else
        {
            this.roundEndText = this.add.text(550, 300, `You Win!\n${playerHandText} beats ${dealerHandText}`, {font: "bold 32px Arial", fill: '#FFFFFF', align: "center"});
            this.roundEndText.anchor.setTo(0.5);
        }
        //End the game
        this.game.time.events.add(Phaser.Timer.SECOND * 3.5, function()
        {
            this.game.state.start('End');
        }, this);
    },
    update: function ()
    {
        
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/
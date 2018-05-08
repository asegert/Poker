var Poker = Poker || {};

Poker.GameState = {
    create: function ()
    {
        //Set global variables
        this.background = this.add.sprite(0, 0, "background");
        this.pokerData = JSON.parse(this.game.cache.getText('pokerData'));
        this.rounds = 1;
        //InitializeButtons
        this.initButtons();
        //Initialize round variables
        this.initVariables();
        //Holds the random from the previous hand
        this.lastRand = -1;
        
        this.swap = false;
        this.trade=new Array();
        this.handIndex = 0;
        this.nulls = 0;
        this.trades = 0;
    },
    initVariables: function()
    {
        //Choose a random value in the indices of available hands
        this.rand = Math.floor(Math.random() * this.pokerData.Hands.length);
        //Check that the new Rand is different than the laast one
        while(this.rand === this.lastRand)
        {
            this.rand = Math.floor(Math.random() * this.pokerData.Hands.length);
        }
        //Boolean to start the glow sequence
        this.glowSequence = false;
        //Boolean check for which cards still need flipped of the 5
        this.flipped = [false, false, false, false, false];
        //If it is not the final round set the cards with a random selection
        if(this.rounds < 3)
        {
            this.setCardsRandom();
        }
        else if(this.rounds === 3)
        {
            console.log('final hand');
            this.setCardsFinal();
        }
        else
        {
            console.log('over');
            this.state.start('End');
        }
    },
    initButtons: function()
    {
        //Buttons
        //Bet Button
        this.bet = this.add.button(50, 420, 'bet', function()
        {
            var hint = this.add.sprite(90, 100, 'hint');
            var button = this.add.button(700, 500, 'bet', function()
            {
                hint.kill();
                button.kill();
            }, this);
            button.scale.setTo(0.4, 0.4);
            console.log('hint');
        }, this);
        
        this.bet.scale.setTo(0.4, 0.4);
        
        //Call Button
        this.call = this.add.button(50, 480, 'fold', function()
        {
            let found = false;
            for(let i = 0; i<5; i++)
            {
                if(!this.flipped[i])
                {
                    this.fiveCard[i].flipSprite();
                    this.flipped[i] = true;
                    found = true;
                    //If the last card has been flipped end the game
                    if(i===4)
                    {
                        found = false;
                    }
                    break;
                }
            }
            
            if(!found)
            {
                this.endGame(true);
            }
        }, this);
        
        this.call.scale.setTo(0.7, 0.7);
        
        //Fold Button
        this.fold = this.add.button(50, 250, 'cardBack', function()
        {
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
            console.log('swap');
            //Choose the cards to swap then replace them with new cards
        }, this);
        
        this.fold.scale.setTo(0.8, 0.8);
        this.fold.inputEnabled = false;
        
        //Trade Button
        this.tradeButton = this.add.button(350, 250, 'fold', function()
        {
            //Choose the cards to swap then replace them with new cards
            console.log('trade');
            this.trades++;
            
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
            this.trade = new Array();
            this.tradeButton.inputEnabled = false;
            this.tradeButton.alpha=0;
            this.swap=false;
        }, this);
        
        this.tradeButton.scale.setTo(0.8, 0.8);
        this.tradeButton.alpha=0;
        this.tradeButton.inputEnabled=false;
    },
    setCardsRandom: function()
    {
        //Testing
        this.hand = new Poker.Hand(this);
        this.hand.init(this.createCards(this.pokerData.PlayerHands[0]));
        this.displayCards(this.hand.hand, 270, 520, 150, true, 0.8);
        this.dealerHand = new Poker.Hand(this);
        this.dealerHand.init(this.createCards(this.pokerData.DealerHands[0]));
        this.displayCards(this.dealerHand.hand, 270, 130, 150, true, 0.8);
        //Add dealer->true
        console.log(this.hand.checkHand());
        var count = 0;
        this.game.time.events.repeat(Phaser.Timer.SECOND*0.5, 5, function()
        {
            this.hand.hand[count].flipSprite();
            count++;
        }, this);
        
        this.game.time.events.add(Phaser.Timer.SECOND*3.5, function()
        {
            this.fold.inputEnabled=true;
            this.arrow = this.add.sprite(150, 250, 'arrow');
            this.arrow.addChild(this.add.text(150, 60, "Trade Cards"));
            var tween = this.add.tween(this.arrow).to({x:this.arrow.x+10}, 500, "Linear", true, 0, -1);
            tween.yoyo(true);
            
            this.noTrade = this.add.button(700, 300, 'bet', function()
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
        this.rand = this.pokerData.Glow.length-1;
        //Set card arrays
        this.hand = this.pokerData.FinalHand;
        this.dealerHand = this.pokerData.FinalDealer;
        this.fiveCard = this.pokerData.FinalFiveCard;
        this.winText = this.pokerData.FinalWin;
        
        this.prepCards();
    },
    prepCards: function()
    {
        //Create the cards for the arrays
        this.hand = this.createCards(this.hand);
        this.dealerHand = this.createCards(this.dealerHand);
        this.fiveCard = this.createCards(this.fiveCard);
        
        this.displayCards(this.dealerHand, 400, 130, 200, true, 0.8);
        this.displayCards(this.fiveCard, 300, 330, 100, true, 0.6);
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
    endGame: function(canWin)
    {
        this.dealerHand.forEach(function(card)
        {
            if(card.sprite.key != card.texture)
            {
                card.flipSprite();
            }
        }, this);
        this.runGlowSequence(canWin);
        console.log('endGame');
        console.log(this.flipped);
    },
    runGlowSequence: function(canWin)
    {
        this.input.enabled = false;
        //Stores the player text tween and removal tween
        let playerLast = this.addText(800, 500, this.winText[0], false);
        //Goes through the cards used to make the hand and creates the tween for the glow effect
        //Tweens are then chained to the text tween and each other to create the full animation
        last  = this.addToChain(playerLast[0], this.pokerData.Glow[this.rand][0]);
        //Stores the dealer text tween and removal tween
        let dealerLast = this.addText(160, 150, this.winText[1], false);
        //Chain the animations together
        last.chain(playerLast[1]);
        playerLast[1].chain(dealerLast[0]);
        //Create the dealer animations
        last  = this.addToChain(dealerLast[0], this.pokerData.Glow[this.rand][1]);
        //Chain the animations together
        last.chain(dealerLast[1]);
        //Based on whether or not a win occurs create the announcement animations
        let announceLast;
        if(this.rounds < 3 || !canWin)//Add new images potentially one for folding
        {
            announceLast = this.addText(this.world.centerX, this.world.centerY, 'loser', true);
        }
        else
        {
            announceLast = this.addText(this.world.centerX, this.world.centerY, 'winner', true);
        }
        //Chain the animations
        dealerLast[1].chain(announceLast[0]);
        announceLast[0].chain(announceLast[1]);
        //Run the animation
        playerLast[0].start();
    },
    addToChain: function(last, data)
    {
        for(let i = 0, len = data.length; i<len; i++)
        {
            if(data[i])
            {
                this.fiveCard[i].addGlow();
                let glowE = this.add.tween(this.fiveCard[i].glow).to({alpha: 1}, 800, "Linear");
                let glowOut = this.add.tween(this.fiveCard[i].glow).to({alpha: 0}, 100, "Linear");
                last.chain(glowE);
                glowE.chain(glowOut);
                last=glowOut;
            }
        }
        return last;
    },
    addText: function(x, y, content, scale)
    {
        if(scale)
        {
            //Creates the image to inform if winner or not
            let announce = this.add.sprite(x, y, content);
            announce.alpha = 0;
            announce.anchor.setTo(0.5, 0.5);
            announce.scale.setTo(0.1, 0.1);
            let announceAlpha = this.add.tween(announce).to({alpha: 1}, 100, "Linear");
            let announcement = this.add.tween(announce.scale).to({x: 1, y: 1}, 1000, "Linear");
            announcement.onComplete.add(function()
            {
                this.input.enabled = true;
                //Allows player to continue to next screen
                let continueOn = this.add.button(x+100, y+100, 'bet', function()
                {
                    announce.destroy();
                    continueOn.destroy();
                    this.destroyHands();
                }, this);
            }, this);
            //Add a button to continue to next round that calls this.destroyHands();
            
            return [announceAlpha, announcement];
        }
        else
        {
            let handText = this.add.text(x, y, content, {fill: '#FF0000', font: '50px Arial'});
            handText.anchor.setTo(0.5, 0.5);
            handText.alpha = 0;
            let handDeclaration = this.add.tween(handText).to({alpha: 1}, 1000, "Linear");
            let handRemove = this.add.tween(handText).to({alpha: 0}, 100, "Linear");
            
            return [handDeclaration, handRemove];
        }
    },
    destroyHands: function()
    {
        for(let i=0, len = this.dealerHand.length; i<len; i++)
        {
            this.dealerHand[i].sprite.destroy();
            this.hand[i].sprite.destroy();
        }
        for(let i=0, len = this.fiveCard.length; i<len; i++)
        {
            this.fiveCard[i].sprite.destroy();
        }
        this.hand = new Array();
        this.dealerHand = new Array();
        this.fiveCard = new Array(); 
        
        this.lastRand = this.rand;
        this.rounds++;
        this.initVariables();
    },
    update: function ()
    {
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/
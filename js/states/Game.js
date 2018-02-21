var Poker = Poker || {};

Poker.GameState = {
    create: function ()
    {
        //Set global variables
        this.background = this.add.sprite(0, 0, "background");
        this.pokerData = JSON.parse(this.game.cache.getText('pokerData'));
        this.rounds = 1;
        this.betText = this.add.text(40, 50, "Current Bet: $0", {fill: '#FFFFFF'});
        //InitializeButtons
        this.initButtons();
        //Initialize round variables
        this.initVariables();
        //Holds the random from the previous hand
        this.lastRand = -1;
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
        //Initialize bet variables
        this.totalBet = 0;
        this.betAmount = 15 - (this.rounds * 5);
        this.betAmount === 0 ? this.betAmount = 1:this.betAmount = this.betAmount;
        this.betText.setText("Current Bet: $0");
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
            let found = false;
            for(let i = 0; i<5; i++)
            {
                if(!this.flipped[i])
                {
                    this.fiveCard[i].flipSprite();
                    this.flipped[i] = true;
                    found = true;
                    this.totalBet += this.betAmount;
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
        this.fold = this.add.button(50, 550, 'fold', function()
        {
            for(let i =0; i<5; i++)
            {
                if(!this.flipped[i])
                {
                    this.flipped[i] = true;
                }
            }
            
            this.endGame(false);
        }, this);
        
        this.fold.scale.setTo(0.6, 0.6);
    },
    setCardsRandom: function()
    {
        //Set card arrays
        this.hand = this.pokerData.Hands[this.rand];
        this.dealerHand = this.pokerData.Dealer[this.rand];
        this.fiveCard = this.pokerData.FiveCard[this.rand];
        this.winText = this.pokerData.WinText[this.rand];
        
        this.prepCards();
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
        
        this.displayCards(this.hand, 400, 520, 200, false, 0.8);
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
        this.fiveCard.forEach(function(card)
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
        this.betText.setText("Current Bet: $"+this.totalBet);
    }
};
/*Copyright (C) Wayside Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written and maintained by Wayside Co <info@waysideco.ca>, 2018*/
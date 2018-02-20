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
    },
    initVariables: function()
    {
        //Choose a random value in the indices of available hands
        this.rand = Math.floor(Math.random() * this.pokerData.Hands.length);
        //Initialize bet variables
        this.totalBet = 0;
        this.betAmount = 15 - (this.rounds * 5);
        this.betAmount === 0 ? this.betAmount = 1:this.betAmount = this.betAmount;
        this.betText = this.add.text(40, 50, "Current Bet: $0", {fill: '#FFFFFF'});
        //Boolean to start the glow sequence
        this.glowSequence = false;
        //Boolean check for which cards still need flipped of the 5
        this.flipped = [false, false, false, false, false];
        //If it is not the final round set the cards with a random selection
        if(this.rounds < 3)
        {
            this.setCardsRandom();
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
                this.endGame();
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
                this.endGame();
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
            
            this.endGame();
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
    endGame: function()
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
        this.glowSequence = true;
        this.runGlowSequence();
        console.log('endGame');
        console.log(this.flipped);
    },
    runGlowSequence: function()
    {
        let playerText = this.add.text(800, 500, this.pokerData.WinText[this.rand][0], {fill: '#FF0000', font: '50px Arial'});
        playerText.anchor.setTo(0.5, 0.5);
        playerText.alpha = 0;
        let playerDeclaration = this.add.tween(playerText).to({alpha: 1}, 2000, "Linear");
        let playerRemove = this.add.tween(playerText).to({alpha: 0}, 100, "Linear");
        
        let data = this.pokerData.Glow[this.rand][0];
        let last = playerDeclaration;
        for(let i = 0, len = data.length; i<len; i++)
        {
            if(data[i])
            {
                this.fiveCard[i].addGlow();
                let glowE = this.add.tween(this.fiveCard[i].glow).to({alpha: 1}, 1000, "Linear");
                let glowOut = this.add.tween(this.fiveCard[i].glow).to({alpha: 0}, 1000, "Linear");
                last.chain(glowE);
                glowE.chain(glowOut);
                last=glowOut;
            }
        }
        
        
        
        let dealerText = this.add.text(160, 150, this.pokerData.WinText[this.rand][1], {fill: '#FF0000', font: '50px Arial'});
        let dealerRemove = this.add.tween(dealerText).to({alpha: 0}, 100, "Linear");
        dealerText.anchor.setTo(0.5, 0.5);
        dealerText.alpha = 0;
        let dealerDeclaration = this.add.tween(dealerText).to({alpha: 1}, 2000, "Linear");
        
        data = this.pokerData.Glow[this.rand][1];
        
        last.chain(playerRemove);
        playerRemove.chain(dealerDeclaration);
        last = dealerDeclaration;
        
        for(let i = 0, len = data.length; i<len; i++)
        {
            if(data[i])
            {
                this.fiveCard[i].addGlow();
                let glowE = this.add.tween(this.fiveCard[i].glow).to({alpha: 1}, 1000, "Linear");
                let glowOut = this.add.tween(this.fiveCard[i].glow).to({alpha: 0}, 1000, "Linear");
                last.chain(glowE);
                glowE.chain(glowOut);
                last=glowOut;
            }
        }
        last.chain(dealerRemove);
        playerDeclaration.start();
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
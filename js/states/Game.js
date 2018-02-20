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
        //Initialize bet variables
        this.totalBet = 0;
        this.betAmount = 15 - (this.rounds * 5);
        this.betAmount === 0 ? this.betAmount = 1:this.betAmount = this.betAmount;
        this.betText = this.add.text(40, 50, "Current Bet: $0", {fill: '#FFFFFF'});
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
            for(let i =0; i<5; i++)
            {
                if(!this.flipped[i])
                {
                    this.flipped[i] = true;
                    found = true;
                    this.totalBet += this.betAmount;
                    break;
                }
            }
            
            if(!found)
            {
                //end game
                console.log('endGame');
            }
            console.log(this.flipped);
        }, this);
        
        this.bet.scale.setTo(0.4, 0.4);
        
        //Call Button
        this.call = this.add.button(50, 480, 'fold', function()
        {
            for(let i =0; i<5; i++)
            {
                if(!this.flipped[i])
                {
                    this.flipped[i] = true;
                }
            }
            
            console.log('endGame');
            console.log(this.flipped);
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
            
            console.log('endGame');
            console.log(this.flipped);
        }, this);
        
        this.fold.scale.setTo(0.6, 0.6);
    },
    setCardsRandom: function()
    {
        //Choose a random value in the indices of available hands
        let rand = Math.floor(Math.random() * this.pokerData.Hands.length);
        //Set card arrays
        this.hand = this.pokerData.Hands[rand];
        this.dealerHand = this.pokerData.Dealer[rand];
        this.fiveCard = this.pokerData.FiveCard[rand];
        this.winText = this.pokerData.WinText[rand];
        //Create the cards for the arrays
        this.hand = this.createCards(this.hand);
        this.dealerHand = this.createCards(this.dealerHand);
        this.fiveCard = this.createCards(this.fiveCard);
        
        this.displayCards(this.hand, 350, 440, 200);
        this.displayCards(this.dealerHand, 350, 50, 200);
        this.displayCards(this.fiveCard, 150, 250, 150);
        
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
    displayCards: function(cardArray, startX, startY, offset)
    {
        for(let i=0, len = cardArray.length; i<len; i++)
        {
            cardArray[i].addSprite((startX + i*offset), startY);
        }
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
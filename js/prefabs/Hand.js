//Sets up Hands
var Poker = Poker || {};


Poker.Hand = function(state) {
     //Initalizes state side data locally
     this.state = state;
     this.game = state.game; 
     
     Poker.Hand.prototype.init = function(cards)
     {
         this.hand = cards;
         
         return this;
     };
     Poker.Hand.prototype.addCard = function(card, index)
     {
         if(this.hand.length < 6 && index === null)
         {
             this.hand[this.hand.length] = card;
         }
         else if(index<5)
         {
             this.hand[index] = card;
         }
     };
     Poker.Hand.prototype.sameSuit = function()
     {
         var currentSuit = this.hand[0].suit;
         
         for(var i=1, len=this.hand.length; i<len; i++)
         {
             if(this.hand[i].suit != currentSuit)
             {
                 return false;
             }
         }
         return true;
     };
     Poker.Hand.prototype.insertionSort = function()
     {
         var returnArray = [this.hand[0]];
         var added = false;
         
         for(var i=1, len=this.hand.length; i<len; i++)
         {
             for(var j=0, retlen = returnArray.length; j<retlen; j++)
             {
                 if(this.hand[i].value<returnArray[j].value)
                 {
                     returnArray.splice(j, 0, this.hand[i]);
                     added=true;
                     break;
                 }
             }
             if(!added)
             {
                 returnArray[returnArray.length]=this.hand[i];
             }
             added=false;
         }
         return returnArray;
     };
     Poker.Hand.prototype.bucketSort = function()
     {
         var returnArray=[[this.hand[0]]];
         var added = false;
         
         for(var i=1, len=this.hand.length; i<len; i++)
         {
             for(var j=0, retlen = returnArray.length; j<retlen; j++)
             {
                 if(this.hand[i].value === returnArray[j][0].value)
                 {
                     returnArray[j][returnArray[j].length]=this.hand[i];
                     added=true;
                 }
             }
             if(!added)
             {
                 returnArray[returnArray.length]=[this.hand[i]];
             }
             added=false;
         }
         return returnArray;
     };
    Poker.Hand.prototype.checkHand = function()
    {
        console.log(`SameSuit: ${this.sameSuit()}`);
        if(this.sameSuit())
        {
            var ordered = this.insertionSort();
            console.log(ordered);
            
            for(var i=1; i<5; i++)
            {
                if(ordered[i].value != ordered[i-1].value+1)
                {
                    return 4;
                }
            }
            if(ordered[0].value===10)
            {
                return 0;
            }
            else
            {
                return 1;
            }
        }
        else
        {
            var ordered = this.bucketSort();
            console.log(ordered);
            
            if(ordered.length === 5)
            {
                ordered = this.insertionSort();
                for(var i=1; i<5; i++)
                {
                    if(ordered[i].value != ordered[i-1].value+1)
                    {
                        return 9;
                    }
                }
                return 5;
            }
            else if(ordered.length === 4)
            {
                return 8;
            }
            else if(ordered.length === 3)
            {
                for(var i=0; i<3; i++)
                {
                    if(ordered[i].length === 3)
                    {
                        return 6;
                    }
                    else if(ordered[i].length === 2)
                    {
                        return 7;
                    }
                }
            }
            else if(ordered.length === 2)
            {
                for(var i=0; i<2; i++)
                {
                    if(ordered[i].length === 4)
                    {
                        return 2;
                    }
                    else if(ordered[i].length === 3)
                    {
                        return 3;
                    }
                }
            }
        }
    };
    Poker.Hand.prototype.getDealerHand = function()
    {
        //Use player hand to choose better or worse hand 
        var handType = this.checkHand();
        if(this.state.pokerData.WinHands[this.state.rounds] === "Lose")
        {
            var rand = Math.floor(Math.random() * handType);
            
            for(var i=0; i<5; i++)
            {
                if(rand!=0)
                {
                    this.state.dealerHand.hand[i].changeCard(this.state.pokerData.DealerHands[rand][i]);
                }
                this.state.dealerHand.hand[i].flipSprite();
            }
        }
        else
        {
            var rand = Math.floor(Math.random() * (this.state.pokerData.DealerHands.length-(handType+1)));
            var dealer = this.state.pokerData.DealerHands;
            dealer.reverse();
            console.log(dealer);
            
            for(var i=0; i<5; i++)
            {
                if(rand!=this.state.pokerData.DealerHands.length-1)
                {
                    this.state.dealerHand.hand[i].changeCard(dealer[rand][i]);
                }
                this.state.dealerHand.hand[i].flipSprite();
            }
        }
    };
};
    
Poker.Hand.prototype = Object.create(Phaser.Sprite.prototype);
Poker.Hand.prototype.constructor = Poker.Unit;

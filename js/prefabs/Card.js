//Sets up cards
var Poker = Poker || {};


Poker.Card = function(state) {
     //Intalizes state side data locally
     this.state = state;
     this.game = state.game; 
     
     Poker.Card.prototype.init = function(texture)
     {
         //Ensures that a card is not being passed in
         if(typeof(texture) === "string")
         {
             //All cards have the texture->card face, suit, value (number), sprite
            this.texture = texture;
            this.suit = this.setSuit(texture);
            this.value = this.setValue(texture, this.suit);
            this.sprite = null;
            this.glow = null;
         
            return this;
         }
         
         return texture;
     };
     Poker.Card.prototype.changeCard = function(texture)
     {
         this.texture = texture;
         this.suit = this.setSuit(texture);
         this.value = this.setValue(texture, this.suit);
     };
     Poker.Card.prototype.setSuit = function(textureString)
     {
         //Pull the suit out of the string passed in -> String structure suitDigit
         if(textureString.search('diamond') != -1)
         {
             return "diamond";
         }
         else if(textureString.search('club') != -1)
         {
             return "club";
         }
         else if(textureString.search('heart') != -1)
         {
             return "heart";
         }
         else if(textureString.search('spade') != -1)
         {
             return "spade";
         }
     };
     Poker.Card.prototype.setValue = function(textureString, suit)
     {
         //Pull the value (number) from the string passed in by removing the suit -> String structure suitDigit
         var num = textureString.replace(suit,'');
         
         //Set the number if the digit is a number (J->Jack = 11, Q->Queen = 12, K->King = 13, A->Ace = 1)
         if(num.match(/[a-z]/i))
         {
             if(num === "A")
             {
                 return 14;
             }
             else if(num === "J")
             {
                 return 11;
             }
             else if(num === "Q")
             {
                 return 12;
             }
             else if(num === "K")
             {
                 return 13;
             }
         }
         else
        {
            return parseInt(num);
        }
     };
     Poker.Card.prototype.addSprite = function(x, y, flip, scale)
     {
         if(!flip)
         {
             //Create a sprite using the card's texture (card face)
            this.sprite = this.state.add.sprite(x, y, this.texture);
         }
         else
         {
             //Create a sprite using the card's texture (card face)
            this.sprite = this.state.add.sprite(x, y, 'cardBack');
         }
         
         this.sprite.scale.setTo(scale, scale);
         this.sprite.anchor.setTo(0.5, 0.5);
         this.sprite.inputEnabled = true;
         this.sprite.events.onInputDown.add(function()
         {
             if(this.state.swap)
             {
                 console.log(this.glow);
                 if(this.glow===null)
                 {
                     this.addGlow();
                     this.state.trade[this.state.trade.length] = this;
                     console.log(this.state.trade);
                 }
                 else
                 {
                     this.glow.kill();
                     this.glow=null;
                     var currCard = this;
                     this.state.trade=this.state.trade.filter(function(trade)
                     {
                         return trade.sprite!=currCard.sprite;
                     });
                 }
             }
         }, this);
     };
    Poker.Card.prototype.flipSprite = function()
    {
        let x = this.sprite.scale.x;
        let flipStart = this.state.add.tween(this.sprite.scale).to({x: 0}, 300, "Linear", true);
        flipStart.onComplete.add(function()
        {
            this.sprite.loadTexture(this.texture);
            this.state.add.tween(this.sprite.scale).to({x: x}, 300, "Linear", true);
        }, this);
        
    };
    Poker.Card.prototype.addGlow = function()
    {
        this.glow = this.state.add.sprite(this.sprite.x, this.sprite.y, 'glow');
        this.glow.scale.setTo(this.sprite.scale.x, this.sprite.scale.y);
        this.glow.anchor.setTo(0.5, 0.5);
        this.glow.alpha=1;
        this.state.world.bringToTop(this.sprite);
    };
};
    
Poker.Card.prototype = Object.create(Phaser.Sprite.prototype);
Poker.Card.prototype.constructor = Poker.Unit;

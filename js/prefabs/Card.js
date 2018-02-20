//Sets up cards
var Poker = Poker || {};


Poker.Card = function(state) {
     //Intalizes state side data locally
     this.state = state;
     this.game = state.game; 
     
     Poker.Card.prototype.init = function(texture)
     {
         //All cards have the texture->card face, suit, value (number), sprite
         this.texture = texture;
         this.suit = this.setSuit(texture);
         this.value = this.setValue(texture, this.suit);
         this.sprite = null;
         
         return this;
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
                 return 1;
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
     Poker.Card.prototype.addSprite = function(x, y)
     {
         //Create a sprite using the card's texture (card face)
         this.sprite = this.state.add.sprite(x, y, this.texture);
         this.sprite.scale.setTo(0.8, 0.8);
     };
};
    
Poker.Card.prototype = Object.create(Phaser.Sprite.prototype);
Poker.Card.prototype.constructor = Poker.Unit;

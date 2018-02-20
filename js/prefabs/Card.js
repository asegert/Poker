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
         this.suit = this.suit(texture);
         this.value = this.value(texture, this.suit);
         this.sprite = null;
     };
     Poker.Card.prototype.suit = function(textureString)
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
     Poker.Card.prototype.value = function(textureString, suit)
     {
         //Pull the value (number) from the string passed in by removing the suit -> String structure suitDigit
         var num = textureString.replace(suit,'');
         
         //Set the number if the digit is a number (J->Jack, Q->Queen, K->King, A->Ace), number is = 10 unless ace, then set to 1 other 10 can be added in the game if needed
         if(num.match(/[a-z]/i))
         {
             if(num == "A")
             {
                 return 1;
             }
             else
             {
                 return 10;
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
     };
};
    
Poker.Card.prototype = Object.create(Phaser.Sprite.prototype);
Poker.Card.prototype.constructor = Poker.Unit;

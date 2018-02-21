var Poker = Poker || {};

Poker.EndState = {
    create: function ()
    {
        this.add.sprite(0, 0, 'end');
        this.coupon = this.add.sprite(25, 100, 'coupon');
        this.coupon.scale.setTo(0.7, 0.7);
    }
}
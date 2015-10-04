
function FriendEvent() {
    this.friendEventCobra = null;
    this.init();
}

FriendEvent.prototype.init = function() {
    this.friendEventCobra = new FriendEventCobra();
    this.friendEventCobra.connect();
};



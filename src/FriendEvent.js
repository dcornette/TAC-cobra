
function FriendEvent() {
    this.friendEventCobra = null;
    this.init();
}

FriendEvent.prototype.init = function() {
    var $this = this;
    this.friendEventCobra = new FriendEventCobra();
    document.getElementById('createUser').addEventListener('click', function(event) {
        var userName = document.getElementById('username').value;
        $this.friendEventCobra.createUser(userName);
    });
    this.friendEventCobra.connect();
};



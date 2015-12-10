module("friend_event_cobra", {
});

test("test construct friendEventCobra", 4, function( ) {
    var friendEventCobra = new FriendEventCobra();
    ok(friendEventCobra.friendEvent == null, "friendEventCobra.friendEvent == null");
    ok(friendEventCobra.cobra == null, "friendEventCobra.cobra == null");
    ok(friendEventCobra.room == null, "friendEventCobra.room == null");
    ok(friendEventCobra.dataUrl == null, "friendEventCobra.dataUrl == null");
});

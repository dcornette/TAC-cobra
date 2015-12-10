module("friend_event", {
});

test("test construct friendEvent", 5, function( ) {
    var friendEvent = new FriendEvent();
    ok(friendEvent.friendEventCobra == null, "friendEvent.friendEventCobra == null");
    ok(friendEvent.users.length == 0, "friendEvent.users.length == 0");
    ok(friendEvent.events.length == 0, "friendEvent.events.length == 0");
    ok(friendEvent.me == null, "friendEvent.me == null");
    ok(friendEvent.activeEvent == null, "friendEvent.activeEvent == null");
});

test("test getEventByName friendEvent", 2, function( ) {
    var friendEvent = new FriendEvent();
    var user = new User("user-test");
    var event1 = new Event("event-test-name1", "event-test-description", "where-test",
        "when-test", "what-test", "who-test", user);
    var event2 = new Event("event-test-name2", "event-test-description", "where-test",
        "when-test", "what-test", "who-test", user);
    var event3 = new Event("event-test-name3", "event-test-description", "where-test",
        "when-test", "what-test", "who-test", user);
    friendEvent.events.push(event1);
    friendEvent.events.push(event2);
    friendEvent.events.push(event3);

    equal(friendEvent.getEventByName("event-test-name2"), event2, "friendEvent.getEventByName('event-test-name2') == event2");
    ok(friendEvent.getEventByName("event-test-name4") == null, "friendEvent.getEventByName('event-test-name4') == null");
});

test("test getUserByName friendEvent", 2, function( ) {
    var friendEvent = new FriendEvent();
    var user1 = new User("user-test1");
    var user2 = new User("user-test2");
    var user3 = new User("user-test3");
    friendEvent.users.push(user1);
    friendEvent.users.push(user2);
    friendEvent.users.push(user3);

    equal(friendEvent.getUserByName("user-test1"), user1, "friendEvent.getUserByName('user-test1') == user1");
    ok(friendEvent.getUserByName("user-test4") == null, "friendEvent.getUserByName('user-test4') == null");
});


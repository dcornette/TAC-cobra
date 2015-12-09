module("cobra", {
});

test("test construct message", 3, function( ) {
    var user = new User("user-test");
    var message = new Message(user, "message-test", "event-test-name");
    ok(message.message == "message-test", "message.message = message-test");
    ok(message.eventName == "event-test-name", "message.eventName = event-test-name");
    equal(message.sender, user, "message.sender = user-test");
});
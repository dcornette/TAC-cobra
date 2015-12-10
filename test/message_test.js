module("message", {
});

test("test construct message", 3, function( ) {
    var user = new User("user-test");
    var message = new Message(user, "message-test", "event-test-name");
    ok(message.message == "message-test", "message.message = message-test");
    ok(message.eventName == "event-test-name", "message.eventName = event-test-name");
    equal(message.sender, user, "message.sender = user-test");
});

test("test show message", 1, function( ) {
    var user = new User("user-test");
    var message = new Message(user, "message-test", "event-test-name");

    var fixture = "";
    fixture += ('<div id="message_box"></div>');

    var fixtureNode = document.getElementById("qunit-fixture");
    fixtureNode.innerHTML = fixture;

    message.show();

    ok(document.getElementById("message_box").innerHTML ==
        '<div><span class="user_name">user-test</span> : <span class="user_message">message-test</span></div>',
        'document.getElementById("message_box").innerHTML == <div><span class="user_name">user-test</span> : <span class="user_message">message-test</span></div>');
});
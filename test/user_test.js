module("user", {
});

test("test construct user", 1, function( ) {
    var user = new User("user-test");
    ok(user.name == "user-test", "user.name = user-test");
});

test("test processCreateUser user", 3, function( ) {
    var user = new User("user-test");
    var friendEvent = new FriendEvent();

    var fixture = "";
    fixture += ('<div id="userList" class="list-group"></div>');

    var fixtureNode = document.getElementById("qunit-fixture");
    fixtureNode.innerHTML = fixture;

    ok(friendEvent.getUserByName("user-test") == null, "friendEvent.getUserByName('user-test') == null");

    user.processCreateUser(friendEvent);

    equal(friendEvent.getUserByName("user-test"), user, "friendEvent.getUserByName('user-test') == user");

    ok(document.getElementById("userList").innerHTML == '<a href="#" class="list-group-item">user-test</a>',
        "document.getElementById(\"userList\").innerHTML == '<a href=\"#\" class=\"list-group-item\">user-test</a>'");
});
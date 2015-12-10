module("event", {
});

test("test construct event", 7, function( ) {
    var user = new User("user-test");
    var event = new Event("event-test-name", "event-test-description", "where-test",
        "when-test", "what-test", "who-test", user);
    ok(event.name == "event-test-name", "event.name == event-name");
    ok(event.description == "event-test-description", "event.description = event-test-description");
    ok(event.where == "where-test", "event.where = where-test");
    ok(event.when == "when-test", "event.when == when-test");
    ok(event.what == "what-test", "event.what == what-test");
    ok(event.who == "who-test", "event.who == who-test");
    equal(event.promoter, user, "event.promoter = user-test");
});
module("cobra", {
});

test("test construct user", 1, function( ) {
    var user = new User("user-test");
    ok(user.name == "user-test", "user.name = user-test");
});

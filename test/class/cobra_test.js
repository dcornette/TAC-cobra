module("cobra", {
});

test("test construct cobra", 4, function( ) {
    var cobra = new Cobra();
    ok(cobra.url == null, "url = null");
    ok(cobra.socket == null, "socket = null");
    ok(cobra.connected == false, "connected = false");
    ok(cobra.socketId == null, "socketId = null");
});

test("test connect cobra", function ( ) {
    var cobra = new Cobra();
    cobra.connectionCallback = function () {
        ok(cobra.connected == true, "connected == true");
        QUnit.start();
    };
    cobra.connect('http://cobra-framework.com:8080');
    QUnit.stop();
    ok(cobra.url == 'http://cobra-framework.com:8080', "url = http://cobra-framework.com:8080");
    ok(typeof(cobra.socket) == "object", "socket == object / socket != null");
});

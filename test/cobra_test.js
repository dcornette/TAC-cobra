module("cobra", {
});

test("test construct cobra", 4, function( ) {
    var cobra = new Cobra();
    ok(cobra.url == null, "url = null");
    ok(cobra.socket == null, "socket = null");
    ok(cobra.connected == false, "connected = false");
    ok(cobra.socketId == null, "socketId = null");
});

test("test connect cobra", 5, function ( ) {
    var cobra = new Cobra();
    cobra.connectionCallback = function () {
        ok(cobra.connected == true, "connected == ok");
        cobra.joinRoom('test-friend-event');
    };
    cobra.joinRoomCallback = function (roomName) {
        ok(roomName == "test-friend-event", "joinedRoom == ok");
        cobra.sendMessage("Test cobra", roomName, true);
    };
    cobra.messageReceivedCallback = function (message) {
        if (message.type != 'infos') {
            ok(message.message == "Test cobra", "messagesReceived == ok");
            QUnit.start();
        }
    };
    cobra.connect('http://cobra-framework.com:8080');
    QUnit.stop();
    ok(cobra.url == 'http://cobra-framework.com:8080', "url = http://cobra-framework.com:8080");
    ok(typeof(cobra.socket) == "object", "socket == object / socket != null");
});

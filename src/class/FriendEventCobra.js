/*
 * Damien Cornette <damien.cornette@gmail.com>
 * Sébastien Joly <seb.joly21@gmail.com>
 */
function FriendEventCobra() {
    this.friendEvent = null;
    this.cobra = null;
    this.room = null;
    this.dataUrl = null;
    this.socketId = null;
}

FriendEventCobra.prototype.init = function(friendEvent, roomName) {
    this.friendEvent = friendEvent;
    this.room = roomName;
    this.dataUrl = 'http://cobra-framework.com:3000/api/events/' + roomName;
    this.cobra = new Cobra();
    this.initCobra();
};

/**
 * Connect to the Cobra server
 */
FriendEventCobra.prototype.connect = function() {
    this.cobra.connect('http://cobra-framework.com:8080');
};

/**
 * Send message to Cobra server
 * @param actionName
 * @param data
 */
FriendEventCobra.prototype.sendMessage = function (actionName, data) {
    this.cobra.sendMessage({ action : actionName, data : data }, this.room, true);
};

/**
 * Init Callback functions to the Cobra instance
 */
FriendEventCobra.prototype.initCobra = function() {
    var $this = this;

    /**
     * Connection callback
     */
    this.cobra.connectionCallback = function () {
        $this.cobra.joinRoom($this.room);
    };

    /**
     * Join room callback
     * @param roomName
     */
    this.cobra.joinRoomCallback = function (roomName) {

        // appel à l'API pour récupérer tous les messages de la room roomName
        $.ajax({
            type: 'GET',
            url: $this.dataUrl,
            success: function () {},
            error: function () {
                console.log("error when retrieve events");
            },

            complete: function (result, status) {
                for (var i = 0; i < result.responseJSON.Events.length; i++) {
                    var content = JSON.parse(result.responseJSON.Events[i].content);

                    if (content.message.action === 'createUser' && content.message.data.name != null
                        && content.message.data.name != "") {
                        var user = new User(content.message.data.name);
                        user.processCreateUser($this.friendEvent);
                    }
                }
            }
        });
    };

    /**
     * Message received callback
     * @param message
     */
    this.cobra.messageReceivedCallback = function (message) {

        // Lors de l'arrivée dans une room donne la liste des utilisateurs contenus dans la room
        if(message.type == "infos") {
            for(var i = 0; i < message.clients.length; i++) {var client = message.clients[i];}
            $this.socketId = message.socketId;
        } else if (message.message) {

            /**
             * Process createUser message
             */
            if (message.message.action === 'createUser' && message.message.data.name != null
                && message.message.data.name != "") {
                var user = new User(message.message.data.name);
                user.processCreateUser($this.friendEvent);
            }

            /**
             * Process createEvent message
             */
            if (message.message.action === 'createEvent' && message.message.data.name != null
                && message.message.data.name != "") {

                var eventObject = message.message.data;

                var event = new Event(
                    eventObject.name,
                    eventObject.description,
                    eventObject.where,
                    eventObject.when,
                    eventObject.what,
                    eventObject.who,
                    eventObject.promoter
                );
                event.processCreateEvent($this.friendEvent);
            }

        }
    };
};

/**
 * Fetch datas from cobra server
 */
FriendEventCobra.prototype.fetchDatas = function () {
    var $this = this;

    $.ajax({
        type: 'GET',
        url: $this.dataUrl,
        success: function () {},
        error: function () {
            console.log("error when retrieve events");
        },

        complete: function (result, status) {
            for (var i = 0; i < result.responseJSON.Events.length; i++) {
                var content = JSON.parse(result.responseJSON.Events[i].content);

                if (content.message.action === 'createEvent' && content.message.data.name != null
                    && content.message.data.name != "") {

                    var event = new Event(
                        content.message.data.name,
                        content.message.data.description,
                        content.message.data.where,
                        content.message.data.when,
                        content.message.data.what,
                        content.message.data.who,
                        content.message.data.promoter
                    );
                    event.processCreateEvent($this.friendEvent);
                }
            }
        }
    });
};



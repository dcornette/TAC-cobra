
function FriendEventCobra() {
    this.cobra = null;
    this.room = null;
    this.dataUrl = null;
    this.socketId = null;
    this.users = [];
    this.events = [];
    this.me = null;
    this.init('friend-event');
    this.initCobra();
}

FriendEventCobra.prototype.init = function(roomName) {
    var $this = this;
    this.cobra = new Cobra();
    this.room = roomName;
    this.dataUrl = 'http://cobra-framework.com:3000/api/events/' + roomName;
    document.getElementById('createUser').addEventListener('click', function(event) {
        event.preventDefault();
        var userName = document.getElementById('username').value;
        $this.createUser(userName);
    });
    document.querySelector('#navbar li').addEventListener('click', function (event) {
        document.getElementById('createMyEvent').style.display = 'inline';
        document.getElementById('myEvent').style.display = 'none';
        $this.removeActiveClassToLiElement(document.getElementById('left-sidebar').firstElementChild);
        $this.removeActiveClassToLiElement(document.getElementById('left-sidebar').lastElementChild);
    });
};

/**
 * Connect to the Cobra server
 */
FriendEventCobra.prototype.connect = function() {
    this.cobra.connect('http://cobra-framework.com:8080');
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
                        user.processCreateUser($this);
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
                user.processCreateUser($this);
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
                event.processCreateEvent($this);
            }

        }
    };
};

/**
 * Create user
 * @param userName
 */
FriendEventCobra.prototype.createUser = function (userName) {

    if (this.getUserByName(userName) === null) {
        this.me = new User(userName);
        this.cobra.sendMessage({ action : 'createUser', data : this.me }, this.room, true);
        this.me.connect(this);
    } else {
        alert('User ' + ' ' + userName + ' already exist !');
    }
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
                    event.processCreateEvent($this);
                }
            }
        }
    });
};

/**
 * Get event by name, return null if not exist
 * @param eventName
 * @returns {*}
 */
FriendEventCobra.prototype.getEventByName = function (eventName) {
    var events = this.events.filter(function (element, index, array) {
        return element.name === eventName;
    });

    if (events.length > 0) {
        return events[0];
    } else {
        return null;
    }
};

/**
 * Get user by name, return null if not exist
 * @param userName
 * @returns {*}
 */
FriendEventCobra.prototype.getUserByName = function (userName) {
    var users = this.users.filter(function (element, index, array) {
        return element.name === userName;
    });

    if (users.length > 0) {
        return users[0];
    } else {
        return null;
    }
};

/**
 * Remove active class on sidebar links
 * @param ul
 */
FriendEventCobra.prototype.removeActiveClassToLiElement = function (ul) {
    for (var i=0; i<ul.children.length; i++) {
        if (ul.children[i].classList.contains('active')) {
            ul.children[i].classList.remove('active');
        }
    }
};

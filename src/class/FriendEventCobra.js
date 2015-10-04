
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
        var userName = document.getElementById('username').value;
        $this.createUser(userName);
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

                    if (content.message.action === 'createUser' && content.message.data.name != null) {

                        var user = new User(content.message.data.name);

                        if ($this.getUserByName(user.name) === null) {

                            $this.users.push(user);

                            var a = document.createElement('a');
                            a.setAttribute('href', '#');
                            a.setAttribute('class', 'list-group-item');
                            a.innerHTML = user.name;
                            document.getElementById('userList').appendChild(a);
                            a.addEventListener('click', function(event) {
                                var user = $this.getUserByName(event.target.innerHTML);
                                user.connect($this);
                            });
                        }
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
            for(var i = 0; i < message.clients.length; i++)
            {
                // Contient l'id du client
                var client = message.clients[i];

            }
            // Mon id attribué par la room
            $this.socketId = message.socketId;
        } else if (message.message) {

            if (message.message.action === 'createUser' && message.message.data.name != null) {

                var user = new User(message.message.data.name);

                if ($this.getUserByName(user.name) === null) {

                    $this.users.push(user);

                    var a = document.createElement('a');
                    a.setAttribute('href', '#');
                    a.setAttribute('class', 'list-group-item');
                    a.innerHTML = user.name;
                    document.getElementById('userList').appendChild(a);
                    a.addEventListener('click', function () {
                        $this.getUserByName(user.name).connect($this);
                    });
                }
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

                if (content.message.action === 'createEvent' && content.message.data.name != null) {

                    var event = new Event(
                        content.message.data.name,
                        content.message.data.description,
                        content.message.data.where,
                        content.message.data.when,
                        content.message.data.what,
                        content.message.data.who,
                        content.message.data.promoter
                    );

                    if ($this.getEventByName(event.name) === null) {
                        $this.events.push(event);

                        var a = document.createElement('a');
                        a.setAttribute('href', '#');
                        a.innerHTML = event.name;

                        var li = document.createElement('li');
                        li.appendChild(a);

                        var leftSidebar = document.getElementById('left-sidebar');

                        if ($this.me.name === event.promoter.name) {
                            leftSidebar.firstElementChild.appendChild(li);
                            a.addEventListener('click', function(e) {

                                var targetEvent = $this.getEventByName(e.target.innerHTML);

                                targetEvent.show();

                                e.target.parentNode.setAttribute('class', 'active');
                            });
                        } else if (event.who.indexOf($this.me.name) != -1) {
                            leftSidebar.lastElementChild.appendChild(li);
                            a.addEventListener('click', function(e) {

                                var targetEvent = $this.getEventByName(e.target.innerHTML);

                                targetEvent.show();

                                e.target.parentNode.setAttribute('class', 'active');
                            });
                        }

                    }
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





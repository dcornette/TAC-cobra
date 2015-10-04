
function FriendEventCobra() {
    this.cobra = null;
    this.room = null;
    this.dataUrl = null;
    this.socketId = null;
    this.userNameList = [];
    this.me = null;
    this.init('friend-event');
    this.initCobra();
}

FriendEventCobra.prototype.init = function(roomName) {
    this.cobra = new Cobra();
    this.me = new User();
    this.room = roomName;
    this.dataUrl = 'http://cobra-framework.com:3000/api/events/' + roomName;
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
            success: function () {
                //console.log("success");
            },

            error: function () {
                console.log("error when retrieve events");
            },

            complete: function (result, status) {
                for (var i = 0; i < result.responseJSON.Events.length; i++) {
                    var content = JSON.parse(result.responseJSON.Events[i].content);

                    if (content.message.action === 'createUser' && content.message.data.name != null) {

                        var userName = content.message.data.name;

                        if ($this.userNameList.indexOf(userName) == -1) {
                            $this.userNameList.push(userName);
                            var a = document.createElement('a');
                            a.setAttribute('href', '#');
                            a.setAttribute('class', 'list-group-item');
                            a.innerHTML = userName;
                            document.getElementById('userList').appendChild(a);
                            a.addEventListener('click', function(event) {
                                $this.connectUser(new User(event.target.innerHTML));
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

                var userName = message.message.data.name;

                if ($this.userNameList.indexOf(userName) == -1) {
                    $this.userNameList.push(userName);
                    var a = document.createElement('a');
                    a.setAttribute('href', '#');
                    a.setAttribute('class', 'list-group-item');
                    a.innerHTML = userName;
                    document.getElementById('userList').appendChild(a);
                    a.addEventListener('click', function () {
                        $this.connectUser(new User(userName));
                    });
                }
            }

            if (message.message.action === 'createEvent' && message.message.data.name != null) {

            }
        }
    };
};

/**
 * Connect to the Cobra server
 */
FriendEventCobra.prototype.connect = function() {
    this.cobra.connect('http://cobra-framework.com:8080');
};

/**
 * Create user
 * @param userName
 */
FriendEventCobra.prototype.createUser = function (userName) {

    if (this.userNameList.indexOf(userName) == -1) {
        this.me.name = userName;
        this.cobra.sendMessage({ action : 'createUser', data : this.me }, this.room, true);
        this.connectUser(this.me);
    } else {
        alert('User ' + ' ' + userName + ' already exist !');
    }
};

/**
 * Connect user to Friend Event Dashboard
 * @param user
 */
FriendEventCobra.prototype.connectUser = function (user) {
    var $this = this;
    this.me = user;

    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('connectedPage').style.display = 'inline';
    document.getElementsByClassName('navbar-brand')[0].innerHTML = 'Hey ' + user.name;

    var selectWho = document.getElementById('eventWho');
    this.userNameList.forEach(function (element, index, array) {
        var optWho = document.createElement('option');
        optWho.setAttribute('value', element);
        optWho.innerHTML = element;
        selectWho.appendChild(optWho);
    });

    document.getElementById('createEvent').addEventListener('click', function() {
        var eventName = document.getElementById('eventName').value;
        var eventDescription = document.getElementById('eventDescription').value;
        var eventWhere = document.getElementById('eventWhere').value;
        var eventWhen = document.getElementById('eventWhen').value;
        var eventWhat = document.getElementById('eventWhat').value;


        var selectEventWho = document.getElementById('eventWho').options;
        var eventWho = [];

        for (var i=0; i<selectEventWho.length; i++) {
            if (selectEventWho[i].selected) {
                eventWho.push(selectEventWho[i].value);
            }
        }


        var event = new Event(eventName, eventDescription, eventWhere, eventWhen, eventWhat, eventWho, $this.me);
        $this.cobra.sendMessage({ action : 'createEvent', data : event }, $this.room, true);
    });
};

FriendEventCobra.prototype.fetchDatas = function () {

};



/*
 * Damien Cornette <damien.cornette@gmail.com>
 * Sébastien Joly <seb.joly21@gmail.com>
 */
function FriendEvent() {
    this.friendEventCobra = null;
    this.users = [];
    this.events = [];
    this.me = null;
    this.activeEvent = null;
}

/**
 * Init application
 */
FriendEvent.prototype.init = function () {
    this.friendEventCobra = new FriendEventCobra();
    this.friendEventCobra.init(this, 'friend-event');
    this.initListeners();
};

/**
 * Start application
 */
FriendEvent.prototype.start = function() {
    this.friendEventCobra.connect();
};

/**
 * Init all listeners
 */
FriendEvent.prototype.initListeners = function () {
    var $this = this;

    /**
     * Click on "créer un événement" in top navigation bar
     */
    document.querySelector('#navbar li').addEventListener('click', function (event) {
        document.getElementById('createMyEvent').style.display = 'inline';
        document.getElementById('myEvent').style.display = 'none';
        $this.removeActiveClassToLiElement(document.getElementById('left-sidebar').firstElementChild);
        $this.removeActiveClassToLiElement(document.getElementById('left-sidebar').lastElementChild);
    });

    /**
     * Click on create user in connection page
     */
    document.getElementById('createUser').addEventListener('click', function(event) {
        event.preventDefault();
        var userName = document.getElementById('username').value;
        $this.createUser(userName);
    });

    /**
     * Click on create event form
     */
    document.getElementById('createEvent').addEventListener('click', function(e) {
        e.preventDefault();
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

        $this.friendEventCobra.sendMessage('createEvent', event);
    });

    /**
     * Press enter on message input
     */
    document.getElementById('messageInput').addEventListener('keypress', function (e) {
        if (e.keyCode == 13) {
            var eventName = document.getElementById('myEventName').innerHTML;
            var message = new Message($this.me, e.target.value, eventName);

            $this.friendEventCobra.sendMessage('sendMessage', message);
        }
    });
};

/**
 * Create user
 * @param userName
 */
FriendEvent.prototype.createUser = function (userName) {

    if (this.getUserByName(userName) === null) {
        this.me = new User(userName);
        this.friendEventCobra.sendMessage('createUser', this.me);
        this.me.connect(this);
    } else {
        alert('User ' + ' ' + userName + ' already exist !');
    }
};

/**
 * Get event by name, return null if not exist
 * @param eventName
 * @returns {*}
 */
FriendEvent.prototype.getEventByName = function (eventName) {
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
FriendEvent.prototype.getUserByName = function (userName) {
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
FriendEvent.prototype.removeActiveClassToLiElement = function (ul) {
    for (var i=0; i<ul.children.length; i++) {
        if (ul.children[i].classList.contains('active')) {
            ul.children[i].classList.remove('active');
        }
    }
};

/**
 * Fetch datas from cobra server
 */
FriendEvent.prototype.fetchDatas = function () {
    this.friendEventCobra.fetchDatas();
};


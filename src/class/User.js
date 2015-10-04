
function User(name) {
    this.name = name;
}

/**
 * Process create User
 * @param friendEventCobra
 */
User.prototype.processCreateUser = function (friendEventCobra) {
    var $this = this;

    if (friendEventCobra.getUserByName(this.name) === null) {
        friendEventCobra.users.push(this);
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.setAttribute('class', 'list-group-item');
        a.innerHTML = this.name;
        document.getElementById('userList').appendChild(a);
        a.addEventListener('click', function() {
            $this.connect(friendEventCobra);
        });
    }
};

/**
 * Connect user to Friend Event Dashboard
 * @param friendEventCobra
 */
User.prototype.connect = function (friendEventCobra) {
    var $this = this;
    friendEventCobra.me = this;

    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('connectedPage').style.display = 'inline';
    document.getElementsByClassName('navbar-brand')[0].innerHTML = 'Hey ' + this.name;

    var selectWho = document.getElementById('eventWho');
    friendEventCobra.users.forEach(function (element, index, array) {
        if (element !== $this) {
            var optWho = document.createElement('option');
            optWho.setAttribute('value', element.name);
            optWho.innerHTML = element.name;
            selectWho.appendChild(optWho);
        }
    });

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

        var event = new Event(eventName, eventDescription, eventWhere, eventWhen, eventWhat, eventWho, $this);
        friendEventCobra.cobra.sendMessage({ action : 'createEvent', data : event }, friendEventCobra.room, true);
    });

    friendEventCobra.fetchDatas();
};


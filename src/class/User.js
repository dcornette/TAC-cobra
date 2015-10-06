/*
 * Damien Cornette <damien.cornette@gmail.com>
 * Sébastien Joly <seb.joly21@gmail.com>
 */
function User(name) {
    this.name = name;
}

/**
 * Process create User
 * @param friendEvent
 */
User.prototype.processCreateUser = function (friendEvent) {
    var $this = this;

    if (friendEvent.getUserByName(this.name) === null) {
        friendEvent.users.push(this);
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.setAttribute('class', 'list-group-item');
        a.innerHTML = this.name;
        document.getElementById('userList').appendChild(a);
        a.addEventListener('click', function() {
            $this.connect(friendEvent);
        });
    }
};

/**
 * Connect user to Friend Event Dashboard
 * @param friendEvent
 */
User.prototype.connect = function (friendEvent) {
    var $this = this;
    friendEvent.me = this;

    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('connectedPage').style.display = 'inline';
    document.getElementsByClassName('navbar-brand')[0].innerHTML = 'Hey ' + this.name;

    var selectWho = document.getElementById('eventWho');
    friendEvent.users.forEach(function (element, index, array) {
        if (element !== $this) {
            var optWho = document.createElement('option');
            optWho.setAttribute('value', element.name);
            optWho.innerHTML = element.name;
            selectWho.appendChild(optWho);
        }
    });
    friendEvent.fetchDatas();
};


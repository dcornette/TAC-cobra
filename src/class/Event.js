
function Event(name, description, where, when, what, who, promoter) {
    this.name = name;
    this.description = description;
    this.where = where;
    this.when = when;
    this.what = what;
    this.who = who;
    this.promoter = promoter;
}

/**
 * Process create Event
 * @param friendEventCobra
 */
Event.prototype.processCreateEvent = function (friendEventCobra) {

    if (friendEventCobra.getEventByName(this.name) === null) {
        friendEventCobra.events.push(this);

        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.innerHTML = this.name;

        var li = document.createElement('li');
        li.appendChild(a);

        var leftSidebar = document.getElementById('left-sidebar');

        if (friendEventCobra.me.name === this.promoter.name) {
            leftSidebar.firstElementChild.appendChild(li);
            a.addEventListener('click', function(e) {

                var targetEvent = friendEventCobra.getEventByName(e.target.innerHTML);
                targetEvent.show();

                friendEventCobra.removeActiveClassToLiElement(leftSidebar.firstElementChild);
                friendEventCobra.removeActiveClassToLiElement(leftSidebar.lastElementChild);

                e.target.parentNode.setAttribute('class', 'active');
            });
        } else if (this.who.indexOf(friendEventCobra.me.name) != -1) {
            leftSidebar.lastElementChild.appendChild(li);
            a.addEventListener('click', function(e) {

                var targetEvent = friendEventCobra.getEventByName(e.target.innerHTML);
                targetEvent.show();

                friendEventCobra.removeActiveClassToLiElement(leftSidebar.firstElementChild);
                friendEventCobra.removeActiveClassToLiElement(leftSidebar.lastElementChild);

                e.target.parentNode.setAttribute('class', 'active');
            });
        }
    }
};

/**
 * Affiche l'écran d'un événement
 */
Event.prototype.show = function () {
    document.getElementById('createMyEvent').style.display = 'none';
    document.getElementById('myEvent').style.display = 'inline';
    document.getElementById('myEventName').innerHTML = this.name;
    document.getElementById('myEventDescription').innerHTML = this.description;
    document.getElementById('myEventWhere').innerHTML = this.where;
    document.getElementById('myEventWhen').innerHTML = this.when;
    document.getElementById('myEventWhat').innerHTML = this.what;
    var ul = document.createElement('ul');
    this.who.forEach(function (element, index, array) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(element));
        ul.appendChild(li);
    });
    document.getElementById('myEventWho').innerHTML = '';
    document.getElementById('myEventWho').appendChild(ul);
};

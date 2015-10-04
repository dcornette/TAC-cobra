
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

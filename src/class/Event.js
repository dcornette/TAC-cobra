
function Event(name, description, where, when, what, who, promoter) {
    this.name = name;
    this.description = description;
    this.where = where;
    this.when = when;
    this.what = what;
    this.who = who;
    this.promoter = promoter;
}

Event.prototype.show = function () {
    document.getElementById('createMyEvent').style.display = 'none';
    document.getElementById('myEvent').style.display = 'inline';
    document.getElementById('myEventName').innerHTML = this.name;
    document.getElementById('myEventDescription').innerHTML = this.description;
    document.getElementById('myEventWhere').appendChild(
        document.createElement('p').appendChild(document.createTextNode(this.where))
    );
    document.getElementById('myEventWhen').appendChild(
        document.createElement('p').appendChild(document.createTextNode(this.when))
    );
    document.getElementById('myEventWhat').appendChild(
        document.createElement('p').appendChild(document.createTextNode(this.what))
    );
    var ul = document.createElement('ul');
    this.who.forEach(function (element, index, array) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(element));
        ul.appendChild(li);
    });
    document.getElementById('myEventWho').appendChild(ul);
};

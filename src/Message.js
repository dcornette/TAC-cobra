/*
 * Damien Cornette <damien.cornette@gmail.com>
 * Sébastien Joly <seb.joly21@gmail.com>
 */
function Message(sender, message, eventName) {
    this.sender = sender;
    this.message = message;
    this.eventName = eventName;
}

/**
 * Process send Message
 * @param friendEvent
 */
Message.prototype.processSendMessage = function (friendEvent) {

    friendEvent.getEventByName(this.eventName).messages.push(this);

    if (friendEvent.activeEvent === friendEvent.getEventByName(this.eventName)) {
        this.show();
    }
};

/**
 * Show message on event page
 */
Message.prototype.show = function () {
    var div = document.createElement('div');

    var spanUser = document.createElement('span');
    spanUser.className += 'user_name';
    spanUser.innerHTML = this.sender.name;

    var spanMsg = document.createElement('span');
    spanMsg.className += 'user_message';
    spanMsg.innerHTML = this.message;

    div.appendChild(spanUser);
    div.appendChild(document.createTextNode(' : '));
    div.appendChild(spanMsg);

    document.getElementById('message_box').appendChild(div);
};

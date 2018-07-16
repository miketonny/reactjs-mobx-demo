class Connections {
    constructor() {
        this.users = [];
    }

    addUser(id, sessionId) {
        const user = { id, sessionId };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        const user = this.getUser(id);
        if (user) {
            this.users = this.users.filter(u => u.id !== id); // remove the user
        }
        return user;
    }

    getUser(id) {
        return this.users.filter(user => user.id === id)[0];
    }

    getUserList(session) {
        const users = this.users.filter(user => user.sessionId === session);
        const ids = users.map(user => user.id);
        return ids;
    }

    getCurrentRooms() {
        const sessionsWithUsers = this.users.filter(user => user.sessionId);
        return sessionsWithUsers.map(user => user.sessionId);
    }
}

module.exports = { Connections };

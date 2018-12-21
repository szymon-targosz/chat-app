const expect = require('expect');
const { Users } = require('./users');

let users;
beforeEach(() => {
    users = new Users();
    users.users = [{
        id: '1',
        name: 'Masha',
        room: 'Node course'
    }, {
        id: '2',
        name: 'Alina',
        room: 'Node course'
    }, {
        id: '3',
        name: 'Tatyana',
        room: 'React course'
    }];
});

describe('Users', () => {
    it('should add new user', () => {
        const resUser = users.addUser('4', 'Elena', 'Python course');
        expect(resUser).toEqual({
            id: '4',
            name: 'Elena',
            room: 'Python course'
        });
        expect(users.users.length).toBe(4);
    });

    it('should return names for Node course', () => {
        const names = users.getUsersList('Node course');
        expect(names).toEqual(['Masha', 'Alina']);
    });

    it('should return names for React course', () => {
        const names = users.getUsersList('React course');
        expect(names).toEqual(['Tatyana']);
    });

    it('should remove a user', () => {
        const user = users.removeUser('2');
        expect(users.users.length).toBe(2);
        expect(user).toEqual({
            id: '2',
            name: 'Alina',
            room: 'Node course'
        });
    });

    it('should not remove a user', () => {
        const user = users.removeUser('10');
        expect(users.users.length).toBe(3);
        expect(user).toBeFalsy();
    });

    it('should find user', () => {
        const user = users.getUser('1');
        expect(user).toEqual(users.users[0]);
    });

    it('should not find user', () => {
        const user = users.getUser('4');
        expect(user).toBeFalsy();
    });
});
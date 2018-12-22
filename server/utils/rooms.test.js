const expect = require('expect');
const { Rooms } = require('./rooms');

let rooms;
beforeEach(() => {
    rooms = new Rooms();
    rooms.rooms = ['node', 'react'];
});

describe('Rooms', () => {
    it('should add new room', () => {
        rooms.addRoom('python');
        expect(rooms.rooms.length).toBe(3);
        expect(rooms.rooms[2]).toBe('python')
    });

    it('should remove a room', () => {
        rooms.removeRoom('react');
        expect(rooms.rooms.length).toBe(1);
    });    

    it('should not remove a room', () => {
        rooms.removeRoom('sass');
        expect(rooms.rooms.length).toBe(2);
    });    

    it('should return rooms', () => {
        const res = rooms.getRooms();
        expect(res).toEqual(['node', 'react']);
    });    
});
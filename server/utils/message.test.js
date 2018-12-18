const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const from = 'Admin';
        const text = 'New user joined';
        const message = generateMessage(from, text);
        
        expect(message).toEqual({
            from,
            text,
            createdAt: expect.any(Number)
        });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        const from = 'Masha';
        const latitude = 78.939148;
        const longitude = 19.733577;
        const message = generateLocationMessage(from, latitude, longitude);
        
        expect(message).toEqual({
            from,
            url: `https://www.google.com/maps?q=${latitude},${longitude}`,
            createdAt: expect.any(Number)
        });
    });
});
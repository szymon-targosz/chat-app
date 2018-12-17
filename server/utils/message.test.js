const expect = require('expect');
const { generateMessage } = require('./message');

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
const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        const res = isRealString({ age: 21 });
        expect(res).toBe(false);
    });

    it('should reject strings with only spaces', () => {
        const res = isRealString('    ');
        expect(res).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        const res = isRealString('  masha ');
        expect(res).toBe(true);
    });
});
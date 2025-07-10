import * as Icons from '@/icons';

describe('icons index', () => {
    it('should export all icons as defined values', () => {
        Object.values(Icons).forEach((Icon) => {
            expect(Icon).toBeDefined();
        });
    });
});

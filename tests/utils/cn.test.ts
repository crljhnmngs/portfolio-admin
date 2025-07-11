import { cn } from '@/utils/cn';

describe('cn utility', () => {
    it('should merge class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should deduplicate class names', () => {
        expect(cn('foo', 'foo', 'bar')).toBe('foo foo bar');
    });

    it('should handle conditional classes', () => {
        expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('should merge tailwind classes correctly', () => {
        // tailwind-merge should keep the last conflicting class
        expect(cn('p-2', 'p-4')).toBe('p-4');
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should handle empty and undefined values', () => {
        expect(cn('foo', undefined, '', null, 'bar')).toBe('foo bar');
    });
});

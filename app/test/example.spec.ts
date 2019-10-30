import { expect } from 'chai';
import { example } from '../src/example';

describe('Example object', () => {
    it('should return true', () => {
        expect(example() == true);
    });
});

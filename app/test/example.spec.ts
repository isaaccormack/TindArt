import { example } from '../src/example';
import { expect } from 'chai';
import 'mocha';


describe('Example test', () => {
    
    it('should return a boolean', () => {
        expect(example()).to.be.a("boolean");
    });

    it('should return true', () => {
        expect(example()).to.equal(true);
    });
});

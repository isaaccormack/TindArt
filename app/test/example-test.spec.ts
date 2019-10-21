import { expect } from 'chai';
import 'mocha';

describe('Example test', () => {
    
    it('should return true', () => {
        function example_func() {
            return true;
        }
        const result:boolean = example_func();
        expect(result).to.equal(true);
    });
});

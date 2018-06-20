import React from 'react'; 
import {shallow} from 'enzyme'; 
import {findByTestAttr} from './testUtils';
import Checkbox from '../components/Checkbox';

describe('checkbox in header column', () => {
    //mock fake functions ========================
    //const sendEventToParentWindowMock = jest.fn(); 
    const checkChange = jest.fn();
    const setup = (props) => {
        const setupProps = { ...props};
        return shallow(<Checkbox {...setupProps} onChange={checkChange}/>);
    }
    let wrapper
    beforeEach(() => {
        wrapper = setup();
    }); 
    test('render without crashing', () => {
        const checkbox = findByTestAttr(wrapper, 'component-checkbox');
        expect(checkbox.length).toBe(1);
    });
    
    test('checkbox on check change fire event', () => {
        wrapper.instance().handleCheck();
        expect(checkChange).toBeCalled();
    });
    


});



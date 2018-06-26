import React from 'react'; 
import {shallow} from 'enzyme'; 
import {findByTestAttr, fakeStore} from './testUtils';
import {ColumnStatus, ColumnType} from '../models/Enum';
import Header from '../components/StreamHeader'; 


describe('header on live stream page', () => {
    let wrapper;   
    let store = fakeStore;
    const lockForm = jest.fn(() => {
        store.ui.formLocked = !store.ui.formLocked;
    });
    beforeEach(() =>{         
        store.ui.formLocking = lockForm;
        const setup = (props) => {
            return shallow(<Header.wrappedComponent {...props} rootStore={store} />);
        };
        wrapper = setup();
    });

    test('renders with no problem', () => {      
        const headerComponent = findByTestAttr(wrapper, 'header-component');
        expect(headerComponent.length).toBe(1);
    });
    
    test('shows the current sessionID', ()=> {
        wrapper.setProps({sessionID: '12345'});
        const sessionIDTag = findByTestAttr(wrapper, 'session-idtag');
        expect(sessionIDTag.text()).toBe('12345');
    });

    test('click on lock button sends locking back to server, sets the locked flag', () => { 
        const lockBtn = findByTestAttr(wrapper, 'lock-button');
        store.ui.formLocked = true;
        expect(lockBtn.length).toBe(1);
        //click on lock button invokes server send api function
        lockBtn.simulate('click');
        expect(lockForm).toBeCalled();
        //set the lock flag
        expect(store.ui.formLocked).toBeFalsy();
    });

    test('group & sorting dropdown renders', () => {
        const groupDropDown = findByTestAttr(wrapper, 'group-selection');
        expect(groupDropDown.length).toBe(1);
    });

});

 
import React from 'react'; 
import {shallow} from 'enzyme'; 
import {findByTestAttr, fakeStore} from './testUtils'; 
import StreamControl from '../components/StreamControl'; 


describe('control section of live stream, handles tab view changes etc', () => {
    let wrapper;
    const store = fakeStore;
    beforeEach(() => {
        const setup = (props) => {
            return shallow(<StreamControl.wrappedComponent {...props} rootStore={store} />);
        };
        wrapper = setup();
    });

    test('renders no crash', () => {
        const controlComponent = findByTestAttr(wrapper, 'stream-control-component');
        expect(controlComponent.length).toBe(1);
    });

    test('displays the current Live Stream status', () => {
        const statusComp = findByTestAttr(wrapper, 'stream-status'); 
        expect(statusComp.text()).toBe('Running');
    });



});



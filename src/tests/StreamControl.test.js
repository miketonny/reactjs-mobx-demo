import React from 'react'; 
import {shallow} from 'enzyme'; 
import {findByTestAttr, fakeStore} from './testUtils'; 
import StreamControl from '../components/StreamControl'; 


describe('control section of live stream, handles tab view changes etc', () => {
    let wrapper;
    const store = fakeStore;
    const progressClick = jest.fn((e) => {
        switch(e){
            case "1":
                store.ui.currentTable = 'Metric';
                break;
            case "2":
                store.ui.currentTable = 'Progress';
                break;
            case "3":
                store.ui.currentTable = 'LiveTag';
                break;
            default:
            break;
        } 
         
    });
    const modalBtnClick = jest.fn(() => {
        if(store.ui.currentTable === 'Metric') store.ui.showMetricsModal = true;    
        else if(store.ui.currentTable === 'Progress') store.ui.showProgressiveModal = true;
        else return; //live tag do nothing when clicked..
    });
    beforeEach(() => {
        store.ui.tabSelectionChanged = progressClick;
        store.ui.showTableColumnSelection = modalBtnClick;
        const setup = (props) => {
            return shallow(<StreamControl.wrappedComponent {...props} rootStore={store} 
         />);
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

    test('shows how many units connected in current session', () => {
        const unitsComp = findByTestAttr(wrapper, 'stream-units-connected');
        expect(unitsComp.length).toBe(1);
        //make sure the unit count matches the unit displays
        expect(unitsComp.text()).toBe("15");
    });

    test('click on modal button while in progress tab will show up the column selection for progress', () => {
        const modalBtn = findByTestAttr(wrapper, 'stream-control-modal-button');
        expect(modalBtn.length).toBe(1);
        store.ui.currentTable = 'Progress'; //show progressive column selection
        modalBtn.simulate('click');
        expect(modalBtnClick).toBeCalled();
        expect(store.ui.showProgressiveModal).toBeTruthy();
        expect(store.ui.showMetricsModal).toBeFalsy();
    });

    test('selecting progress radio will hide all metrics table and show progressive table', () => {
        const progressBtn = findByTestAttr(wrapper, 'progress-radio');
        const event = {target:{id: 'q157', value: "2"}};
        progressBtn.simulate('change', event);
        //changes the current table selection in ui store
        expect(progressClick).toHaveBeenCalled();
        expect(store.ui.currentTable).toBe('Progress'); 
    });

    test('selecting all metric radio will hide progress table and live tag table', () => {
        const progressBtn = findByTestAttr(wrapper, 'progress-radio');
        const event = {target:{id: 'q156', value: "1"}};
        progressBtn.simulate('change', event);
        //changes the current table selection in ui store
        expect(progressClick).toHaveBeenCalled();
        expect(store.ui.currentTable).toBe('Metric'); 
    });

    test('selecting live tag radio will hide progress table and all metric table', () => {
        const progressBtn = findByTestAttr(wrapper, 'progress-radio');
        const event = {target:{id: 'q158', value: "3"}};
        progressBtn.simulate('change', event);
        //changes the current table selection in ui store
        expect(progressClick).toHaveBeenCalled();
        expect(store.ui.currentTable).toBe('LiveTag'); 
    });
});
 


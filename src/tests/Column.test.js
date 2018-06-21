import React from 'react'; 
import {shallow, mount} from 'enzyme'; 
import {findByTestAttr, fakeStore} from './testUtils';
import {ColumnStatus, ColumnType} from '../models/Enum';
import Column from '../components/Column'; 


describe('data column with trim', () => {
    const toggleFn = jest.fn();
    const cellCheck = jest.fn();
    let wrapper;
    const rowIndx = 1;
    beforeEach(() => {
        let store = fakeStore;
        store.data.athletes = [
            {id: '12345', name: 'mike', 'periods': []}
        ];
        store.data.getData();
        store.ui.toggleStartStop = jest.fn(() => {
            wrapper.setProps({colStatus: ColumnStatus.Processing});
            toggleFn(); //fake test function
        });
        store.ui.checkOneRow = cellCheck;
        store.ui.showNextTrim = jest.fn(() => {
            wrapper.setProps({show: false});

        });

        const setup = (props) => { 
            //fake prop data passed from parent component..
            let setupProps = {
                data: [{
                    select: false, 
                    status: 'Not Started'
                },{
                    select: false, 
                    status: 'Not Started'
                }],
                title: 'test',
                colType: 'trim',
                colStatus: ColumnStatus.Idle,
                show: true,
                ...props
            }
            return mount(<Column.wrappedComponent rootStore={store} {...setupProps} 
               />);
        }
        wrapper = setup(); 
    });
    test('renders without crashing', () => {
        const columnComponent = findByTestAttr(wrapper, 'component-data-column');
        expect(columnComponent.length).toBe(1);
    });

    test('button toggle fires start/stop signal to transporter', ()=> {
        const startButton = findByTestAttr(wrapper, 'column-start-button'); 
        expect(startButton.length).toBe(1);
        startButton.simulate('click'); 
        expect(wrapper.props().colStatus).toBe(ColumnStatus.Processing);
        expect(toggleFn).toHaveBeenCalled();
    });

    test('while status is processing, toggle shouldnt work', () => {
        wrapper.setProps({colStatus: ColumnStatus.Processing});
        const startButton = findByTestAttr(wrapper, 'button-toggle-start'); 
        expect(startButton.props().disabled).toBeTruthy();
        wrapper.instance().startStop(); 
        // known issue Enzyme #386 expect(toggleFn).toHaveBeenCalledTimes(0);
    });

    test('clicking on athlete cell fires row selection event', () => {
        const cells = findByTestAttr(wrapper, 'component-cell'); 
        wrapper.instance().cellClicked(rowIndx);  
        expect(cellCheck).toHaveBeenCalledTimes(1);
        // //mock updated props, child props cant be updated with enzyme, forbidded
        // wrapper.setProps({data: [{
        //     select: false, 
        //     status: 'Not Started'
        // },{
        //     select: true, 
        //     status: 'Not Started'
        //     }],
        // });
        // wrapper.instance().forceUpdate();
        // console.log(cells.at(rowIndx).debug());
        // expect(cells.at(rowIndx).hasClass('row-checked')).toBeTruthy();
    });

    test('click end on header cell fires end trim event', () => {
        const hideTrim = findByTestAttr(wrapper, 'column-header-trim');
        expect(hideTrim.length).toBe(1);
        wrapper.instance().nextTrim();
        wrapper.update();
        //column shall be hidden after click 
        expect(wrapper.find('td').hasClass('hide-column')).toBeTruthy();
    });
    
    test('click end on header cell should not fire hide split event as its a trim', () => {
        const hideSplit = findByTestAttr(wrapper, 'column-header-split');
        expect(hideSplit.length).toBe(0);
    });
    


});
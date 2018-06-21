import React from 'react'; 
import {shallow, mount} from 'enzyme'; 
import {findByTestAttr, fakeStore} from './testUtils';
import {ColumnStatus, ColumnType} from '../models/Enum';
import Column from '../components/Column';

describe('data column with trim/split', () => {
    const toggleFn = jest.fn();
    let wrapper;
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
        store.ui.checkOneRow = (indx) => jest.fn(() => {
                wrapper.setProps({data: [{
                    select: true, 
                    status: 'Not Started'
                }],
            });
        });

        const setup = (props) => { 
            //fake prop data passed from parent component..
            const setupProps = {
                data: [{
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

    // test('clicking on athlete cell fires row selection event', () => {
    //     const cell = findByTestAttr(wrapper, 'component-cell'); 
    //     wrapper.instance().cellClicked(0); 
    //     expect(cell.hasClass('row-checked')).toBeTruthy();
    // });

    test('click red x on header cell fires hide split event', () => {

    });
    
    test('click green tick on header cell fires end trim event', () => {

    });
    


});
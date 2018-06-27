import React from 'react'; 
import {shallow, mount} from 'enzyme'; 
import {findByTestAttr, fakeStore} from './testUtils'; 
import Table from '../components/MetricTable'; 


describe('all metric data table', ()=> {
    const store = fakeStore;
    let wrapper;
    beforeEach(() => {
        const setup = (props) =>{
            return mount(<Table.wrappedComponent {...props}  rootStore={store}/>);
        }
        wrapper = setup();
    });
    test('render no crash', ()=> {
        const tbl = findByTestAttr(wrapper, 'metric-data-table');
        expect(tbl.length).toBe(1);
    });

    test('jump column hidden from user as its show property is false', () => {
        const columns = findByTestAttr(wrapper, 'metric-data-column');
        //locate jumps column
        const jumpCol = columns.find('div[children="Jumps"]').parent();
        expect(jumpCol.hasClass('hide-column')).toBeTruthy();   //jump column should be hidden as in mock object its show is false.
    });

});
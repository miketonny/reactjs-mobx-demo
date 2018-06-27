import React from 'react'; 
import {shallow} from 'enzyme'; 
import {findByTestAttr, fakeStore} from './testUtils'; 
import Column from '../components/MetricDataColumn'; 


describe('all metrics data table`s data columns, consists of a sticker+name+position + multiple selectable data column', ()=> {

    const store = fakeStore;
    let wrapper;
    beforeEach(() => {
        const setup = (props) =>{
            const setupProp = {data: ['Bester, Gerrit', 'Dixon, Ben Jason'], title: 'Athlete', ...props};
            return shallow(<Column {...setupProp}  rootStore={store}/>);
        }
        wrapper = setup();
    });
    test('render no crash', ()=> {
        const column = findByTestAttr(wrapper, 'metric-data-column');
        expect(column.length).toBe(1);
    });



});
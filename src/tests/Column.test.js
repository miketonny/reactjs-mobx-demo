import React from 'react'; 
import {shallow, mount} from 'enzyme'; 
import {findByTestAttr} from './testUtils';
import Column from '../components/Column';

describe('data column with trim/split', () => {
    const store = {
        data: {},
        ui: {}
      }; 
    test('renders without crashing', () => {
        const setup = (props) => { 
            //fake prop data passed from parent component..
            const setupProps = {
                data: [],
                title: 'test',
                colType: 'trim',
                show: true,
                props
            }
            return shallow(<Column.wrappedComponent rootStore={store} {...setupProps} />);
        }
        const wrapper = setup(); 
        const columnComponent = findByTestAttr(wrapper, 'component-data-column');
        expect(columnComponent.length).toBe(1);
    });

    test('button toggle fires start/stop signal to transporter', ()=> {

    });

    test('clicking on athlete cell fires row selection event', () => {

    });

    test('click red x on header cell fires hide split event', () => {

    });
    
    test('click green tick on header cell fires end trim event', () => {

    });
    


});
import React from 'react'; 
import {shallow, mount} from 'enzyme'; 
import {findByTestAttr, fakeStore} from './testUtils'; 
import DataCell from '../components/DataCell'; 
 
let wrapper;
const setup = (props) => {
    const setupProps = { ...props};
    return shallow(<DataCell {...setupProps} />);
}
const handleClick = jest.fn(() => {
    wrapper.setProps({select: true});
});

test('render without crashing', () => {
    wrapper = setup();
    const cell = findByTestAttr(wrapper, 'component-data-cell');
    expect(cell.length).toBe(1);
});

test('click to toggle selection on the cell', () => {
    wrapper = setup({select: false, click: handleClick}); //default not selected
    const cell = findByTestAttr(wrapper, 'component-data-cell');
    cell.simulate('click');
    wrapper.update();
    //after clicking, toggle function handle click
    expect(handleClick).toBeCalled(); 
});
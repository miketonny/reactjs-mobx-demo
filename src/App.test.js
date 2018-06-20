import React from 'react'; 
import {shallow} from 'enzyme'; 
import {findByTestAttr} from './tests/testUtils';
 
import App from './App'; 

const setup = () => {
    const store = {
      data: {},
      ui: {}
    }; 
    const wrapper = shallow(<App.wrappedComponent rootStore={store}/>);
    return wrapper;
}

test('renders without crashing', () => {
  const wrapper = setup();
  const appComp = findByTestAttr(wrapper, 'component-app');
  expect(appComp.length).toBe(1);
});
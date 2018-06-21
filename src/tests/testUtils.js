
import {ColumnStatus, ColumnType} from '../models/Enum';
/**
 * Return node(s) with the given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper.
 * @param {string} val - Value of data-test attribute for search.
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test="${val}"]`);
  }


export const fakeStore = {
    data: {
      data: [
          {title: 'head', type: ColumnType.Other, show: true, status: ColumnStatus.Idle, data: [
              {select: false, name: 'mike', group:'', position: '', statGroup: '', id: '12345'}
          ]},
          {title: 'trim', type: ColumnType.Trim, show: true, status: ColumnStatus.Idle, data: [
              {status: 'Not Started', select: false}
          ]},
      ],
      getData: jest.fn()
    },
    ui: {
        toggleStartStop:{} ,
        checkOneRow: {}
    }, 
}
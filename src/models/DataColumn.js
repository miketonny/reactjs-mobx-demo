import { observable, computed, action } from "mobx";

export default class DataColumn {
    @observable title;
    @observable type;
    @observable show = true;
    @observable status;
    @observable data = [];
}
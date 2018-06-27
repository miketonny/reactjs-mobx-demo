
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
      metricAthletes: [
        {
           
            Sticker:"<div class='sticker-athlete text-center'><label>3</label></div>",
            SignalStrength:"<span style='width:auto;  height:30px;'></span>",
            Athlete:"Bester, Gerrit",Position:"Prop",
            HR:"<div class='heart-rate'><img src='/Content/Images/hrDisconnected.png'></img><span> --</span></div>",
            Distance:"1868m", Sprints:"0",    HiintHRDuration:"00:00",  HiintHRDistance:"0m", HiintSpDuration:"00:21", HiintSpDistance:"341m",
            EC:"0",Duration:"103:49",AvgSpeed:"1km/h",MaxSpeed:"79.1km/h",
            AvgHR:"0bpm",MaxHR:"0bpm",JumpRate:"0",Jumps:"0",ImpactRate:"0",
            BodyImpacts:"0",DistanceRate:"18m/min",StatsGroup:null,PositionalGroup:"Tight Forwards",type:""
        },
        {
           
            Sticker:"<div class='sticker-athlete text-center'><label>3</label></div>",
            SignalStrength:"<span style='width:auto;  height:30px;'></span>",
            Athlete:"Dixon, Ben Jason",Position:"Prop",
            HR:"<div class='heart-rate'><img src='/Content/Images/hrDisconnected.png'></img><span> --</span></div>",
            Distance:"1868m", Sprints:"0",    HiintHRDuration:"00:00",  HiintHRDistance:"0m", HiintSpDuration:"00:21", HiintSpDistance:"341m",
            EC:"0",Duration:"103:49",AvgSpeed:"1km/h",MaxSpeed:"79.1km/h",
            AvgHR:"0bpm",MaxHR:"0bpm",JumpRate:"0",Jumps:"0",ImpactRate:"0",
            BodyImpacts:"0",DistanceRate:"18m/min",StatsGroup:null,PositionalGroup:"Tight Forwards",type:""
        },
      ],
      allMetricData: [{title: 'sig', name: 'SignalStrength', data:[], show:true}, {title: 'sticker', name:'sticker', data: [], show:true},
      {title: 'Athlete', name:'Athlete', data:[], show:true}, {title: 'Position', name:'Position', data:[], show:true}, {title: 'Heart Rate', name:'HR', data:[], show:true},
      {title: 'Total Distance', name:'Distance', data:[], show:true}, {title: 'Total Sprints', name:'Sprints', data:[], show:true},  {title: 'HR Hi Dur', name:'HiintHRDuration', data:[], show:true},
      {title: 'HR Hi Dist', name:'HiintHRDistance', data:[], show:true},{title: 'Sp Hi Dur', name:'HiintSpDuration', data:[], show:true},
      {title: 'Sp Hi Dist', name:'HiintSpDistance', data:[], show:true},{title: 'Energy Cons.', name:'EC', data:[], show:true}, 
      {title: 'Total Duration', name:'Duration', data:[], show:true},{title: 'Avg Speed', name:'AvgSpeed', data:[], show:true},
      {title: 'Max Speed', name:'MaxSpeed', data:[], show:false},{title: 'Avg HR', name:'AvgHR', data:[], show:true},
      {title: 'Max HR', name:'MaxHR', data:[], show:true},{title: 'Jump Rate', name:'JumpRate', data:[], show:true},
      {title: 'Jumps', name:'Jumps', data:[], show:false},{title: 'Impact Rate', name:'ImpactRate', data:[], show:true},   
      {title: 'Body Impacts', name:'BodyImpacts', data:[], show:true},{title:  'Distance Rate', name:'DistanceRate', data:[], show:true},
      {title: 'StatsGroup', name:'StatsGroup', data:[], show:true},{title: 'PositionalGroup', name:'PositionalGroup', data:[], show:true},
      {title: 'type', name:'type', data:[], show:true}],
      getData: jest.fn()
    },
    ui: {
        toggleStartStop:{} ,
        checkOneRow: {},
        formLocking: {},
        sessionStatus: 'Running', 
        unitsConnected: 15,
        currentTable: 'Metric',
        tabSelectionChanged:{},
        showTableColumnSelection: {}
    }, 
}
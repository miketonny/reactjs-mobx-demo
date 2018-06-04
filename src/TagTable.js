import React, { Component } from 'react'; 
import Checkbox from './Checkbox';
import DataCell from './DataCell';
 
class ToggleButton extends Component{
    handleClick(){
        this.props.toggle(this.props.colHead, this.props.text);
    }
    render(){
        if(this.props.text==='start'){
            return <button className="btn toggle-button" onClick={this.handleClick.bind(this)}><i className="fas fa-play"></i></button>
        }else{
            return <button className="btn toggle-button" onClick={this.handleClick.bind(this)}><i className="fas fa-stop"></i></button>
        } 
    }
}

class TagTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            dataColumns: this.props.columns,
            dataRows: this.props.rows, 
        }  
    } 
    checkAll(){ 
        this.props.selectAll();
    }
    //clicking on cells on a row to select/deselect that row...
    checkChanged(indx){
        //update checkbox status when checkboxes are checked... 
        this.props.selectionChanged(indx);
    }
    startStop(colHead, toggle){ 
            //start/stop the split/trim in selected column...
            this.props.startStopToggle(colHead,toggle);
    }
    nextTrim(e){  
       this.props.goNext(e.target.closest('.col-sm-3').dataset.colindx);
    }

    hideSplit(e){
        //get column index of the split..
        this.props.hideSplit(e.target.closest('.col-sm-3').dataset.colindx); 
    }

    render(){
        let cols = this.state.dataColumns;
        let rows = this.state.dataRows;
        return <div className="col-md-9"><table className="table ">
            <thead>
                <tr>{cols.map((c,i)=>{
                    if(i<2){
                        return <th key={i}></th>; // first two columns empty header
                    }else{
                        if(!c.show) {return null;}
                        if(c.type === 'trim'){
                            return <th key={i}><div><span className="col-sm-3" onClick={this.nextTrim.bind(this)} data-colindx = {i}><i className="fas fa-check"  ></i></span><span className="col-sm-6">{c['title']}</span><span className="col-sm-3"></span></div></th>;
                        }else{ 
                            return <th key={i}><div><span className="col-sm-3"><i className="fas fa-eye" ></i></span><span className="col-sm-6">{c['title']}</span><span className="col-sm-3" data-colindx = {i} onClick={this.hideSplit.bind(this)}><i className="fas fa-times" ></i></span></div></th>; //split cant complete...
                        }
                    
                    }      
                })}
                </tr>
            </thead>
            <tbody>          
                    {rows.map((r,i)=>{
                        if (i===0 || i === 1){
                            //returning header control rows
                            if(i===0){
                                return <tr key={i}><td colSpan='2' ><button className="btn" onClick={this.checkAll.bind(this)}>Select All</button></td>
                                    {cols.filter((c,k)=> k>1).map((c,k)=>{  
                                           let colIndx = k+2; //k starts at 0 again, trim/split start at 2..
                                           if(!c.show) {return null;}
                                           return <td key={colIndx}><ToggleButton text='start'   colHead={cols[colIndx].title} toggle={this.startStop.bind(this)}>start</ToggleButton>
                                           <ToggleButton  text='stop'  colHead={cols[colIndx].title} toggle={this.startStop.bind(this)}/></td>;
                                    })}                                
                                </tr>
                            }else{
                                return null;
                            }                         
                        }
                        return   <tr key={i}>
                            {cols.map((c,k)=>{
                                if(k===0){
                                    return <td key={k}><Checkbox rowIndex={i} onChange={this.checkChanged.bind(this)} status={r.select}/></td>;
                                }
                                let colTitle = c.title;
                                if(k>1 && !c.show) {return null;}
                                let className = r[colTitle] === 'Running'? 'running' : r[colTitle] === 'Stopped'? 'stopped': r[colTitle] === 'Not Started' ? 'italic' : '';
                                let checkClass = r.select === true ? 'row-checked' : '';
                                return <DataCell key={k} rowIndex={i} click={this.checkChanged.bind(this)} class={className + ' ' + checkClass} text={r[colTitle]}/>;
                            })}                        
                        </tr>;
                    })
                    }            

            </tbody>



        </table></div>
    }

}

export default TagTable;
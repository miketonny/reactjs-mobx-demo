import React, { Component } from 'react'; 
class Modal extends Component{ 
    handleClose(){
        this.props.handleClose();
    }
    render(){
        const showHideClassname = this.props.show ? 'modal display-block' : 'modal display-none';
        if(!this.props.show){
            return null;
        }
        return <div id='modal' className={showHideClassname}>
        <section className="modal-main">
          {this.props.children} 
        </section>
      </div>
    }
}

export default Modal;
import React from 'react';

class RemoveComponent extends React.Component {
   constructor(props){
      super(props)
   }
   render() {
      return (
        <button data-tag={this.props.tag} className={this.props.className} onClick={this.props.onClick}>
        X
        </button>
      )
   }
}

 export default RemoveComponent;
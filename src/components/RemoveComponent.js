import React, {useState,useEffect,useContext} from 'react';

class RemoveComponent extends React.Component {
   render() {
      return (
        <button {...this.props}>
        X
        </button>
      )
   }
}

 export default RemoveComponent;
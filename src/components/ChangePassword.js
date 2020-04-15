import React, { useContext, useCallback, useState } from 'react';
import { doChangePassword} from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth'
import '../App.css';

function ChangePassword() {
    const currentUser = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    console.log(currentUser);
    
    return ();
}
export default ChangePassword;
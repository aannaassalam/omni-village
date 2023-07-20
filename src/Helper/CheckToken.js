import {AsyncStorage} from 'react-native';

export const CheckToken = () =>{
    const token = AsyncStorage.getItem('token');
    if(token){
        return true
    }
    else{
        return false
    }
}
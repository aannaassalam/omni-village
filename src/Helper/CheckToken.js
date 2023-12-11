import {storage} from './Storage';

export const CheckToken = () => {
  const token = storage.getString('token');
  // const token = storage.set('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDEwZTk4Mjk4YjY1ZGFhMzMyZDVlMSIsImlhdCI6MTY5NTU2Mjc1NH0.StmkNPdK49EHbqmVxQI8n_geQkmm4cQZ-qureaHkWFY')
  // console.log("my token", token)
  if (token !== undefined || token !== null) {
    return true;
  } else {
    return false;
  }
};

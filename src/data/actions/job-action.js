
  import axios from 'axios';
  import {EdrCSVParser} from '../../services/data-parser'
  export const toggleJob = job => ({
    type: 'TOGGLE_JOB',
    job
  });

  export const selectAllJob = (isSelected) => ({
      type: 'SELECT_ALL',
      isSelected
  })

  export const onJobDataReceived = (jobs) => ({
    type: 'JOB_DATA_RECEIVED',
    jobs
})


  
  export const deSelectAllJob = () => ({
    type: 'DE_SELECT_ALL'
});
export function fetchJobData() {
    return function (dispatch) {
        axios.get('./data.csv').then(response => {
            const jobs = EdrCSVParser(response.data);
            dispatch(onJobDataReceived(jobs));
        }).catch(err => {
            dispatch(onJobDataReceived([]));
        })
    }
}

 
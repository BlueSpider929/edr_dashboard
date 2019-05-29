
const jobReducer = (state = [], action) => {
    switch (action.type) {
      case 'SELECT_ALL':
        return [
          ...(state.map(job => {
              job.isSelected = action.isSelected;
                return job;
            }
              
              ))
        ]
    case 'DE_SELECT_ALL':
        return [
          ...(state.map(job => job.isSelected = false))
        ]
      case 'TOGGLE_JOB':
        return state.map(
          job =>
            job.jobName === action.job.jobName ? { ...job, isSelected: !job.isSelected } : job
        )
    case 'JOB_DATA_RECEIVED':
        return action.jobs || []
      default:
        return state
    }
  }
  
  export default jobReducer;
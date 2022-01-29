export default (state, action) => {
  switch(action.type){
    case "SET_USERID":
      return{
        ...state,
        userID: action.payload
      }
    case "SET_MYSKY":
      return{
        ...state,
        mySky: action.payload
      }
    case "SET_CONTENTRECORD":
      return{
        ...state,
        contentRecord: action.payload
      }
    default:
      return state;
  }
}

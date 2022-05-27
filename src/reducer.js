export const initialState = {
    memories: [],
    edit:{
        id:"",
        creator:"",
        title:"",
        message:"",
        tags:"",
    },
    isEdit:false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_TO_MEMORY":
        return {
          ...state,
          memories: action.item,
        };
        case "DELETE_MEMORY":
            return{
                ...state,
                memories:state.memories.filter(item=>item._id !==action._id),
            }
        case "EDIT_MEMORY":
            return{
                ...state,
                edit:action.edit,
                isEdit:true,
            }
        case "CLEAR_FORM":
            return{
                ...state,
                edit:action.clear,
                isEdit:false
            }
        
        default:
        return state;
    }
};
export default reducer;
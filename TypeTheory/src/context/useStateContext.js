import { useContext } from "react";
import StateContext from "./StateContext";

const useStateContext = () => useContext(StateContext);

export default useStateContext;

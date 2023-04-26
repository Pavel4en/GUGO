// Redux interfaces
import {IPet} from "../interfaces";

export interface IPetSetup {
    type: "pet/petSetup",
    payload: IPet
}

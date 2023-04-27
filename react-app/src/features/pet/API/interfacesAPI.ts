// Pet API interfaces
import {IAPIAnswer} from "../../../utils/webInterfaces";
import {IPet} from "../interfaces";

export interface IAPIPet extends IAPIAnswer {
    data: IPet
}

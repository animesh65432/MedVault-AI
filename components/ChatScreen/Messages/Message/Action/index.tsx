import { ActionType } from "@/types";
import React from 'react';
import AddDocument from './AddDocumnent';
import CreateMedicine from "./CreateMedicine";
import CreateRecord from "./CreateRecord";
import CreateReminder from "./CreateReminder";

type Props = {
    Action: ActionType;
}

const Action: React.FC<Props> = ({ Action }) => {
    return (
        <>
            {Action === "ADD_DOCUMENT" && <AddDocument />}
            {Action === "CREATE_MEDICINE" && <CreateMedicine />}
            {Action === "CREATE_RECORD" && <CreateRecord />}
            {Action === "CREATE_REMINDER" && <CreateReminder />}
        </>
    )
}

export default Action
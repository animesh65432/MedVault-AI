import { DocumentType } from "@/types"
import React from 'react'
import { StyleSheet, View } from "react-native"
import DischargeSummary from "./DischargeSummary"
import Generic from "./Generic"
import LabRePort from "./LabReport"
import MedicalBill from "./MedicalBill"
import Prescription from "./Prescription"
import PrescriptionReceipt from "./PrescriptionReceipt"
import RadiologyReport from "./RadiologyReport"
import ReferralLetter from "./ReferralLetter"

type Props = {
    Document: DocumentType
}

const DocumentResult: React.FC<Props> = ({ Document }) => {
    return (
        <View style={styles.container}>
            {Document.doc_type === "Prescription" &&
                <Prescription Document={Document} />
            }
            {Document.doc_type === "Prescription Receipt" &&
                <PrescriptionReceipt />
            }
            {Document.doc_type === "Lab Report" &&
                <LabRePort />
            }
            {Document.doc_type === "Radiology Report" &&
                <RadiologyReport />
            }
            {Document.doc_type === "Medical Bill" &&
                <MedicalBill />
            }
            {Document.doc_type === "Discharge Summary" &&
                <DischargeSummary />
            }
            {Document.doc_type === "Referral Letter" &&
                <ReferralLetter />
            }
            {Document.doc_type === "Insurance Document" &&
                <Generic />
            }
            {Document.doc_type === "Consent Form"
                && <Generic />
            }
            {Document.doc_type === "Medical History Record"
                && <Generic />
            }
            {Document.doc_type === "Other"
                && <Generic />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default DocumentResult
import { DocumentRow } from '@/types'
import { scale } from '@/utils/scale'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'

type IconLib = 'Fontisto' | 'Entypo' | 'FontAwesome5'

const TYPE_ICON: Record<DocumentRow['type'], { lib: IconLib; name: string }> = {
    "Prescription": { lib: 'FontAwesome5', name: 'pills' },
    "Prescription Receipt": { lib: 'FontAwesome5', name: 'receipt' },
    "Lab Report": { lib: 'Entypo', name: 'lab-flask' },
    "Radiology Report": { lib: 'Fontisto', name: 'file-1' },
    "Medical Bill": { lib: 'FontAwesome5', name: 'file-invoice-dollar' },
    "Discharge Summary": { lib: 'Fontisto', name: 'file-1' },
    "Referral Letter": { lib: 'Fontisto', name: 'email' },
    "Insurance Document": { lib: 'FontAwesome5', name: 'shield-alt' },
    "Consent Form": { lib: 'Fontisto', name: 'file-1' },
    "Medical History Record": { lib: 'Fontisto', name: 'file-1' },
    "Other": { lib: 'Fontisto', name: 'file-1' },
}

export const DocIcon: React.FC<{ type: DocumentRow['type'] }> = ({ type }) => {
    const config = TYPE_ICON[type] ?? TYPE_ICON["Other"]
    const props = { name: config.name, size: scale(20), color: "#23423B" }

    if (config.lib === 'Entypo') return <Entypo {...props} />
    if (config.lib === 'FontAwesome5') return <FontAwesome5 {...props} />
    return <Fontisto {...props} />
}
import { FileUp, CheckCircle2, CreditCard, Award } from "lucide-react"

interface UploadSlotProps {
  title: string
  description: string
  icon: React.ReactNode
  isUploaded: boolean
}

const UploadSlot = ({ title, description, icon, isUploaded }: UploadSlotProps) => (
  <div className={`relative group border-2 border-dashed rounded-2xl p-6 transition-all ${
    isUploaded ? 'border-green-500/50 bg-green-500/5' : 'border-slate-800 hover:border-blue-500/50 bg-slate-900/30'
  }`}>
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl ${isUploaded ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
        {isUploaded ? <CheckCircle2 size={24} /> : icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-slate-200">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">
        {isUploaded ? "Change" : "Upload"}
      </button>
    </div>
  </div>
)

export function DocumentUploadZone() {
  return (
    <div className="space-y-4 py-4">
      <UploadSlot 
        title="Government Issued ID"
        description="National ID, Passport or Driver's License."
        icon={<CreditCard size={24} />}
        isUploaded={false} 
      />
      <UploadSlot 
        title="Business Proof"
        description="Business card or Registration certificate."
        icon={<Award size={24} />}
        isUploaded={false}
      />
    </div>
  )
}
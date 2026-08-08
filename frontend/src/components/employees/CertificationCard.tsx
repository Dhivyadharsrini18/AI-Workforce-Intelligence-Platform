import { Award, ExternalLink } from 'lucide-react';
import type { Certification } from '../../types/employee';

export default function CertificationCard({ cert }: { cert: Certification }) {
  const isExpired = cert.status === 'expired';
  
  return (
    <div className={`card p-4 flex gap-4 ${isExpired ? 'opacity-60' : ''}`}>
      <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
        <Award className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{cert.name}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {cert.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{cert.issuer}</p>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>Earned: {new Date(cert.earned_date).toLocaleDateString()}</span>
          {cert.credential_id && (
            <button className="flex items-center hover:text-primary-500 transition-colors">
              Verify <ExternalLink className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

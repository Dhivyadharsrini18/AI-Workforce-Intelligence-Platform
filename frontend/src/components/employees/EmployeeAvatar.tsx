
interface EmployeeAvatarProps {
  firstName: string;
  lastName: string;
  status?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
};

const statusSizeMap = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-4 h-4 border-2',
  xl: 'w-6 h-6 border-2',
};

export default function EmployeeAvatar({ 
  firstName, 
  lastName, 
  status, 
  size = 'md',
  className = ''
}: EmployeeAvatarProps) {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  
  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-sm`}>
        {initials}
      </div>
      {status && (
        <div 
          className={`absolute bottom-0 right-0 ${statusSizeMap[size]} rounded-full border border-white dark:border-gray-900 ${
            status === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={status}
        />
      )}
    </div>
  );
}

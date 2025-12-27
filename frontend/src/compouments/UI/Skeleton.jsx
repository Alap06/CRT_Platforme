import React from 'react';

export const SkeletonText = ({ width = '100%', lines = 1, className = '' }) => (
    <div className={className}>{Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 rounded skeleton mb-2 last:mb-0" style={{ width: i === lines - 1 && lines > 1 ? '60%' : width }} />
    ))}</div>
);

export const SkeletonAvatar = ({ size = 40, className = '' }) => (
    <div className={`rounded-full skeleton ${className}`} style={{ width: size, height: size }} />
);

export const SkeletonCard = ({ className = '' }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
        <div className="flex items-center gap-4 mb-4"><SkeletonAvatar size={48} /><div className="flex-1"><SkeletonText width="40%" /><SkeletonText width="60%" /></div></div>
        <SkeletonText lines={3} />
    </div>
);

export const SkeletonStatCard = ({ className = '' }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className}`}>
        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg skeleton" /><div className="flex-1"><div className="h-3 rounded skeleton w-24 mb-2" /><div className="h-7 rounded skeleton w-16" /></div></div>
    </div>
);

export const SkeletonDashboard = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><SkeletonCard /><SkeletonCard /></div>
    </div>
);

export const SkeletonTable = ({ rows = 5, columns = 5 }) => (
    <div className="animate-fade-in">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex gap-4">
            {Array.from({ length: columns }).map((_, i) => <div key={i} className="h-4 rounded skeleton flex-1" />)}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full skeleton" />
                {Array.from({ length: columns - 1 }).map((_, j) => <div key={j} className="h-4 rounded skeleton flex-1" />)}
            </div>
        ))}
    </div>
);

export default { Text: SkeletonText, Avatar: SkeletonAvatar, Card: SkeletonCard, StatCard: SkeletonStatCard, Dashboard: SkeletonDashboard, Table: SkeletonTable };

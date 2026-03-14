import React from 'react';
import { BrushCleaning, GraduationCap, MapPin, ShieldCheck, Sparkles, Wrench } from 'lucide-react';

const mapPins = [
    {
        icon: Wrench,
        label: 'Plumbing',
        position: 'top-[18%] left-[16%]',
        tone: 'bg-sky-500/20 text-sky-100 border-sky-300/30'
    },
    {
        icon: BrushCleaning,
        label: 'Cleaning',
        position: 'top-[28%] right-[14%]',
        tone: 'bg-emerald-500/20 text-emerald-100 border-emerald-300/30'
    },
    {
        icon: GraduationCap,
        label: 'Tutoring',
        position: 'bottom-[24%] left-[18%]',
        tone: 'bg-amber-500/20 text-amber-100 border-amber-300/30'
    },
    {
        icon: ShieldCheck,
        label: 'Verified Pro',
        position: 'bottom-[18%] right-[12%]',
        tone: 'bg-violet-500/20 text-violet-100 border-violet-300/30'
    }
];

const metrics = [
    { value: '250+', label: 'active providers nearby' },
    { value: '40+', label: 'service types mapped' },
    { value: '4.8/5', label: 'community trust score' }
];

const AuthShowcase = ({ eyebrow, title, description }) => {
    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_32%),linear-gradient(145deg,_#081225_0%,_#10203d_42%,_#1a3866_100%)] p-8 text-white shadow-[0_40px_120px_rgba(8,18,37,0.45)] lg:p-12">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute left-[8%] top-[12%] h-px w-[38%] rotate-12 bg-white/60" />
                <div className="absolute right-[6%] top-[22%] h-px w-[34%] -rotate-12 bg-white/50" />
                <div className="absolute left-[14%] bottom-[26%] h-px w-[48%] -rotate-6 bg-white/50" />
                <div className="absolute right-[18%] bottom-[18%] h-px w-[26%] rotate-[18deg] bg-white/50" />
                <div className="absolute left-[28%] top-[14%] h-[68%] w-px rotate-6 bg-white/30" />
                <div className="absolute left-[52%] top-[8%] h-[74%] w-px -rotate-3 bg-white/20" />
                <div className="absolute right-[22%] top-[20%] h-[58%] w-px rotate-12 bg-white/20" />
            </div>

            <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-16 translate-y-16 rounded-full bg-primary-300/20 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
                        <Sparkles size={16} className="text-cyan-200" />
                        {eyebrow}
                    </div>

                    <div className="max-w-xl space-y-4">
                        <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.85rem]">
                            {title}
                        </h2>
                        <p className="max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="relative mx-auto flex w-full max-w-2xl items-center justify-center">
                    <div className="relative aspect-[1.05/1] w-full max-w-[32rem] rounded-[2rem] border border-white/15 bg-white/8 p-6 shadow-2xl backdrop-blur-sm">
                        <div className="absolute inset-5 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.12),_rgba(255,255,255,0.03))]" />
                        <div className="absolute left-[18%] top-[16%] h-28 w-28 rounded-full border border-cyan-200/30 bg-cyan-300/10 blur-sm" />
                        <div className="absolute bottom-[18%] right-[20%] h-24 w-24 rounded-full border border-primary-200/30 bg-primary-300/10 blur-sm" />

                        <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-slate-950/30 shadow-[0_0_60px_rgba(96,165,250,0.25)] backdrop-blur">
                            <div className="absolute inset-3 rounded-full border border-cyan-200/20" />
                            <div className="absolute inset-6 rounded-full border border-primary-200/20" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-lg shadow-primary-500/20">
                                <MapPin size={28} strokeWidth={2.2} />
                            </div>
                        </div>

                        {mapPins.map(({ icon: Icon, label, position, tone }) => (
                            <div
                                key={label}
                                className={`absolute ${position} flex items-center gap-3 rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-sm ${tone}`}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{label}</p>
                                    <p className="text-xs text-white/70">Local neighborhood service</p>
                                </div>
                            </div>
                        ))}

                        <div className="absolute left-[12%] top-[48%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.85)]" />
                        <div className="absolute left-[44%] top-[24%] h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.85)]" />
                        <div className="absolute right-[18%] top-[46%] h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.85)]" />
                        <div className="absolute bottom-[16%] left-[40%] h-3 w-3 rounded-full bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.85)]" />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm"
                        >
                            <p className="text-2xl font-bold text-white">{metric.value}</p>
                            <p className="mt-1 text-sm text-slate-200">{metric.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthShowcase;
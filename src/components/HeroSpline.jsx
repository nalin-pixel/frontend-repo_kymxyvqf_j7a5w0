import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <section className="relative w-full h-[280px] sm:h-[360px] md:h-[440px] rounded-2xl overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/6zY3vVsfvG6bxL2M/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white pointer-events-none" />
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center pointer-events-none">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Selamat Datang di Sistem Absensi</h2>
        <p className="text-slate-600">Catat kehadiran dengan cepat, aman, dan rapi.</p>
      </div>
    </section>
  );
}

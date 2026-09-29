import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Flame,
  Globe2,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { EconomicEvent, Language } from '../types';
import { INITIAL_ECONOMIC_EVENTS } from '../data/marketTerminalData';

interface EconomicCalendarPageProps {
  language: Language;
}

export const EconomicCalendarPage: React.FC<EconomicCalendarPageProps> = ({
  language = 'en',
}) => {
  const isId = language === 'id';
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedImpact, setSelectedImpact] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredEvents = INITIAL_ECONOMIC_EVENTS.filter((evt) => {
    if (selectedCountry !== 'ALL' && evt.country !== selectedCountry) return false;
    if (selectedImpact !== 'ALL' && evt.impact !== selectedImpact) return false;
    if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;
    return true;
  });

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'US':
        return '🇺🇸 US';
      case 'ID':
        return '🇮🇩 ID';
      case 'EU':
        return '🇪🇺 EU';
      case 'JP':
        return '🇯🇵 JP';
      case 'CN':
        return '🇨🇳 CN';
      case 'GB':
        return '🇬🇧 UK';
      default:
        return '🌐 Global';
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col p-3 sm:p-5 gap-4 bg-[#000000] overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-[#0c0f17] border border-[#1b2230] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{isId ? 'Kalender Ekonomi & Agenda Pasar' : 'Economic Calendar & Central Bank Agenda'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                GLOBAL MACRO
              </span>
            </h1>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Jadwal rilis data inflasi CPI, suku bunga BI & The Fed, NFP tenaga kerja, dan PDB'
                : 'Key global macroeconomic releases: CPI inflation, Fed & BI interest rates, GDP, and Non-Farm Payrolls'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Country filter */}
          <div className="flex items-center bg-[#161c28] rounded-xl p-0.5 border border-[#232d40] font-semibold text-[11px]">
            {['ALL', 'US', 'ID', 'EU', 'JP'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedCountry === c ? 'bg-[#2962ff] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Impact filter */}
          <div className="flex items-center bg-[#161c28] rounded-xl p-0.5 border border-[#232d40] font-semibold text-[11px]">
            {['ALL', 'high', 'medium'].map((imp) => (
              <button
                key={imp}
                onClick={() => setSelectedImpact(imp)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                  selectedImpact === imp ? 'bg-amber-600 text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {imp === 'ALL' ? 'All Impacts' : `${imp} Impact`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-[#0b0e14] border border-[#1a202c] rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121620] text-neutral-400 border-b border-[#1c2332] text-[11px] font-bold">
              <tr>
                <th className="p-3.5 whitespace-nowrap">{isId ? 'Waktu & Tanggal' : 'Time & Date'}</th>
                <th className="p-3.5">{isId ? 'Negara' : 'Country'}</th>
                <th className="p-3.5">{isId ? 'Dampak' : 'Impact'}</th>
                <th className="p-3.5">{isId ? 'Agenda Ekonomi' : 'Economic Release / Event'}</th>
                <th className="p-3.5 text-right">{isId ? 'Aktual' : 'Actual'}</th>
                <th className="p-3.5 text-right">{isId ? 'Prakiraan' : 'Forecast'}</th>
                <th className="p-3.5 text-right">{isId ? 'Sebelumnya' : 'Previous'}</th>
                <th className="p-3.5 text-center">{isId ? 'Kategori' : 'Category'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171c26] text-white">
              {filteredEvents.map((event) => {
                const isHigh = event.impact === 'high';
                return (
                  <tr
                    key={event.id}
                    className="hover:bg-[#131722]/80 transition-colors group cursor-default"
                  >
                    {/* Time & Date */}
                    <td className="p-3.5 font-mono whitespace-nowrap">
                      <div className="font-bold text-neutral-200">{event.time} WIB</div>
                      <div className="text-[10px] text-neutral-500">{event.date}</div>
                    </td>

                    {/* Country */}
                    <td className="p-3.5 font-bold whitespace-nowrap">
                      <span className="px-2 py-1 rounded-lg bg-[#161c28] border border-[#232d40] text-neutral-300">
                        {getCountryFlag(event.country)}
                      </span>
                    </td>

                    {/* Impact */}
                    <td className="p-3.5 whitespace-nowrap">
                      {isHigh ? (
                        <div className="flex items-center gap-1 text-rose-400 font-bold bg-rose-950/30 px-2 py-0.5 rounded-lg border border-rose-800/40 w-fit">
                          <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          <span className="text-[10px] uppercase">High</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/20 px-2 py-0.5 rounded-lg border border-amber-800/30 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="text-[10px] uppercase">Medium</span>
                        </div>
                      )}
                    </td>

                    {/* Event Name */}
                    <td className="p-3.5 font-semibold text-neutral-200 group-hover:text-white">
                      {event.event}
                    </td>

                    {/* Actual */}
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                      {event.actual || '-'}
                    </td>

                    {/* Forecast */}
                    <td className="p-3.5 text-right font-mono text-neutral-300">
                      {event.forecast || '-'}
                    </td>

                    {/* Previous */}
                    <td className="p-3.5 text-right font-mono text-neutral-500">
                      {event.previous || '-'}
                    </td>

                    {/* Category */}
                    <td className="p-3.5 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#161c28] text-cyan-300 font-mono">
                        {event.category}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

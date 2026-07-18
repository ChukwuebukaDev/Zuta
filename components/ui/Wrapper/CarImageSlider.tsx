"use client";

import { useState,Fragment } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2, MoveHorizontal } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, A11y, Keyboard, Mousewheel, EffectFade } from "swiper/modules";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";
import "swiper/css/effect-fade";

type CarImageSliderProps = {
  images: string[];
  model: string;
};

export default function CarImageSlider({ images, model }: CarImageSliderProps) {
  const [sliderInstance, setSliderInstance] = useState<SwiperType | null>(null);
  const [modalSliderInstance, setModalSliderInstance] = useState<SwiperType | null>(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Unified slide change handler to sync thumbs state
  const handleMainSlideChange = (swiper: SwiperType) => {
    setMainIndex(swiper.activeIndex);
  };

  // Safe Jump to Thumbnail and Open Modal Showroom
  const openModal = (index: number) => {
    setMainIndex(index);
    setIsModalOpen(true);
  };

  // Sync state and slide positions between main view and modal
  const handleModalOpen = () => {
    modalSliderInstance?.slideTo(mainIndex, 0); // Jump instantly without animation to correct photo
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-[300px] md:h-[400px] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
        <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] italic text-slate-400">No Visuals Provided</p>
      </div>
    );
  }

  // --- Premium Button Styles ---
  const glassButtonClass = "p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all duration-300 active:scale-90 shadow-[0_0_15px_rgba(255,255,255,0.05)]";

  return (
    <div className="group space-y-6">
      
      {/* --- Main Stage (Standard Swiper Enabled View) --- */}
      <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl relative z-10">
        
        {/* Navigation Indicator Hint (Tap to zoom / slide) */}
        <div className="absolute top-5 left-5 z-20 flex gap-2.5 items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[9px] font-bold text-white uppercase tracking-wider">
            <MoveHorizontal size={11} className="text-slate-400" />
            <span>Slide</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[9px] font-bold text-white uppercase tracking-wider">
            <Maximize2 size={11} className="text-slate-400" />
            <span>Tap Zoom</span>
          </div>
        </div>

        {/* --- Standard Swiper Carousel View --- */}
        <Swiper
          modules={[Navigation, A11y, Keyboard, Mousewheel, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          grabCursor={true} // High-end cursor style matrix
          onSwiper={setSliderInstance} // Grab instance for controller sync
          onSlideChange={handleMainSlideChange} // Update native thumb state
          className="h-full w-full"
          onClick={() => openModal(mainIndex)} //  Tap to Zoom Showroom Event
        >
          {images.map((img, idx) => (
            <SwiperSlide key={`main-${idx}`} className="h-full w-full relative">
              <Image
                src={img}
                alt={`${model} presentation view ${idx + 1}`}
                fill
                priority={idx === 0} // Performance: Priority only for first asset
                sizes="(max-width: 1280px) 100vw, 80vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-103"
              />
              {/* Premium Gradient Scrim for controls contrast */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Navigation Arrows - Synced via Instance ID */}
        {images.length > 1 && (
          <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => sliderInstance?.slidePrev()}
              className={`${glassButtonClass} pointer-events-auto`}
            >
              <ChevronLeft size={20}  strokeWidth={2.5} />
            </button>

            <button
              type="button"
              aria-label="Next image"
              onClick={() => sliderInstance?.slideNext()}
              className={`${glassButtonClass} pointer-events-auto`}
            >
              <ChevronRight size={20}  strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Zuta Premium Counter Badge */}
        <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-tighter antialiased z-20">
          {mainIndex + 1} / {images.length}
        </div>
      </div>

      {/* --- Optimized Thumbs (Syncs to Swiper Instance State) --- */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2.5 no-scrollbar px-1 relative z-0">
          {images.map((img, idx) => (
            <button
              key={`thumb-${idx}`}
              type="button"
              onClick={() => sliderInstance?.slideTo(idx)} // ⚡ Jumps swiper natively without re-rendering logic arrays
              className={cn(
                "relative w-24 h-16 md:w-28 md:h-18 shrink-0 rounded-2xl overflow-hidden transition-all duration-500 ease-out transform",
                idx === mainIndex 
                  ? "ring-2 ring-blue-600 ring-offset-4 ring-offset-white dark:ring-offset-[#050505] scale-105 shadow-xl" 
                  : "opacity-50 hover:opacity-100 border border-slate-200 dark:border-slate-800"
              )}
            >
              <Image
                src={img}
                alt={`${model} thumbnail presentation ${idx + 1}`}
                loading="lazy"
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Active Highlight Overlay */}
              {idx === mainIndex && (
                <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}

    
      <Transition appear show={isModalOpen} as={Fragment} afterEnter={handleModalOpen}>
        <Dialog as="div" className="relative z-[999]" onClose={() => setIsModalOpen(false)}>
          
          {/* Blackout Backdrop scrim with backdrop blur matrix */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
          </Transition.Child>

          {/* Modal Container Matrix */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-0 md:p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-screen md:h-auto md:max-w-7xl md:aspect-[16/10] flex flex-col md:rounded-3xl overflow-hidden shadow-2xl relative bg-black">
                  
                  {/* Premium Modal Controls Header */}
                  <div className="absolute top-5 right-5 z-50 flex items-center gap-3">
                    {/* Native Modal Counter Display */}
                    <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-tighter antialiased">
                      {mainIndex + 1} / {images.length}
                    </div>
                    {/* High-Contrast Close Utility */}
                    <button
                      type="button"
                      aria-label="Close Showroom"
                      onClick={() => setIsModalOpen(false)}
                      className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* 🛠️ Main Fullscreen Showroom Swiper (Modal View) */}
                  <div className="flex-1 w-full h-full relative z-10 flex items-center justify-center">
                    <Swiper
                      modules={[Navigation, Pagination, A11y, Keyboard, Mousewheel, EffectFade]}
                      spaceBetween={0}
                      slidesPerView={1}
                      grabCursor={true}
                      effect="fade" // Fade effect for cleaner fullscreen transitions matrix
                      keyboard={{ enabled: true }} // Restore native key support for immersive view
                      mousewheel={{ forceToAxis: true }}
                      onSwiper={setModalSliderInstance}
                      onSlideChange={(swiper) => handleMainSlideChange(swiper)} // Sync back to main state
                      className="h-full w-full"
                    >
                      {images.map((img, idx) => (
                        <SwiperSlide key={`modal-${idx}`} className="h-full w-full relative flex items-center justify-center">
                          {/* Centered Image (Uses contain to protect aspect ratio in fullscreen) */}
                          <div className="relative w-full h-full aspect-[16/9]">
                          <Image
                            src={img}
                            alt={`${model} immersive view ${idx + 1}`}
                            fill
                            sizes="(max-width: 1536px) 100vw, 90vw"
                            className="object-contain" // 🔥 Uses contain to ensure full aspect ratio is visible without clipping on modal borders
                            priority={idx === 0}
                          />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  
                    {/* Navigation Arrows (Modal View) */}
                    {images.length > 1 && (
                      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none">
                        <button
                          type="button"
                          aria-label="Previous showroom view"
                          onClick={() => modalSliderInstance?.slidePrev()}
                          className={`${glassButtonClass} pointer-events-auto`}
                        >
                          <ChevronLeft size={24}  strokeWidth={2.5} />
                        </button>

                        <button
                          type="button"
                          aria-label="Next showroom view"
                          onClick={() => modalSliderInstance?.slideNext()}
                          className={`${glassButtonClass} pointer-events-auto`}
                        >
                          <ChevronRight size={24}  strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}
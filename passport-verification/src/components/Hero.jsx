"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, LucideCircleArrowRight } from "lucide-react"
import Image1 from "@/assets/newBcak.webp"
import Image2 from "@/assets/hero-section-img-2.jpg"
import Image3 from "@/assets/hero-section-img-3.jpg"
import Link from "next/link"

const images = [
  Image1,
  Image2,
  Image3
]

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer);
  }, [])

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + images.length) % images.length)
  }

  return (
    (<section className="relative h-[600px]">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src || "/placeholder.svg"}
          alt={`Slide ${index + 1}`}
          fill
          className={`object-cover transition-opacity duration-500 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0} />
      ))}
      <div
        className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Secure Passport Verification</h1>
          <p className="text-xl md:text-2xl mb-8">Fast, reliable, and compliant with international standards</p>

          <Button size="lg" variant="secondary" className="text-lg p-0 rounded-full bg-slate-50/70">
            <Link href="/login" className="flex items-center px-8 py-6">Go to Authority Login <LucideCircleArrowRight className="h-10 w-10 text-2xl ml-2" size={30}/></Link>
          </Button>
        </div>
      </div>
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
        aria-label="Previous image">
        <ChevronLeft className="w-6 h-6 text-black" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
        aria-label="Next image">
        <ChevronRight className="w-6 h-6 text-black" />
      </button>
    </section>)
  );
}


'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Building, Flag, Mountain, Sparkles } from 'lucide-react';

const culturalStories = [
  {
    title: 'Taktsang Palphug',
    subtitle: 'Tiger\'s Nest Monastery',
    description: 'Perched on a cliff 3,000m above sea level',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80',
    icon: Building,
  },
  {
    title: 'Paro Tsechu',
    subtitle: 'Sacred Festival',
    description: 'Witness the unfurling of the sacred Thongdrel',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80',
    icon: Flag,
  },
  {
    title: 'Traditional Architecture',
    subtitle: 'Ancient Dzongs',
    description: 'Fortress-monasteries with intricate woodwork',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80',
    icon: Mountain,
  },
  {
    title: 'Punakha Dzong',
    subtitle: 'Fortress of Great Happiness',
    description: 'Ancient fortress at the confluence of two rivers',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80',
    icon: Sparkles,
  },
];

export function CulturalStoriesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {culturalStories.map((story, index) => (
        <ScrollReveal key={index} direction="up" delay={index * 0.1}>
          <motion.div
            className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <story.icon className="w-8 h-8 mb-3" style={{ color: 'var(--primary)' }} />
              <h3 className="text-xl font-heading font-bold mb-1">{story.title}</h3>
              <p className="text-sm text-white/80 mb-2">{story.subtitle}</p>
              <p className="text-xs text-white/60">{story.description}</p>
            </div>
          </motion.div>
        </ScrollReveal>
      ))}
    </div>
  );
}
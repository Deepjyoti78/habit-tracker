import { 
  Heart, Palette, Trophy, Target, Globe, Sprout, 
  Activity, Clock, RefreshCw, Bell, Flame, 
  Zap, Book, Code, Coffee, Moon, Sun
} from 'lucide-react';

const iconMap = {
  health: Heart,
  arts: Palette,
  sport: Trophy,
  skills: Target,
  language: Globe,
  mindfulness: Sprout,
  activity: Activity,
  clock: Clock,
  refresh: RefreshCw,
  bell: Bell,
  flame: Flame,
  zap: Zap,
  book: Book,
  code: Code,
  coffee: Coffee,
  moon: Moon,
  sun: Sun
};

export const getIcon = (name) => {
  if (typeof name !== 'string') return iconMap.activity;
  return iconMap[name.toLowerCase()] || iconMap.activity;
};

export default iconMap;

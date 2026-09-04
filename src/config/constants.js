import { 
  BookOpen, 
  Laptop, 
  Shirt, 
  Home as HomeIcon, 
  Bike, 
  MoreHorizontal 
} from 'lucide-react';

export const INITIAL_CATEGORIES = [
  { id: 'study', name: 'Đồ dùng học tập', icon: BookOpen, color: 'bg-nau-primary/10 text-nau-primary' },
  { id: 'electronics', name: 'Thiết bị điện tử', icon: Laptop, color: 'bg-nau-primary/10 text-nau-primary' },
  { id: 'fashion', name: 'Thời trang', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { id: 'lifestyle', name: 'Đời sống', icon: HomeIcon, color: 'bg-green-100 text-nau-success' },
  { id: 'vehicle', name: 'Phương tiện', icon: Bike, color: 'bg-orange-100 text-orange-600' },
  { id: 'other', name: 'Khác', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600' }
];

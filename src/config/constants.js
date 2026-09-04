import { 
  BookOpen, 
  Laptop, 
  Shirt, 
  Home as HomeIcon, 
  Bike, 
  Armchair,
  GraduationCap,
  Dumbbell,
  MoreHorizontal 
} from 'lucide-react';

export const INITIAL_CATEGORIES = [
  { id: 'study', name: 'Giáo trình & Sách', icon: BookOpen, color: 'bg-nau-primary/10 text-nau-primary' },
  { id: 'electronics', name: 'Thiết bị điện tử', icon: Laptop, color: 'bg-blue-100 text-nau-blue' },
  { id: 'fashion', name: 'Thời trang & Đồng phục', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { id: 'lifestyle', name: 'Đồ dùng phòng trọ', icon: HomeIcon, color: 'bg-green-100 text-nau-success' },
  { id: 'vehicle', name: 'Xe cộ & Đi lại', icon: Bike, color: 'bg-orange-100 text-orange-600' },
  { id: 'room', name: 'Phòng trọ & Ở ghép', icon: Armchair, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'stationery', name: 'Dụng cụ học tập', icon: GraduationCap, color: 'bg-amber-100 text-amber-600' },
  { id: 'sports', name: 'Thể thao & Giải trí', icon: Dumbbell, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'other', name: 'Đồ dùng khác', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600' }
];

export const NAU_FACULTIES = [
  'Khoa Công Nghệ Thông Tin',
  'Khoa Kinh Tế & Quản Trị Kinh Doanh',
  'Khoa Kế Toán - Tài Chính',
  'Khoa Nông Lâm Ngư',
  'Khoa Ngoại Ngữ',
  'Khoa Du Lịch & Khách Sạn',
  'Khoa Luật & Quản Lý Nhà Nước',
  'Khoa Kỹ Thuật & Công Nghệ',
  'Khoa Sư Phạm',
  'Khoa Lý Luận Chính Trị & Khoa Học Cơ Bản',
  'Khác (Tự nhập tay)'
];

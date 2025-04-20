import { NewsItem, PhotoItem, User } from "../types";

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "New Technology Breakthrough",
    content:
      "Scientists have made a breakthrough in quantum computing that could revolutionize the industry.",
    date: "2025-04-19",
    author: "John Smith",
    imageUrl: "https://picsum.photos/seed/news1/800/400",
    category: "Technology",
  },
  {
    id: "2",
    title: "Mobile App Development Trends",
    content:
      "React Native continues to dominate the cross-platform mobile development landscape in 2025.",
    date: "2025-04-18",
    author: "Jane Doe",
    imageUrl: "https://picsum.photos/seed/news2/800/400",
    category: "Development",
  },
  {
    id: "3",
    title: "AI Integration in Daily Life",
    content:
      "More household devices are now incorporating artificial intelligence to enhance user experience.",
    date: "2025-04-17",
    author: "Alex Johnson",
    imageUrl: "https://picsum.photos/seed/news3/800/400",
    category: "AI",
  },
];

export const MOCK_PHOTOS: PhotoItem[] = [
  {
    id: "1",
    title: "Beautiful Sunset",
    url: "https://via.placeholder.com/300",
    description: "A stunning sunset over the mountains",
    tags: ["nature", "sunset", "mountains"],
    dateAdded: "2025-04-15",
  },
  {
    id: "2",
    title: "City Skyline",
    url: "https://via.placeholder.com/300",
    description: "Urban landscape at night",
    tags: ["city", "night", "architecture"],
    dateAdded: "2025-04-14",
  },
  {
    id: "3",
    title: "Beach Paradise",
    url: "https://via.placeholder.com/300",
    description: "Crystal clear water and white sand",
    tags: ["beach", "ocean", "vacation"],
    dateAdded: "2025-04-13",
  },
  {
    id: "4",
    title: "Forest Trail",
    url: "https://via.placeholder.com/300",
    description: "A peaceful path through the woods",
    tags: ["forest", "nature", "hiking"],
    dateAdded: "2025-04-12",
  },
  {
    id: "5",
    title: "Mountain View",
    url: "https://via.placeholder.com/300",
    description: "Majestic peaks against a clear blue sky",
    tags: ["mountains", "landscape", "hiking"],
    dateAdded: "2025-04-11",
  },
  {
    id: "6",
    title: "Desert Landscape",
    url: "https://via.placeholder.com/300",
    description: "Sandy dunes stretching to the horizon",
    tags: ["desert", "landscape", "nature"],
    dateAdded: "2025-04-10",
  },
];

export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "1",
    username: "user1",
    password: "password1",
    email: "user1@example.com",
    name: "User One",
    profileImage: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    username: "user2",
    password: "password2",
    email: "user2@example.com",
    name: "User Two",
    profileImage: "https://via.placeholder.com/150",
  },
];

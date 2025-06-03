import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
    {
        name: 'interior-vacuum.jpg',
        text: 'Interior Vacuuming',
        color: '33FF57'
    },
    {
        name: 'interior-shampoo.jpg',
        text: 'Interior Shampooing',
        color: '3357FF'
    },
    {
        name: 'interior-polish.jpg',
        text: 'Interior Polishing',
        color: 'FF33F6'
    },
    {
        name: 'wheel-cleaning.jpg',
        text: 'Wheel Cleaning',
        color: 'FF8C00'
    },
    {
        name: 'tire-shine.jpg',
        text: 'Tire Shine',
        color: '4B0082'
    },
    {
        name: 'wheel-balance.jpg',
        text: 'Wheel Balance',
        color: '800080'
    }
];

const imageDir = path.join(__dirname, 'complete-website', 'images');

// Create images directory if it doesn't exist
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Generate placeholder images
images.forEach(img => {
    const imagePath = path.join(imageDir, img.name);
    const svgContent = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#${img.color}"/>
            <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
                ${img.text}
            </text>
        </svg>
    `;
    fs.writeFileSync(imagePath, svgContent);
    console.log(`Created ${img.name}`);
}); 